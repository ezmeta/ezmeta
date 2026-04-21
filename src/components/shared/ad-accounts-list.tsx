'use client';

import { useState, useEffect } from 'react';
import { getUserAdAccounts } from '@/db/client';
import type { AdAccount } from '@/db/types';

interface AdAccountsListProps {
  userId: string;
}

/**
 * Component to display a user's ad accounts
 * This is an example of how to use the database client in a React component
 */
export function AdAccountsList({ userId }: AdAccountsListProps) {
  const [adAccounts, setAdAccounts] = useState<AdAccount[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAdAccounts() {
      try {
        setLoading(true);
        const accounts = await getUserAdAccounts(userId);
        setAdAccounts(accounts);
        setError(null);
      } catch (err) {
        setError('Failed to load ad accounts');
        console.error('Error loading ad accounts:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdAccounts();
  }, [userId]);

  if (loading) {
    return <div className="p-4">Loading ad accounts...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (adAccounts.length === 0) {
    return (
      <div className="p-4 border rounded-md">
        <p>No ad accounts found. Connect a Meta Ad account to get started.</p>
        <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Connect Ad Account
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">Your Ad Accounts</h3>
      
      <div className="space-y-4">
        {adAccounts.map((account) => (
          <div key={account.id} className="p-3 border rounded-md hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium">{account.account_name}</h4>
                <p className="text-sm text-gray-500">ID: {account.meta_ad_account_id}</p>
              </div>
              <div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  account.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {account.status}
                </span>
              </div>
            </div>
            <div className="mt-2 flex justify-end space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200">
                View Metrics
              </button>
              <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200">
                Generate Content
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}