'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreativeModal } from './creative-modal';
import { generateAndSaveAdCreative } from '@/app/actions/ai';
import { AdMetric } from '@/db/types';
import { AdCreativeResponse } from '@/lib/ai-service';
import { useRouter } from 'next/navigation';

interface GenerateCreativeButtonProps {
  userId: string;
  adMetric: AdMetric;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
}

export function GenerateCreativeButton({ 
  userId, 
  adMetric, 
  variant = 'default',
  size = 'default'
}: GenerateCreativeButtonProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [creative, setCreative] = useState<AdCreativeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCreative = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setIsModalOpen(true);
      
      const result = await generateAndSaveAdCreative(userId, adMetric);
      
      // Check if there's an error
      if ('error' in result) {
        setError(result.error);
        
        // If it's a credits error, show a confirmation to redirect to pricing
        if (result.error.includes('credits')) {
          const shouldRedirect = window.confirm(
            'You have run out of AI credits. Would you like to upgrade your plan?'
          );
          
          if (shouldRedirect) {
            router.push('/pricing');
            setIsModalOpen(false);
            return;
          }
        }
      } else {
        // No error, set the creative
        setCreative(result);
      }
    } catch (error) {
      console.error('Error generating creative:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleGenerateCreative}
        variant={variant}
        size={size}
        disabled={isLoading}
        className="flex cursor-pointer items-center gap-1"
      >
        <Sparkles className={`h-4 w-4 ${isLoading ? 'animate-pulse' : ''}`} />
        <span>{isLoading ? 'Processing...' : 'Generate Creative'}</span>
      </Button>

      <CreativeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        creative={creative}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}
