'use client';

import { useState } from 'react';
import { RefreshCcw } from 'lucide-react';
import { getAdInsights } from '@/app/actions/meta';
import { Button } from '@/components/ui/button';

interface RefreshMetricsButtonProps {
  userId: string;
  adAccountId: string;
  onRefresh: (newMetrics: any[]) => void;
}

export function RefreshMetricsButton({ userId, adAccountId, onRefresh }: RefreshMetricsButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const metrics = await getAdInsights(userId, adAccountId, 'last_7d');
      onRefresh(metrics);
    } catch (error) {
      console.error('Error refreshing metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleRefresh}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="flex cursor-pointer items-center gap-1"
    >
      <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      <span>{isLoading ? 'Processing...' : 'Refresh Data'}</span>
    </Button>
  );
}
