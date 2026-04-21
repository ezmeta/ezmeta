'use client';

import { useState, useEffect } from 'react';
import { AdMetric } from '@/db/types';
import { AdMetricsDisplay } from './ad-metrics-display';
import { RefreshMetricsButton } from './refresh-metrics-button';
import { ConnectAccountModal } from './connect-account-modal';
import { AICreditCounter } from './ai-credit-counter';
import { MetaTokenAlert } from './meta-token-alert';
import { supabase } from '@/db/client';

interface DashboardClientProps {
  initialMetrics: AdMetric[];
  userId: string;
  adAccountId?: string;
}

export function DashboardClient({ initialMetrics, userId, adAccountId }: DashboardClientProps) {
  const [metrics, setMetrics] = useState<AdMetric[]>(initialMetrics);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if the user needs to connect their accounts
  useEffect(() => {
    async function checkUserProfile() {
      try {
        setIsLoading(true);
        
        // Get the user's profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('meta_access_token, openrouter_api_key')
          .eq('user_id', userId)
          .single();
        
        setUserProfile(profile);
        
        // Show the connect modal if the user doesn't have both tokens
        if (profile) {
          // Use type assertion to handle TypeScript errors
          const typedProfile = profile as {
            meta_access_token: string | null;
            openrouter_api_key: string | null;
          };
          
          if (!typedProfile.meta_access_token || !typedProfile.openrouter_api_key) {
            setShowConnectModal(true);
          }
        }
      } catch (error) {
        console.error('Error checking user profile:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkUserProfile();
  }, [userId]);

  const handleRefresh = (newMetrics: AdMetric[]) => {
    setMetrics(newMetrics);
    setIsRefreshing(false);
  };

  return (
    <div className="space-y-6">
      {/* Meta Token Expiry Alert */}
      <MetaTokenAlert userId={userId} />
      
      <div className="flex justify-between items-center">
        {/* AI Credit Counter */}
        <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-200">
          <AICreditCounter userId={userId} />
        </div>
        
        {adAccountId && (
          <RefreshMetricsButton
            userId={userId}
            adAccountId={adAccountId}
            onRefresh={handleRefresh}
          />
        )}
      </div>
      
      <AdMetricsDisplay metrics={metrics} isLoading={isRefreshing || isLoading} />
      
      {/* Connect Account Modal */}
      <ConnectAccountModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        userId={userId}
      />
    </div>
  );
}