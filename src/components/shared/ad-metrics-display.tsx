'use client';

import { useState } from 'react';
import { AdMetric } from '@/db/types';
import { formatCurrency } from '@/lib/utils';
import { GenerateCreativeButton } from './generate-creative-button';

interface AdMetricsDisplayProps {
  metrics: AdMetric[];
  isLoading?: boolean;
  userId?: string;
}

export function AdMetricsDisplay({ metrics, isLoading = false, userId = '123e4567-e89b-12d3-a456-426614174000' }: AdMetricsDisplayProps) {
  const [dateRange, setDateRange] = useState<'last_7d' | 'last_30d' | 'last_90d'>('last_7d');
  
  // Calculate totals
  const totals = metrics.reduce(
    (acc, metric) => {
      acc.spend += metric.spend;
      acc.impressions += metric.impressions;
      acc.clicks += metric.clicks;
      return acc;
    },
    { spend: 0, impressions: 0, clicks: 0 }
  );
  
  // Calculate averages
  const avgCTR = totals.impressions > 0 
    ? (totals.clicks / totals.impressions) * 100 
    : 0;
  
  const avgCPC = totals.clicks > 0 
    ? totals.spend / totals.clicks 
    : 0;
  
  if (isLoading) {
    return (
      <div className="p-6 border rounded-lg shadow-md bg-white">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded mt-6"></div>
        </div>
      </div>
    );
  }
  
  if (metrics.length === 0) {
    return (
      <div className="p-6 border rounded-lg shadow-md bg-white">
        <h3 className="text-lg font-medium mb-4">Ad Performance</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No ad metrics data available.</p>
          <p className="text-gray-500 mt-2">Connect your Meta Ads account to see performance data.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium">Ad Performance</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setDateRange('last_7d')}
            className={`px-3 py-1 text-sm rounded-md ${
              dateRange === 'last_7d'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setDateRange('last_30d')}
            className={`px-3 py-1 text-sm rounded-md ${
              dateRange === 'last_30d'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setDateRange('last_90d')}
            className={`px-3 py-1 text-sm rounded-md ${
              dateRange === 'last_90d'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Last 90 Days
          </button>
        </div>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="p-4 border rounded-lg bg-blue-50 border-blue-100">
          <h4 className="text-sm font-medium text-blue-700 mb-1">Total Spend</h4>
          <p className="text-2xl font-bold text-blue-900">{formatCurrency(totals.spend)}</p>
          <p className="text-sm text-blue-600 mt-1">
            Avg. {formatCurrency(totals.spend / metrics.length)} per day
          </p>
        </div>
        
        <div className="p-4 border rounded-lg bg-green-50 border-green-100">
          <h4 className="text-sm font-medium text-green-700 mb-1">Click-Through Rate</h4>
          <p className="text-2xl font-bold text-green-900">{avgCTR.toFixed(2)}%</p>
          <p className="text-sm text-green-600 mt-1">
            {totals.clicks.toLocaleString()} clicks / {totals.impressions.toLocaleString()} impressions
          </p>
        </div>
        
        <div className="p-4 border rounded-lg bg-purple-50 border-purple-100">
          <h4 className="text-sm font-medium text-purple-700 mb-1">Cost Per Click</h4>
          <p className="text-2xl font-bold text-purple-900">{formatCurrency(avgCPC)}</p>
          <p className="text-sm text-purple-600 mt-1">
            {formatCurrency(totals.spend)} / {totals.clicks.toLocaleString()} clicks
          </p>
        </div>
      </div>
      
      {/* Metrics Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Spend
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Impressions
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                CTR
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                CPC
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {metrics.map((metric) => {
              const ctr = metric.impressions > 0 
                ? (metric.clicks / metric.impressions) * 100 
                : 0;
              
              const cpc = metric.clicks > 0 
                ? metric.spend / metric.clicks 
                : 0;
              
              return (
                <tr key={`${metric.campaign_id}-${metric.date}`}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{metric.campaign_name}</div>
                    <div className="text-xs text-gray-500">{metric.campaign_id}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                    {new Date(metric.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(metric.spend)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {metric.impressions.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {metric.clicks.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {ctr.toFixed(2)}%
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(cpc)}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                    <GenerateCreativeButton
                      userId={userId}
                      adMetric={metric}
                      variant="outline"
                      size="sm"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}