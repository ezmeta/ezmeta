'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

/**
 * Environment Status Component
 * 
 * This component demonstrates how to safely check environment configuration
 * from a client component by calling a server API endpoint.
 */
export function EnvStatus() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Checking environment configuration...');
  const [isChecking, setIsChecking] = useState<boolean>(true);

  const checkEnvConfig = async () => {
    setIsChecking(true);
    setStatus('loading');
    setMessage('Checking environment configuration...');
    
    try {
      const response = await fetch('/api/config');
      const data = await response.json();
      
      if (data.status === 'success') {
        setStatus('success');
        setMessage('Environment variables are properly configured');
      } else {
        setStatus('error');
        setMessage(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus('error');
      setMessage(`Failed to check configuration: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkEnvConfig();
  }, []);

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-2">Environment Configuration Status</h3>
      
      <div className={`p-3 rounded-md mb-4 ${
        status === 'success' ? 'bg-green-100 text-green-800' : 
        status === 'error' ? 'bg-red-100 text-red-800' : 
        'bg-blue-100 text-blue-800'
      }`}>
        <p>{message}</p>
      </div>
      
      <Button 
        onClick={checkEnvConfig} 
        disabled={isChecking}
        variant={status === 'error' ? 'destructive' : 'default'}
      >
        {isChecking ? 'Checking...' : 'Check Again'}
      </Button>
    </div>
  );
}