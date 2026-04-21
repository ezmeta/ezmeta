import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '@/config/env';
import type { Database, Profile, AdAccount, AdMetric, AiGeneration, UserFeedback, TablesInsert, TablesUpdate } from './types';

const FALLBACK_SUPABASE_URL = 'https://example.supabase.co';
const FALLBACK_SUPABASE_ANON_KEY = 'missing-supabase-anon-key';

const resolvedSupabaseUrl = supabaseConfig.url || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const resolvedSupabaseAnonKey = supabaseConfig.anonKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!resolvedSupabaseUrl || !resolvedSupabaseAnonKey) {
  console.error(
    '❌ Supabase env missing: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local. Running in degraded mode.'
  );
}

const isValidSupabaseUrl = /^https?:\/\//.test(resolvedSupabaseUrl);

/**
 * Supabase client for database operations
 * 
 * This client is initialized with the Supabase URL and anonymous key
 * from environment variables. It's typed with our Database interface
 * to provide type safety when interacting with the database.
 */
export const supabase = createClient<Database>(
  isValidSupabaseUrl ? resolvedSupabaseUrl : FALLBACK_SUPABASE_URL,
  resolvedSupabaseAnonKey || FALLBACK_SUPABASE_ANON_KEY
);

/**
 * Helper functions for common database operations
 */

/**
 * Get a user's profile
 * @param userId The user ID
 * @returns The user's profile or null if not found
 */
export async function getUserProfile(userId: string): Promise<Profile | null> {
  if (!resolvedSupabaseUrl || !resolvedSupabaseAnonKey || !isValidSupabaseUrl) {
    console.error('Supabase is not configured correctly. Skipping profiles query during login/profile checks.');
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
  
  return data as Profile;
}

/**
 * Get a user's ad accounts
 * @param userId The user ID
 * @returns Array of ad accounts or empty array if none found
 */
export async function getUserAdAccounts(userId: string): Promise<AdAccount[]> {
  const { data, error } = await supabase
    .from('ad_accounts')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active');
  
  if (error) {
    console.error('Error fetching ad accounts:', error);
    return [];
  }
  
  return data as AdAccount[] || [];
}

/**
 * Get ad metrics for a specific ad account and date range
 * @param adAccountId The ad account ID
 * @param startDate Start date (YYYY-MM-DD)
 * @param endDate End date (YYYY-MM-DD)
 * @returns Array of ad metrics or empty array if none found
 */
export async function getAdMetrics(adAccountId: string, startDate: string, endDate: string): Promise<AdMetric[]> {
  const { data, error } = await supabase
    .from('ad_metrics')
    .select('*')
    .eq('ad_account_id', adAccountId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true });
  
  if (error) {
    console.error('Error fetching ad metrics:', error);
    return [];
  }
  
  return data as AdMetric[] || [];
}

/**
 * Get AI generations for a user
 * @param userId The user ID
 * @param limit Maximum number of records to return
 * @returns Array of AI generations or empty array if none found
 */
export async function getUserAiGenerations(userId: string, limit = 10): Promise<AiGeneration[]> {
  const { data, error } = await supabase
    .from('ai_generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching AI generations:', error);
    return [];
  }
  
  return data as AiGeneration[] || [];
}

/**
 * Submit user feedback
 * @param userId The user ID
 * @param rating Rating from 1-5
 * @param category Feedback category (Bug, Feature Request, General)
 * @param comment Optional comment
 * @returns The created feedback or null if failed
 */
export async function submitUserFeedback(
  userId: string,
  rating: number,
  category: 'Bug' | 'Feature Request' | 'General',
  comment?: string
): Promise<UserFeedback | null> {
  const { data, error } = await supabase
    .from('user_feedback')
    .insert({
      user_id: userId,
      rating,
      category,
      comment: comment || null
    } as unknown as any)
    .select()
    .single();
  
  if (error) {
    console.error('Error submitting user feedback:', error);
    return null;
  }
  
  return data as UserFeedback;
}

/**
 * Get all user feedback (for admin use)
 * @param limit Maximum number of records to return
 * @returns Array of user feedback or empty array if none found
 */
export async function getAllUserFeedback(limit = 100): Promise<UserFeedback[]> {
  const { data, error } = await supabase
    .from('user_feedback')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching user feedback:', error);
    return [];
  }
  
  return data as UserFeedback[] || [];
}

/**
 * Update AI generation with helpfulness feedback
 * @param generationId The AI generation ID
 * @param wasHelpful Whether the AI generation was helpful (yes/no)
 * @returns Success status
 */
export async function updateAiGenerationHelpfulness(
  generationId: string,
  wasHelpful: boolean
): Promise<boolean> {
  const { error } = await supabase
    .from('ai_generations')
    .update({
      feedback: wasHelpful ? 'helpful' : 'not_helpful'
    } as unknown as any)
    .eq('id', generationId);
  
  if (error) {
    console.error('Error updating AI generation helpfulness:', error);
    return false;
  }
  
  return true;
}

/**
 * Get average AI credits across all users
 * @returns Average AI credits or null if failed
 */
export async function getAverageAiCredits(): Promise<number | null> {
  const { data, error } = await supabase
    .rpc('get_average_ai_credits');
  
  if (error) {
    console.error('Error getting average AI credits:', error);
    return null;
  }
  
  return data as number;
}
