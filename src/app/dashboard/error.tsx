'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-lg shadow-lg border border-slate-700">
        <div className="flex items-center justify-center mb-6">
          <div className="bg-red-500/20 p-3 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-2">Something went wrong</h2>
        
        <p className="text-slate-300 text-center mb-6">
          {error.message || 'We encountered an issue while loading your dashboard data. This could be due to an API timeout or database connection error.'}
        </p>
        
        <div className="flex flex-col space-y-3">
          <Button 
            onClick={reset}
            className="w-full flex items-center justify-center"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/dashboard'}
            className="w-full"
          >
            Reload Dashboard
          </Button>
        </div>
        
        <p className="text-xs text-slate-400 mt-6 text-center">
          If this problem persists, please contact support with error reference: {error.digest}
        </p>
      </div>
    </div>
  );
}