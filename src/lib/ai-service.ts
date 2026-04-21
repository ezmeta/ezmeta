import axios from 'axios';
import { openRouterConfig } from '@/config/env';
import { AdMetric } from '@/db/types';

// OpenRouter API base URL
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Types for AI Creative Generation
export interface AdCreativeResponse {
  id?: string; // Generation ID for feedback
  analysis: {
    status: string;
    reasoning: string;
  };
  copywriting: {
    headlines: Array<{
      text: string;
      type: string;
    }>;
    primary_texts: Array<{
      text: string;
      style: string;
    }>;
  };
  visual_concepts: {
    image_prompts: Array<{
      description: string;
      ai_prompt: string;
      rationale: string;
    }>;
    video_script: {
      title: string;
      scenes: Array<{
        time: string;
        visual: string;
        audio: string;
      }>;
    };
  };
}

// Mock data for development without OpenRouter API credentials
const MOCK_CREATIVE_RESPONSE: AdCreativeResponse = {
  analysis: {
    status: "Low CTR Warning",
    reasoning: "Iklan ini mempunyai CTR yang rendah (0.8%) berbanding purata industri (2.5%). Ini menunjukkan visual dan copywriting perlu lebih menarik perhatian dan relevan kepada audiens sasaran. Cadangan berikut akan membantu meningkatkan prestasi iklan."
  },
  copywriting: {
    headlines: [
      {
        text: "Jimat 50% Untuk Insurans Kereta Anda! ⏰ Tawaran Terhad",
        type: "Urgency"
      },
      {
        text: "Bagaimana 10,000+ Pemandu Malaysia Menjimatkan RM500+ Setiap Tahun?",
        type: "Question"
      },
      {
        text: "Rahsia Yang Syarikat Insurans Tak Mahu Anda Tahu Tentang Polisi Kereta",
        type: "Curiosity"
      },
      {
        text: "Insurans Kereta Terbaik 2026: Perlindungan Maksimum, Bayaran Minimum",
        type: "Benefit-focused"
      }
    ],
    primary_texts: [
      {
        text: "Bayangkan bangun setiap pagi tanpa risau tentang kos insurans kereta yang tinggi. Itulah yang dialami pelanggan kami. Dengan hanya 5 minit pendaftaran, anda boleh mula menjimatkan wang untuk perkara yang lebih penting dalam hidup anda.",
        style: "Storytelling"
      },
      {
        text: "✅ Jimat sehingga 50% untuk insurans kereta\n✅ Proses mudah dalam 5 minit\n✅ Tiada kos tersembunyi\n✅ Khidmat pelanggan 24/7\n✅ Perlindungan komprehensif\n\nJangan tunggu lagi! Klik sekarang untuk dapatkan sebut harga percuma.",
        style: "Bullet points"
      },
      {
        text: "Pelanggan kami Ahmad dari Subang Jaya menjimatkan RM632 tahun ini dengan menukar kepada kami. Cik Tan dari Penang menjimatkan RM487. Berapa yang anda boleh jimat? Ketahui sekarang dengan alat pengiraan percuma kami.",
        style: "Testimonial-based"
      }
    ]
  },
  visual_concepts: {
    image_prompts: [
      {
        description: "Gambar telefon pintar dengan aplikasi yang menunjukkan penjimatan wang dengan grafik dan angka yang jelas, dikelilingi oleh simbol duit yang terbang dan logo kereta popular di Malaysia.",
        ai_prompt: "A smartphone displaying a car insurance savings app with clear money-saving graphics and numbers, surrounded by flying money symbols and Malaysian car logos, bright colors, professional photography style, clean background, Malaysian context",
        rationale: "Visual ini menunjukkan dengan jelas faedah penjimatan wang, yang merupakan nilai utama produk, sambil menghubungkannya secara langsung dengan insurans kereta."
      },
      {
        description: "Perbandingan 'Sebelum/Selepas' yang dramatik menunjukkan pemandu Malaysia yang kelihatan risau dengan bil insurans yang tinggi, kemudian tersenyum lega dengan aplikasi di tangan dan wang simpanan.",
        ai_prompt: "Dramatic before/after comparison: worried Malaysian driver with expensive insurance bill vs same person smiling with relief holding a smartphone with app and saved money, split-screen layout, authentic Malaysian people, lifestyle photography, bright lighting, recognizable Malaysian setting",
        rationale: "Perbandingan ini mewujudkan cerita visual yang kuat tentang transformasi emosi yang dibawa oleh produk, dengan konteks tempatan yang jelas."
      },
      {
        description: "Infografik yang menunjukkan peta Malaysia dengan statistik penjimatan mengikut negeri, dengan angka-angka yang menarik perhatian dan ikon kereta.",
        ai_prompt: "Clean, modern infographic showing Malaysia map with state-by-state insurance savings statistics, eye-catching numbers, car icons, blue and green color scheme, data visualization style, professional design",
        rationale: "Infografik ini menyampaikan kredibiliti dan skala perkhidmatan, menunjukkan bahawa ia berfungsi di seluruh Malaysia."
      }
    ],
    video_script: {
      title: "Dari Risau Kepada Lega: Cerita Penjimatan Insurans Kereta",
      scenes: [
        {
          time: "0-5s",
          visual: "Pemandu Malaysia melihat bil insurans kereta dengan wajah risau. Grafik menunjukkan jumlah yang besar dengan animasi yang menarik perhatian.",
          audio: "Adakah anda penat membayar terlalu banyak untuk insurans kereta anda? Anda tidak keseorangan."
        },
        {
          time: "5-15s",
          visual: "Orang yang sama menggunakan telefon untuk mendaftar aplikasi. Animasi menunjukkan proses mudah dengan 3 langkah. Skrin menunjukkan perbandingan harga dari pelbagai syarikat insurans.",
          audio: "Dengan hanya beberapa klik, pelanggan kami telah menjimatkan purata RM500 setiap tahun. Begini caranya..."
        },
        {
          time: "15-25s",
          visual: "Montaj pelanggan sebenar dari seluruh Malaysia yang menunjukkan jumlah yang mereka jimatkan. Grafik dan nombor yang menarik perhatian muncul di skrin.",
          audio: "Sertai beribu-ribu rakyat Malaysia yang telah beralih kepada kami untuk perlindungan terbaik pada harga terendah."
        },
        {
          time: "25-30s",
          visual: "Pemandu tersenyum di dalam kereta, memegang telefon dengan aplikasi. Butang 'Daftar Sekarang' muncul dengan animasi yang menarik perhatian.",
          audio: "Mulakan perjalanan penjimatan anda hari ini. Klik untuk sebut harga percuma dalam masa kurang dari 5 minit."
        },
        {
          time: "15-30s",
          visual: "Orang tersebut kini tersenyum, menunjukkan telefon kepada rakan-rakan. Grafik menunjukkan penjimatan dengan angka yang jelas.",
          audio: "Sertai 10,000 rakyat Malaysia yang bijak yang telah beralih. Daftar sekarang untuk sebut harga percuma dan lihat berapa banyak yang anda boleh jimat hari ini!"
        }
      ]
    }
  }
};

