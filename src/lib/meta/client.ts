import axios from 'axios';
import { metaConfig } from '@/config/env';

// Meta Graph API base URL
const META_API_BASE_URL = 'https://graph.facebook.com/v19.0';

/**
 * Meta Graph API client for fetching ad performance data
 */
export class MetaApiClient {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: META_API_BASE_URL,
      params: {
        access_token: metaConfig.accessToken,
      },
    });
  }

  /**
   * Get user's ad accounts
   */
  async getAdAccounts() {
    try {
      const response = await this.axiosInstance.get('/me/adaccounts', {
        params: {
          fields: 'id,name,account_status',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ad accounts:', error);
      throw error;
    }
  }

  /**
   * Get ad performance insights for a specific ad account
   * @param adAccountId - The ID of the ad account
   * @param timeRange - Time range for the insights data
   */
  async getAdInsights(adAccountId: string, timeRange: { since: string; until: string }) {
    try {
      const response = await this.axiosInstance.get(`/act_${adAccountId}/insights`, {
        params: {
          fields: 'campaign_name,impressions,clicks,ctr,cpc,spend',
          time_range: JSON.stringify(timeRange),
          level: 'campaign',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ad insights:', error);
      throw error;
    }
  }

  /**
   * Get campaigns for a specific ad account
   * @param adAccountId - The ID of the ad account
   */
  async getCampaigns(adAccountId: string) {
    try {
      const response = await this.axiosInstance.get(`/act_${adAccountId}/campaigns`, {
        params: {
          fields: 'id,name,status,objective',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      throw error;
    }
  }

  /**
   * Get ad sets for a specific campaign
   * @param campaignId - The ID of the campaign
   */
  async getAdSets(campaignId: string) {
    try {
      const response = await this.axiosInstance.get(`/${campaignId}/adsets`, {
        params: {
          fields: 'id,name,status,targeting',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ad sets:', error);
      throw error;
    }
  }

  /**
   * Get ads for a specific ad set
   * @param adSetId - The ID of the ad set
   */
  async getAds(adSetId: string) {
    try {
      const response = await this.axiosInstance.get(`/${adSetId}/ads`, {
        params: {
          fields: 'id,name,status,creative',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching ads:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const metaApiClient = new MetaApiClient();