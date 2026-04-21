'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { GenerateCreativeButton } from '@/components/shared/generate-creative-button';
import { AdMetric } from '@/db/types';
import { getAdInsights } from '@/app/actions/meta';

export default function MetaAds() {
  // Mock user ID for demonstration
  const MOCK_USER_ID = '123e4567-e89b-12d3-a456-426614174000';
  const [isSyncing, setIsSyncing] = useState(false);
  // Mock data for demonstration
  const adPerformanceData = [
    {
      id: 1,
      name: 'Summer Sale Campaign',
      status: 'Active',
      impressions: 12500,
      clicks: 450,
      ctr: '3.6%',
      cpc: '$0.42',
      spend: '$189.00',
    },
    {
      id: 2,
      name: 'Product Launch',
      status: 'Active',
      impressions: 8700,
      clicks: 320,
      ctr: '3.7%',
      cpc: '$0.53',
      spend: '$169.60',
    },
    {
      id: 3,
      name: 'Brand Awareness',
      status: 'Paused',
      impressions: 5200,
      clicks: 130,
      ctr: '2.5%',
      cpc: '$0.38',
      spend: '$49.40',
    },
    {
      id: 4,
      name: 'Insurans Kereta Promo',
      status: 'Active',
      impressions: 7500,
      clicks: 60,
      ctr: '0.8%',
      cpc: '$0.75',
      spend: '$45.00',
      needsOptimization: true,
    },
  ];

  const handleSyncData = async () => {
    try {
      setIsSyncing(true);
      await getAdInsights(MOCK_USER_ID, 'mock-ad-account-id', 'last_7d');
    } catch (error) {
      console.error('Error syncing data:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Meta Ads Performance</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Ad Campaigns</h2>
          <div className="flex gap-2">
            <button className="cursor-pointer px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 active:scale-[0.98]">
              Last 7 days
            </button>
            <button className="cursor-pointer px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 active:scale-[0.98]">
              Last 30 days
            </button>
            <button className="cursor-pointer px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 active:scale-[0.98]">
              Custom
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Impressions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clicks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CTR
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Spend
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {adPerformanceData.map((campaign) => (
                <tr key={campaign.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {campaign.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      campaign.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.impressions.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.clicks.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.ctr}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.cpc}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.spend}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {campaign.needsOptimization ? (
                      <GenerateCreativeButton
                        userId={MOCK_USER_ID}
                        adMetric={{
                          id: campaign.id.toString(),
                          campaign_name: campaign.name,
                          ad_id: `ad_${campaign.id}`,
                          impressions: campaign.impressions,
                          clicks: campaign.clicks,
                          ctr: parseFloat(campaign.ctr.replace('%', '')),
                          cpc: parseFloat(campaign.cpc.replace('$', '')),
                          spend: parseFloat(campaign.spend.replace('$', '')),
                          date: new Date().toISOString(),
                        } as AdMetric}
                        size="sm"
                      />
                    ) : (
                      <button className="cursor-pointer px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 active:scale-[0.98] text-xs">
                        View Details
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Performance Insights</h2>
        <p className="text-gray-600 mb-2">
          • Your "Summer Sale Campaign" has the highest number of impressions
        </p>
        <p className="text-gray-600 mb-2">
          • "Product Launch" has the best CTR at 3.7%
        </p>
        <p className="text-red-600 mb-2 font-medium">
          • "Insurans Kereta Promo" has a critically low CTR (0.8%) - needs immediate attention
        </p>
        <p className="text-gray-600 mb-2">
          • Consider optimizing "Brand Awareness" campaign to improve CTR
        </p>
        
        <div className="mt-4 flex gap-3">
          <button className="cursor-pointer px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 active:scale-[0.98] transition-colors">
            Generate Optimization Suggestions
          </button>
          <button
            onClick={handleSyncData}
            disabled={isSyncing}
            className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 active:scale-[0.98] transition-colors disabled:opacity-60"
          >
            {isSyncing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Sync Data'
            )}
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <Link 
          href="/dashboard" 
          className="cursor-pointer text-blue-600 hover:text-blue-800 active:opacity-80 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