/**
 * Check if we should use mock data
 * We use mock data if OPENROUTER_API_KEY is not set
 */
function shouldUseMockData(): boolean {
  return !openRouterConfig.apiKey;
}

/**
 * Create an axios instance for OpenRouter API
 */
function createOpenRouterClient() {
  return axios.create({
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
 * Determine if the content should be in Malay or English
 * This is a simple implementation - in a real app, you'd have more sophisticated detection
 */
function shouldUseLocalLanguage(metrics: AdMetric): boolean {
  // Check if the campaign name contains Malaysian keywords
  // This is just an example - in a real app, you'd have better detection
  const malaysianKeywords = ['malaysia', 'myr', 'rm', 'ringgit', 'promo', 'jualan', 'diskaun'];
  
  if (!metrics.campaign_name) return false;
  
  const campaignNameLower = metrics.campaign_name.toLowerCase();
  return malaysianKeywords.some(keyword => campaignNameLower.includes(keyword));
}

/**
 * Generate ad creative based on ad metrics
 * @param metrics Ad metrics data
 * @returns Ad creative response
 */
export async function generateAdCreative(metrics: AdMetric): Promise<AdCreativeResponse> {
  // Use mock data if OpenRouter API credentials are not set
  if (shouldUseMockData()) {
    console.log('Using mock data for Ad Creative');
    return MOCK_CREATIVE_RESPONSE;
  }

  try {
    // Calculate CTR and CPC from metrics
    const impressions = metrics.impressions || 0;
    const clicks = metrics.clicks || 0;
    const spend = metrics.spend || 0;
    
    const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
    const cpc = clicks > 0 ? spend / clicks : 0;
    
    // Determine if we should use Malay or English
    const useLocalLanguage = shouldUseLocalLanguage(metrics);
    
    // Create system prompt based on metrics
    let systemPrompt = `You are an expert marketing creative director specializing in digital advertising. 
Your task is to generate compelling ad creative ideas based on performance data.`;

    // Add language instruction
    if (useLocalLanguage) {
      systemPrompt += `\nPlease generate content in Bahasa Melayu (Malaysian language) that is casual and marketing-friendly.`;
    } else {
      systemPrompt += `\nPlease generate content in English that is professional and marketing-friendly.`;
    }

    // Add performance-based instructions
    if (ctr < 1.0) {
      systemPrompt += `\nThe ad has a LOW CTR (${ctr.toFixed(2)}%), so focus on creating more attention-grabbing visual hooks and compelling headlines.`;
    }
    
    if (cpc > 1.0) {
      systemPrompt += `\nThe ad has a HIGH CPC ($${cpc.toFixed(2)}), so focus on improving offer clarity and value proposition in the copy.`;
    }

    // Create user prompt with metrics data
    const userPrompt = `Please generate creative ideas for the following ad campaign:

Campaign Name: ${metrics.campaign_name || 'Unknown Campaign'}
Performance Data:
- Impressions: ${impressions.toLocaleString()}
- Clicks: ${clicks.toLocaleString()}
- CTR: ${ctr.toFixed(2)}%
- CPC: $${cpc.toFixed(2)}
- Total Spend: $${spend.toFixed(2)}

I need:
1. Three headline options with different approaches (question, urgency, benefit, etc.)
2. Two primary text options with different styles (storytelling, direct, bullet points)
3. Two image concepts with AI image generator prompts
4. A 30-second video script with hook, body, and call to action

Please format your response as a valid JSON object exactly matching this structure:
\`\`\`
{
  "analysis": {
    "status": "string (e.g., 'Low CTR Warning' or 'Winner Optimization')",
    "reasoning": "string (Brief explanation of why these recommendations are made based on the data)"
  },
  "copywriting": {
    "headlines": [
      { "text": "string", "type": "e.g., Question / Urgency / Benefit" }
    ],
    "primary_texts": [
      { "text": "string", "style": "e.g., Storytelling / Direct / Bullet points" }
    ]
  },
  "visual_concepts": {
    "image_prompts": [
      {
        "description": "string (Visual idea)",
        "ai_prompt": "string (Prompt for Midjourney/DALL-E)",
        "rationale": "string (Why this visual was chosen)"
      }
    ],
    "video_script": {
      "title": "string",
      "scenes": [
        { "time": "0-5s", "visual": "string", "audio": "string" },
        { "time": "5-15s", "visual": "string", "audio": "string" },
        { "time": "15-30s", "visual": "string", "audio": "string" }
      ]
    }
  }
}
\`\`\`

IMPORTANT: Your response must be a valid JSON object that exactly matches this structure. Do not include any text outside the JSON object.`;

    // Call OpenRouter API
    const client = createOpenRouterClient();
    const response = await client.post('', {
      model: 'anthropic/claude-3-7-sonnet', // or 'deepseek/deepseek-chat'
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    // Extract and parse the JSON response
    const content = response.data.choices[0].message.content;
    
    // Extract JSON from the response (in case the AI includes markdown code blocks)
    const jsonMatch = content.match(/```(?:json)?([\s\S]*?)```/) || [null, content];
    const jsonString = jsonMatch[1].trim();
    
    // Parse the JSON
    const creativeResponse = JSON.parse(jsonString) as AdCreativeResponse;
    
    return creativeResponse;
  } catch (error) {
    console.error('Error generating ad creative:', error);
    throw new Error('Failed to generate ad creative');
  }
}