# EZ Meta

## Overview
EZ Meta is an AI-powered SaaS platform designed for creative content generation, ad copywriting, and Meta Ads performance monitoring. The platform leverages Next.js 14/15 (App Router), Tailwind CSS & Shadcn UI, Supabase (PostgreSQL), OpenAI/DeepSeek API (via OpenRouter), and Meta Graph API.

## System Architecture

### Frontend
- **Next.js 14/15 (App Router)**: For server-side rendering and routing.
- **Tailwind CSS & Shadcn UI**: For styling and UI components.

### Backend
- **Supabase (PostgreSQL)**: For database management and authentication.
- **OpenAI/DeepSeek API (via OpenRouter)**: For AI-driven content generation.
- **Meta Graph API**: For Meta Ads performance monitoring.

### Folder Structure
```
EZ Meta/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── dashboard/
│   ├── content-generator/
│   └── meta-ads/
├── components/
│   ├── ui/
│   └── shared/
├── lib/
│   ├── supabase/
│   ├── openai/
│   └── meta/
├── styles/
└── public/
```

## Development Roadmap
1. **Authentication**
   - Implement Supabase Auth for user login/signup.
   - Secure routes using middleware.

2. **Content Generation**
   - Integrate OpenAI/DeepSeek API for AI-driven content.
   - Build UI for content generation.

3. **Meta Ads Integration**
   - Connect to Meta Graph API for ad performance data.
   - Display analytics in the dashboard.

4. **Deployment**
   - Deploy to Vercel or similar platform.

## Database Schema

EZ Meta uses Supabase (PostgreSQL) for data storage. The database schema is designed to store user profiles, Meta ad accounts, ad performance metrics, and AI-generated content.

### Tables

#### profiles

Stores user details and Meta API access tokens:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users(id) |
| email | TEXT | User's email address |
| full_name | TEXT | User's full name |
| avatar_url | TEXT | URL to user's avatar image |
| meta_access_token | TEXT | Meta Graph API access token |
| meta_access_token_expires_at | TIMESTAMPTZ | Token expiration date |
| meta_refresh_token | TEXT | Meta API refresh token |
| subscription_tier | TEXT | User's subscription level (free/pro/enterprise) |
| subscription_status | TEXT | Subscription status (active/inactive/trial/expired) |
| subscription_expires_at | TIMESTAMPTZ | Subscription expiration date |
| created_at | TIMESTAMPTZ | Record creation timestamp |
| updated_at | TIMESTAMPTZ | Record update timestamp |

#### ad_accounts

Stores linked Facebook Ad Account IDs:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users(id) |
| meta_ad_account_id | TEXT | Meta Ad Account ID |
| account_name | TEXT | Ad Account name |
| currency | TEXT | Account currency (default: USD) |
| timezone | TEXT | Account timezone |
| status | TEXT | Account status (active/inactive/deleted) |
| created_at | TIMESTAMPTZ | Record creation timestamp |
| updated_at | TIMESTAMPTZ | Record update timestamp |

#### ad_metrics

Stores daily snapshots of ad performance metrics:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| ad_account_id | UUID | References ad_accounts(id) |
| campaign_id | TEXT | Meta Campaign ID |
| campaign_name | TEXT | Campaign name |
| adset_id | TEXT | Ad Set ID |
| adset_name | TEXT | Ad Set name |
| ad_id | TEXT | Ad ID |
| ad_name | TEXT | Ad name |
| date | DATE | Date of metrics |
| spend | DECIMAL | Amount spent |
| impressions | INTEGER | Number of impressions |
| clicks | INTEGER | Number of clicks |
| ctr | DECIMAL | Click-through rate (calculated) |
| cpc | DECIMAL | Cost per click (calculated) |
| conversions | INTEGER | Number of conversions |
| conversion_value | DECIMAL | Value of conversions |
| roas | DECIMAL | Return on ad spend (calculated) |
| created_at | TIMESTAMPTZ | Record creation timestamp |
| updated_at | TIMESTAMPTZ | Record update timestamp |

#### ai_generations

Stores history of generated ad copies:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| user_id | UUID | References auth.users(id) |
| ad_account_id | UUID | References ad_accounts(id) |
| campaign_id | TEXT | Associated campaign ID |
| campaign_name | TEXT | Associated campaign name |
| prompt | TEXT | User prompt for generation |
| ad_objective | TEXT | Ad objective (awareness/traffic/conversion) |
| target_audience | TEXT | Description of target audience |
| product_description | TEXT | Description of product/service |
| generated_content | JSONB | Generated ad copy variations |
| model_used | TEXT | AI model used for generation |
| selected_variation | INTEGER | Index of selected variation |
| feedback | TEXT | User feedback on generation |
| implemented | BOOLEAN | Whether the ad copy was implemented |
| created_at | TIMESTAMPTZ | Record creation timestamp |
| updated_at | TIMESTAMPTZ | Record update timestamp |

### Security

The database uses Row Level Security (RLS) to ensure users can only access their own data. Each table has policies that restrict access based on the authenticated user's ID.

### TypeScript Integration

TypeScript types for the database schema are available in `src/db/types.ts`. These types ensure type safety when working with database entities throughout the application.

## Environment Configuration

EZ Meta requires several environment variables to be set for proper functionality. These are stored in a `.env.local` file in the project root.

### Required Environment Variables

```bash
# Meta Graph API
META_APP_ID=your_meta_app_id_here
META_APP_SECRET=your_meta_app_secret_here
META_ACCESS_TOKEN=your_meta_access_token_here

# OpenRouter API
OPENROUTER_API_KEY=your_openrouter_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### Environment Variable Usage

The project uses a type-safe approach to environment variables with validation:

1. All environment variables are defined and validated in `src/config/env.ts`
2. Server-only variables (like API keys) are protected from client-side access
3. Public variables (like Supabase URL) are accessible on both client and server

To use environment variables in your code:

```typescript
// Import the config
import { metaConfig, openRouterConfig, supabaseConfig } from '@/config/env';

// Use the variables
const metaAccessToken = metaConfig.accessToken; // Server-side only
const supabaseUrl = supabaseConfig.url; // Available on client and server
```

## Terminal Commands
```bash
# Initialize Next.js project
npx create-next-app@latest EZ Meta --typescript --tailwind --eslint

# Install dependencies
cd EZ Meta
npm install @supabase/supabase-js axios lucide-react

# Install shadcn-ui
npx shadcn-ui@latest init

# Run development server
npm run dev