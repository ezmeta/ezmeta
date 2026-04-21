'use client';

import { useState, useEffect } from 'react';
import { AlertCircle } from 'lucide-react';
import { supabase } from '@/db/client';
import { Button } from '@/components/ui/button';

interface MetaTokenAlertProps {
  userId: string;
}

export function MetaTokenAlert({ userId }: MetaTokenAlertProps) {
  const [showAlert, setShowAlert] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function checkTokenExpiry() {
      try {
        setIsLoading(true);
        
        // Get the user's profile with token expiry information
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('meta_access_token_expires_at, meta_access_token')
          .eq('user_id', userId)
          .single();
        
        if (error) {
          throw error;
        }
        
        // Check if token exists and is approaching expiry (50 days old)
        if (profile) {
          const typedProfile = profile as {
            meta_access_token_expires_at: string | null;
            meta_access_token: string | null;
          };
          
          // If there's no token, don't show the alert
          if (!typedProfile.meta_access_token) {
            setShowAlert(false);
            return;
          }
          
          // If there's a token but no expiry date, assume it might be old
          if (!typedProfile.meta_access_token_expires_at) {
            setShowAlert(true);
            return;
          }
          
          // Calculate days until expiry
          const expiryDate = new Date(typedProfile.meta_access_token_expires_at);
          const now = new Date();
          const tokenAgeInDays = Math.floor((now.getTime() - expiryDate.getTime()) / (1000 * 60 * 60 * 24));
          
          // Show alert if token is older than 50 days
          setShowAlert(tokenAgeInDays >= 50);
        }
      } catch (err) {
        console.error('Error checking token expiry:', err);
      } finally {
        setIsLoading(false);
      }
    }
    
    if (!dismissed) {
      checkTokenExpiry();
    }
  }, [userId, dismissed]);

  if (isLoading || !showAlert || dismissed) {
    return null;
  }

  return (
    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6 rounded-md">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-amber-500" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-amber-800">Meta Token Expiry Warning</h3>
          <div className="mt-2 text-sm text-amber-700">
            <p>
              Your Meta access token is approaching expiration. To ensure uninterrupted access to your Meta Ad accounts, 
              please reconnect your Meta account.
            </p>
          </div>
          <div className="mt-4 flex space-x-3">
            <Button 
              size="sm"
              onClick={() => window.location.href = '/dashboard?reconnect=meta'}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Reconnect Now
            </Button>
            <Button 
              size="sm"
              variant="outline"
              onClick={() => setDismissed(true)}
              className="text-amber-700 border-amber-300 hover:bg-amber-50"
            >
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}