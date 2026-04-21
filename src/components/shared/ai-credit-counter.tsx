'use client';

import { useState, useEffect } from 'react';
import { Coins } from 'lucide-react';
import { supabase } from '@/db/client';

interface AICreditCounterProps {
  userId: string;
}

export function AICreditCounter({ userId }: AICreditCounterProps) {
  const [credits, setCredits] = useState<number | null>(null);
  const [maxCredits, setMaxCredits] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCredits() {
      try {
        setIsLoading(true);
        
        // Get the user's profile with credit information
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('ai_credits, subscription_tier')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (profile) {
          // Use type assertion to handle the TypeScript error
          const typedProfile = profile as {
            ai_credits: number;
            subscription_tier: string;
          };
          
          setCredits(typedProfile.ai_credits);
          
          // Set max credits based on subscription tier
          if (typedProfile.subscription_tier === 'pro') {
            setMaxCredits(9999); // Unlimited for display purposes
          } else {
            setMaxCredits(10); // Free tier default
          }
        }
      } catch (err) {
        console.error('Error fetching AI credits:', err);
        setError('Failed to load credit information');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchCredits();
    
    // Set up real-time subscription to update credits when they change
    const subscription = supabase
      .channel('profile-credits')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        if (payload.new && 'ai_credits' in payload.new) {
          setCredits(payload.new.ai_credits as number);
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, [userId]);

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2 text-sm font-medium text-slate-400 animate-pulse">
        <Coins className="h-4 w-4" />
        <span>Loading credits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center space-x-2 text-sm font-medium text-red-500">
        <Coins className="h-4 w-4" />
        <span>Error loading credits</span>
      </div>
    );
  }

  // For Pro users with "unlimited" credits
  if (maxCredits === 9999) {
    return (
      <div className="flex items-center space-x-2 text-sm font-medium">
        <div className="bg-purple-600/20 p-1 rounded-full">
          <Coins className="h-4 w-4 text-purple-500" />
        </div>
        <span className="text-purple-500">Unlimited Credits (Pro)</span>
      </div>
    );
  }

  // Calculate percentage for progress indicator
  const percentage = credits !== null ? Math.min(100, (credits / maxCredits) * 100) : 0;
  const colorClass = percentage < 30 ? 'text-red-500' : percentage < 70 ? 'text-yellow-500' : 'text-green-500';

  return (
    <div className="flex flex-col">
      <div className="flex items-center space-x-2 text-sm font-medium">
        <div className="bg-blue-600/20 p-1 rounded-full">
          <Coins className="h-4 w-4 text-blue-500" />
        </div>
        <span className={colorClass}>
          Credits: {credits}/{maxCredits}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="mt-1 h-1 w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className={`h-full ${percentage < 30 ? 'bg-red-500' : percentage < 70 ? 'bg-yellow-500' : 'bg-green-500'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}