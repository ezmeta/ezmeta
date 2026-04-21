import axios from 'axios';
import { openRouterConfig } from '@/config/env';

// OpenRouter API base URL
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';

/**
 * OpenRouter API client for generating AI content
 */
export class OpenRouterClient {
  private axiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: OPENROUTER_API_URL,
      headers: {
        'Authorization': `Bearer ${openRouterConfig.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://ez-meta.com', // Replace with your actual domain
        'X-Title': 'EZ Meta'
      }
    });
  }

  /**
   * Generate ad copy based on performance data and parameters
   * @param adObjective - The objective of the ad
   * @param targetAudience - Description of the target audience
   * @param productDescription - Description of the product or service
   * @param performanceData - Optional performance data to inform the generation
   */
  async generateAdCopy(
    adObjective: string,
    targetAudience: string,
    productDescription: string,
    performanceData?: any
  ) {
    try {
      // Construct a prompt based on the inputs
      let prompt = `Create compelling ad copy for a ${adObjective} campaign.
Target audience: ${targetAudience}
Product/Service: ${productDescription}`;

      // Add performance data if available
      if (performanceData) {
        prompt += `\nPerformance data from previous ads:
- CTR: ${performanceData.ctr}
- CPC: ${performanceData.cpc}
- Impressions: ${performanceData.impressions}
- Best performing ad headline: "${performanceData.bestHeadline}"`;
      }

      prompt += `\n\nGenerate 3 ad copy variations with headlines and body text that would improve engagement and conversion rates.`;

      const response = await this.axiosInstance.post('/chat/completions', {
        model: 'openai/gpt-4-turbo',  // Can be configured based on needs
        messages: [
          {
            role: 'system',
            content: 'You are an expert marketing copywriter specializing in creating high-converting ad copy for Meta Ads (Facebook and Instagram).'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      });

      return response.data;
    } catch (error) {
      console.error('Error generating ad copy:', error);
      throw error;
    }
  }

  /**
   * Generate optimization suggestions based on ad performance data
   * @param performanceData - The performance data for the ads
   */
  async generateOptimizationSuggestions(performanceData: any) {
    try {
      const prompt = `Analyze the following Meta Ads performance data and provide specific optimization suggestions:
${JSON.stringify(performanceData, null, 2)}

Please provide actionable recommendations for:
1. Improving CTR
2. Reducing CPC
3. Increasing conversion rates
4. Audience targeting adjustments
5. Ad creative improvements`;

      const response = await this.axiosInstance.post('/chat/completions', {
        model: 'openai/gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert Meta Ads strategist with deep knowledge of Facebook and Instagram advertising optimization.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.5,
        max_tokens: 1500
      });

      return response.data;
    } catch (error) {
      console.error('Error generating optimization suggestions:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const openRouterClient = new OpenRouterClient();