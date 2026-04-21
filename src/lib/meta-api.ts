import axios from 'axios';
import { metaConfig } from '@/config/env';

// Meta Graph API base URL
const META_API_BASE_URL = 'https://graph.facebook.com/v19.0';

// Types for Meta API responses
interface MetaAdAccount {
  id: string;
  name: string;
  account_id: string;
  account_status: number;
  currency: string;
  timezone_name: string;
}

interface MetaAdAccountsResponse {
  data: MetaAdAccount[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

interface MetaInsight {
  campaign_name: string;
  campaign_id: string;
  adset_name?: string;
  adset_id?: string;
  ad_name?: string;
  ad_id?: string;
  spend: string;
  impressions: string;
  inline_link_clicks?: string;
  inline_link_click_ctr: string;
  cost_per_inline_link_click: string;
  date_start: string;
  date_stop: string;
}

interface MetaInsightsResponse {
  data: MetaInsight[];
  paging?: {
    cursors: {
      before: string;
      after: string;
    };
    next?: string;
  };
}

// Mock data for development without Meta API credentials
const MOCK_AD_ACCOUNTS: MetaAdAccountsResponse = {
  data: [
    {
      id: 'act_123456789',
      name: 'Main Marketing Account',
      account_id: '123456789',
      account_status: 1,
      currency: 'USD',
      timezone_name: 'America/Los_Angeles'
    },
    {
      id: 'act_987654321',
      name: 'Secondary Ad Account',
      account_id: '987654321',
      account_status: 1,
      currency: 'USD',
      timezone_name: 'America/New_York'
    }
  ]
};

const MOCK_INSIGHTS: MetaInsightsResponse = {
  data: [
    {
      campaign_name: 'Summer Sale 2026',
      campaign_id: '23851234567890',
      spend: '1250.45',
      impressions: '145678',
      inline_link_click_ctr: '3.25',
      cost_per_inline_link_click: '0.42',
      date_start: '2026-04-13',
      date_stop: '2026-04-19'
    },
    {
      campaign_name: 'Product Launch',
      campaign_id: '23851234567891',
      spend: '2340.12',
      impressions: '198765',
      inline_link_click_ctr: '4.12',
      cost_per_inline_link_click: '0.38',
      date_start: '2026-04-13',
      date_stop: '2026-04-19'
    },
    {
      campaign_name: 'Brand Awareness',
      campaign_id: '23851234567892',
      spend: '875.30',
      impressions: '87654',
      inline_link_click_ctr: '2.87',
      cost_per_inline_link_click: '0.45',
      date_start: '2026-04-13',
      date_stop: '2026-04-19'
    }
  ]
};

/**
 * Check if we should use mock data
 * We use mock data if META_APP_ID or META_APP_SECRET is not set
 */
function shouldUseMockData(): boolean {
  return !metaConfig.appId || !metaConfig.appSecret;
}

/**
 * Create an axios instance for Meta Graph API
 * @param accessToken User's Meta access token
 */
function createMetaApiClient(accessToken: string) {
  return axios.create({
    baseURL: META_API_BASE_URL,
    params: {
      access_token: accessToken,
    },
  });
}

/**
 * Fetch all Ad Accounts linked to a user's access token
 * @param accessToken User's Meta access token
 * @returns List of Ad Accounts
 */
export async function fetchAdAccounts(accessToken: string): Promise<MetaAdAccountsResponse> {
  // Use mock data if Meta API credentials are not set
  if (shouldUseMockData()) {
    console.log('Using mock data for Ad Accounts');
    return MOCK_AD_ACCOUNTS;
  }

  try {
    const client = createMetaApiClient(accessToken);
    const response = await client.get('/me/adaccounts', {
      params: {
        fields: 'id,name,account_id,account_status,currency,timezone_name',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Ad Accounts:', error);
    throw new Error('Failed to fetch Ad Accounts from Meta API');
  }
}

/**
 * Fetch Insights for a specific Ad Account ID
 * @param accessToken User's Meta access token
 * @param adAccountId Ad Account ID
 * @param datePreset Date preset (default: last_7d)
 * @param level Data level (default: campaign)
 * @returns Ad Insights data
 */
export async function fetchAdInsights(
  accessToken: string,
  adAccountId: string,
  datePreset: string = 'last_7d',
  level: 'account' | 'campaign' | 'adset' | 'ad' = 'campaign'
): Promise<MetaInsightsResponse> {
  // Use mock data if Meta API credentials are not set
  if (shouldUseMockData()) {
    console.log('Using mock data for Ad Insights');
    return MOCK_INSIGHTS;
  }

  try {
    const client = createMetaApiClient(accessToken);
    const response = await client.get(`/act_${adAccountId}/insights`, {
      params: {
        fields: 'campaign_name,campaign_id,adset_name,adset_id,ad_name,ad_id,spend,impressions,inline_link_click_ctr,cost_per_inline_link_click',
        date_preset: datePreset,
        level: level,
        time_increment: 1, // Daily breakdown
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching Ad Insights:', error);
    throw new Error('Failed to fetch Ad Insights from Meta API');
  }
}

/**
 * Format Meta API data for our database
 * @param insights Meta API insights data
 * @param adAccountId Our database Ad Account ID
 * @returns Formatted data for our ad_metrics table
 */
export function formatInsightsForDatabase(insights: MetaInsight[], adAccountId: string) {
  return insights.map(insight => ({
    ad_account_id: adAccountId,
    campaign_id: insight.campaign_id,
    campaign_name: insight.campaign_name,
    adset_id: insight.adset_id || null,
    adset_name: insight.adset_name || null,
    ad_id: insight.ad_id || null,
    ad_name: insight.ad_name || null,
    date: insight.date_start, // Using date_start for daily data
    spend: parseFloat(insight.spend),
    impressions: parseInt(insight.impressions, 10),
    clicks: calculateClicks(insight),
    conversions: 0, // Not available in this data
    conversion_value: 0, // Not available in this data
  }));
}

/**
 * Calculate clicks from CTR and impressions
 * @param insight Meta API insight data
 * @returns Number of clicks
 */
function calculateClicks(insight: MetaInsight): number {
  if (insight.inline_link_clicks) {
    return parseInt(insight.inline_link_clicks, 10);
  }
  
  // If inline_link_clicks is not available, calculate from CTR and impressions
  const ctr = parseFloat(insight.inline_link_click_ctr) / 100; // Convert percentage to decimal
  const impressions = parseInt(insight.impressions, 10);
  return Math.round(impressions * ctr);
}