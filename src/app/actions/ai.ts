'use server';

import { revalidatePath } from 'next/cache';
import { generateAdCreative, AdCreativeResponse } from '@/lib/ai-service';
import { supabase } from '@/db/client';
import { AdMetric, AiGeneration } from '@/db/types';
import { hasEnoughCredits, deductCredit } from '@/lib/stripe';

type AiFeature = 'ai_creative' | 'ai_copywriter_bm';

async function canAccessAiFeature(userId: string, feature: AiFeature): Promise<boolean> {
  if (feature !== 'ai_copywriter_bm') {
    return true;
  }

  const { data: profile, error } = await (supabase as any)
    .from('profiles')
    .select('subscription_tier, subscription_status')
    .eq('user_id', userId)
    .single();

  if (error || !profile) {
    console.error('Unable to verify plan access for AI feature:', error);
    return false;
  }

  const tier = String(profile.subscription_tier || '').toLowerCase();
  const status = String(profile.subscription_status || '').toLowerCase();
  return tier === 'agency' && (status === 'active' || status === 'trial');
}

/**
 * Generate ad creative and save to database
 * @param userId User ID
 * @param adMetric Ad metric data
 * @returns Generated ad creative
 */
export async function generateAndSaveAdCreative(
  userId: string,
  adMetric: AdMetric,
  feature: AiFeature = 'ai_creative'
): Promise<AdCreativeResponse | { error: string }> {
  try {
    const hasFeatureAccess = await canAccessAiFeature(userId, feature);
    if (!hasFeatureAccess) {
      return {
        error: 'Feature restricted: AI Copywriter BM is only available for Agency plan.'
      };
    }

    // Check if user has enough credits
    const hasCredits = await hasEnoughCredits(userId);
    
    if (!hasCredits) {
      return {
        error: 'Not enough credits. Please upgrade your plan to continue generating AI content.'
      };
    }
    
    // Generate ad creative
    const creative = await generateAdCreative(adMetric);
    
    // Deduct a credit
    await deductCredit(userId);
    
    // Save to database
    await supabase
      .from('ai_generations')
      .insert({
        user_id: userId,
        ad_account_id: adMetric.ad_account_id,
        campaign_id: adMetric.campaign_id,
        campaign_name: adMetric.campaign_name,
        prompt: `Generate creative for campaign: ${adMetric.campaign_name}`,
        ad_objective: 'conversion', // Default, could be passed as parameter
        target_audience: 'General', // Default, could be passed as parameter
        product_description: 'Product/Service', // Default, could be passed as parameter
        generated_content: creative as any,
        model_used: 'anthropic/claude-3-7-sonnet', // or 'deepseek/deepseek-chat'
        implemented: false
      } as any);
    
    // Revalidate paths
    revalidatePath('/dashboard');
    revalidatePath('/content-generator');
    
    return creative;
  } catch (error) {
    console.error('Error generating and saving ad creative:', error);
    throw new Error('Failed to generate ad creative');
  }
}

/**
 * Get AI generation history for a user
 * @param userId User ID
 * @param limit Maximum number of records to return
 * @returns Array of AI generations
 */
export async function getAiGenerationHistory(
  userId: string,
  limit: number = 10
): Promise<AiGeneration[]> {
  try {
    const { data, error } = await supabase
      .from('ai_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching AI generation history:', error);
      return [];
    }
    
    return data as AiGeneration[];
  } catch (error) {
    console.error('Error fetching AI generation history:', error);
    return [];
  }
}

/**
 * Update AI generation feedback and implementation status
 * @param generationId AI generation ID
 * @param feedback User feedback
 * @param implemented Whether the generation was implemented
 * @returns Success status
 */
export async function updateAiGenerationFeedback(
  generationId: string,
  feedback: string,
  implemented: boolean
): Promise<boolean> {
  try {
    const { error } = await (supabase as any)
      .from('ai_generations')
      .update({
        feedback,
        implemented,
        updated_at: new Date().toISOString()
      } as any)
      .eq('id', generationId);
    
    if (error) {
      console.error('Error updating AI generation feedback:', error);
      return false;
    }
    
    // Revalidate paths
    revalidatePath('/dashboard');
    revalidatePath('/content-generator');
    
    return true;
  } catch (error) {
    console.error('Error updating AI generation feedback:', error);
    return false;
  }
}
