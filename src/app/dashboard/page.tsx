import Link from 'next/link';
import { EnvStatus } from '@/components/shared/env-status';
import { DashboardClient } from '@/components/shared/dashboard-client';
import { CreditBadge } from '@/components/shared/CreditBadge';
import { ModeToggle } from '@/components/shared/ModeToggle';
import { getAdInsights, getUserAdAccounts } from '@/app/actions/meta';
import { AdMetric } from '@/db/types';

// Mock user ID for demonstration
const MOCK_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

export default async function Dashboard() {
  // Get user's ad accounts
  const adAccounts = await getUserAdAccounts(MOCK_USER_ID);
  
  // Get ad insights for the first account (if any)
  let adMetrics: AdMetric[] = [];
  if (adAccounts.length > 0) {
    adMetrics = await getAdInsights(MOCK_USER_ID, adAccounts[0].id, 'last_7d');
  }
  return (
    <div className="min-h-screen p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <ModeToggle />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Ad Performance</h2>
          <p className="text-gray-600 mb-4">Monitor your Meta Ads performance metrics</p>
          <Link 
            href="/meta-ads" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View Details →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Content Generator</h2>
          <p className="text-gray-600 mb-4">Create AI-powered content for your ads</p>
          <Link 
            href="/content-generator" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Generate Content →
          </Link>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600 mb-4">View your recent activities and generated content</p>
          <span className="text-gray-400">No recent activity</span>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Environment Configuration</h2>
          <EnvStatus />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">AI Credits</h2>
          <p className="text-gray-600 mb-4">Monitor your available AI generation credits</p>
          <CreditBadge currentCredits={8} totalCredits={10} />
          <div className="mt-4 text-sm text-gray-500">
            <p>• Each generation uses 1 credit</p>
            <p>• Credits reset monthly</p>
            <Link
              href="/pricing"
              className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center gap-1 mt-2"
            >
              Upgrade for unlimited credits →
            </Link>
          </div>
        </div>
        
        {/* Ad Metrics Display */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 mt-6">
          <DashboardClient
            initialMetrics={adMetrics}
            userId={MOCK_USER_ID}
            adAccountId={adAccounts.length > 0 ? adAccounts[0].id : undefined}
          />
        </div>
      </div>
    </div>
  );
}
