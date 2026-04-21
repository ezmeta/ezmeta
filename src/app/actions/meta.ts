'use server';

import { revalidatePath } from 'next/cache';
import { fetchAdAccounts, fetchAdInsights, formatInsightsForDatabase } from '@/lib/meta-api';
import { getUserProfile, supabase } from '@/db/client';
import { AdAccount, AdMetric } from '@/db/types';

/**
 * Get the user's Meta access token from their profile
 * @param userId The user's ID
 * @returns The user's Meta access token or null if not found
 */
export async function getUserMetaToken(userId: string): Promise<string | null> {
  try {
    const profile = await getUserProfile(userId);
    
    if (!profile || !profile.meta_access_token) {
      console.error('User profile not found or missing Meta access token');
      return null;
    }
    
    return profile.meta_access_token;
  } catch (error) {
    console.error('Error getting user Meta token:', error);
    return null;
  }
}

/**
 * Get all Ad Accounts for a user
 * @param userId The user's ID
 * @returns Array of Ad Accounts or empty array if none found
 */
export async function getUserAdAccounts(userId: string): Promise<AdAccount[]> {
  try {
    // Get user's Meta access token
    const accessToken = await getUserMetaToken(userId);
    
    if (!accessToken) {
      return [];
    }
    
    // Fetch Ad Accounts from Meta API
    const response = await fetchAdAccounts(accessToken);
    
    // Save Ad Accounts to database and return them
    const savedAccounts: AdAccount[] = [];
    
    for (const account of response.data) {
      // Check if account already exists in database
      const { data: existingAccounts } = await supabase
        .from('ad_accounts')
        .select('*')
        .eq('user_id', userId)
        .eq('meta_ad_account_id', account.account_id);
      
      if (existingAccounts && existingAccounts.length > 0) {
        const existingAccount = existingAccounts[0] as { id: string };
        // Update existing account
        const { data: updatedAccount } = await (supabase as any)
          .from('ad_accounts')
          .update({
            account_name: account.name,
            currency: account.currency,
            timezone: account.timezone_name,
            status: account.account_status === 1 ? 'active' : 'inactive',
          })
          .eq('id', existingAccount.id)
          .select();
        
        if (updatedAccount && updatedAccount.length > 0) {
          savedAccounts.push(updatedAccount[0] as AdAccount);
        }
      } else {
        // Insert new account
        const { data: newAccount } = await (supabase as any)
          .from('ad_accounts')
          .insert({
            user_id: userId,
            meta_ad_account_id: account.account_id,
            account_name: account.name,
            currency: account.currency,
            timezone: account.timezone_name,
            status: account.account_status === 1 ? 'active' : 'inactive',
          })
          .select();
        
        if (newAccount && newAccount.length > 0) {
          savedAccounts.push(newAccount[0] as AdAccount);
        }
      }
    }
    
    return savedAccounts;
  } catch (error) {
    console.error('Error getting user Ad Accounts:', error);
    return [];
  }
}

/**
 * Get Ad Insights for a specific Ad Account
 * @param userId The user's ID
 * @param adAccountId The Ad Account ID
 * @param datePreset Date preset (default: last_7d)
 * @returns Array of Ad Metrics or empty array if none found
 */
export async function getAdInsights(
  userId: string,
  adAccountId: string,
  datePreset: string = 'last_7d'
): Promise<AdMetric[]> {
  try {
    // Get user's Meta access token
    const accessToken = await getUserMetaToken(userId);
    
    if (!accessToken) {
      return [];
    }
    
    // Get the database Ad Account record
    const { data: adAccounts } = await supabase
      .from('ad_accounts')
      .select('*')
      .eq('id', adAccountId)
      .eq('user_id', userId);
    
    if (!adAccounts || adAccounts.length === 0) {
      console.error('Ad Account not found or does not belong to user');
      return [];
    }
    
    const adAccount = adAccounts[0] as AdAccount;
    
    // Fetch Ad Insights from Meta API
    const response = await fetchAdInsights(
      accessToken,
      adAccount.meta_ad_account_id,
      datePreset,
      'campaign'
    );
    
    // Format insights for database
    const formattedInsights = formatInsightsForDatabase(response.data, adAccountId);
    
    // Save insights to database
    for (const insight of formattedInsights) {
      // Check if insight already exists in database
      const { data: existingInsights } = await supabase
        .from('ad_metrics')
        .select('*')
        .eq('ad_account_id', adAccountId)
        .eq('campaign_id', insight.campaign_id)
        .eq('date', insight.date);
      
      if (existingInsights && existingInsights.length > 0) {
        const existingInsight = existingInsights[0] as { id: string };
        // Update existing insight
        await (supabase as any)
          .from('ad_metrics')
          .update({
            campaign_name: insight.campaign_name,
            adset_id: insight.adset_id,
            adset_name: insight.adset_name,
            ad_id: insight.ad_id,
            ad_name: insight.ad_name,
            spend: insight.spend,
            impressions: insight.impressions,
            clicks: insight.clicks,
          })
          .eq('id', existingInsight.id);
      } else {
        // Insert new insight
        await (supabase as any)
          .from('ad_metrics')
          .insert(insight);
      }
    }
    
    // Fetch updated metrics from database
    const { data: metrics } = await supabase
      .from('ad_metrics')
      .select('*')
      .eq('ad_account_id', adAccountId)
      .gte('date', getDateFromPreset(datePreset))
      .order('date', { ascending: false });
    
    // Revalidate dashboard page
    revalidatePath('/dashboard');
    
    return (metrics || []) as AdMetric[];
  } catch (error) {
    console.error('Error getting Ad Insights:', error);
    return [];
  }
}

/**
 * Get date from preset
 * @param datePreset Date preset (e.g., last_7d, last_30d)
 * @returns ISO date string
 */
function getDateFromPreset(datePreset: string): string {
  const today = new Date();
  let daysAgo = 7;
  
  switch (datePreset) {
    case 'last_30d':
      daysAgo = 30;
      break;
    case 'last_90d':
      daysAgo = 90;
      break;
    case 'last_7d':
    default:
      daysAgo = 7;
      break;
  }
  
  const pastDate = new Date(today);
  pastDate.setDate(today.getDate() - daysAgo);
  
  return pastDate.toISOString().split('T')[0];
}
