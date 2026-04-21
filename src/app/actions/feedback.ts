'use server';

import { submitUserFeedback, updateAiGenerationHelpfulness } from '@/db/client';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { supabaseConfig } from '@/config/env';

/**
 * Submit user feedback
 */
export async function submitFeedback(
  rating: number,
  category: 'Bug' | 'Feature Request' | 'General',
  comment?: string
) {
  try {
    // Get the user session
    const cookieStore = await cookies();
    const supabase = createServerClient(
      supabaseConfig.url,
      supabaseConfig.anonKey,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return { success: false, error: 'Not authenticated' };
    }

    const userId = session.user.id;
    
    // Submit the feedback
    const feedback = await submitUserFeedback(userId, rating, category, comment);
    
    if (!feedback) {
      return { success: false, error: 'Failed to submit feedback' };
    }
    
    return { success: true, feedback };
  } catch (error) {
    console.error('Error submitting feedback:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}

/**
 * Submit AI generation helpfulness feedback
 */
export async function submitAiHelpfulnessFeedback(
  generationId: string,
  wasHelpful: boolean
) {
  try {
    // Update the AI generation with helpfulness feedback
    const success = await updateAiGenerationHelpfulness(generationId, wasHelpful);
    
    if (!success) {
      return { success: false, error: 'Failed to submit feedback' };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error submitting AI helpfulness feedback:', error);
    return { success: false, error: 'An unexpected error occurred' };
  }
}