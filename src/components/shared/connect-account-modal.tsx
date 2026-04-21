'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/db/client';
import { useRouter } from 'next/navigation';

interface ConnectAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export function ConnectAccountModal({ isOpen, onClose, userId }: ConnectAccountModalProps) {
  const router = useRouter();
  const [step, setStep] = useState<'meta' | 'openrouter'>('meta');
  const [metaToken, setMetaToken] = useState('');
  const [openrouterKey, setOpenrouterKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSaveMetaToken = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!metaToken.trim()) {
        setError('Please enter a valid Meta Access Token');
        return;
      }

      // Update the user's profile with the Meta access token
      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update({
          meta_access_token: metaToken,
          meta_access_token_expires_at: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days from now
        } as any)
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }

      // Move to the next step
      setStep('openrouter');
    } catch (err) {
      console.error('Error saving Meta token:', err);
      setError('Failed to save Meta token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveOpenrouterKey = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!openrouterKey.trim()) {
        setError('Please enter a valid OpenRouter API Key');
        return;
      }

      // Update the user's profile with the OpenRouter API key
      const { error: updateError } = await (supabase as any)
        .from('profiles')
        .update({
          openrouter_api_key: openrouterKey,
        } as any)
        .eq('user_id', userId);

      if (updateError) {
        throw updateError;
      }

      // Close the modal and refresh the page
      onClose();
      router.refresh();
    } catch (err) {
      console.error('Error saving OpenRouter key:', err);
      setError('Failed to save OpenRouter API key. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    if (step === 'meta') {
      setStep('openrouter');
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Connect Your Accounts</DialogTitle>
          <DialogDescription>
            Set up your accounts to get the most out of EZ Meta.
          </DialogDescription>
        </DialogHeader>

        {step === 'meta' ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="meta-token">Meta Access Token</Label>
              <Input
                id="meta-token"
                value={metaToken}
                onChange={(e) => setMetaToken(e.target.value)}
                placeholder="Enter your Meta Access Token"
              />
              <p className="text-sm text-muted-foreground">
                This token allows EZ Meta to access your Facebook Ad accounts and metrics.
              </p>
              <a 
                href="https://developers.facebook.com/docs/facebook-login/guides/access-tokens/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                How to get a Meta Access Token
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleSkip}>
                Skip for now
              </Button>
              <Button onClick={handleSaveMetaToken} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="openrouter-key">OpenRouter API Key</Label>
              <Input
                id="openrouter-key"
                value={openrouterKey}
                onChange={(e) => setOpenrouterKey(e.target.value)}
                placeholder="Enter your OpenRouter API Key"
              />
              <p className="text-sm text-muted-foreground">
                This key allows EZ Meta to generate AI content for your ads.
              </p>
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                Get an OpenRouter API Key
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 text-sm text-red-800">
                {error}
              </div>
            )}

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={handleSkip}>
                Skip for now
              </Button>
              <Button onClick={handleSaveOpenrouterKey} disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Complete Setup'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
