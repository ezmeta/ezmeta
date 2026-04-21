# EZ Meta Deployment Guide

This document provides comprehensive instructions for deploying EZ Meta to production environments, including all required environment variables and webhook configurations.

## Environment Variables

Set the following environment variables in your Vercel project settings:

### Core Configuration

```
NEXT_PUBLIC_APP_URL=https://your-production-domain.com
NODE_ENV=production
```

### Database Configuration (Supabase)

```
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### Authentication

```
NEXTAUTH_URL=https://your-production-domain.com
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### Meta Graph API

```
META_APP_ID=your-meta-app-id
META_APP_SECRET=your-meta-app-secret
META_REDIRECT_URI=https://your-production-domain.com/api/auth/callback/meta
```

### AI Services

```
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_API_URL=https://openrouter.ai/api/v1
```

### Stripe Integration

```
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
STRIPE_PRO_PRICE_ID=your-stripe-pro-price-id
```

## Webhook Setup

### Stripe Webhook Configuration

1. Go to the [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add Endpoint"
3. Enter your webhook URL: `https://your-production-domain.com/api/webhooks/stripe`
4. Select the following events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.paid`
   - `invoice.payment_failed`
5. Click "Add Endpoint" to save
6. Copy the Webhook Signing Secret and add it to your environment variables as `STRIPE_WEBHOOK_SECRET`

### Meta Webhook Configuration

1. Go to your [Meta App Dashboard](https://developers.facebook.com/apps/)
2. Select your app and navigate to "Webhooks"
3. Click "Create Webhook"
4. Enter your webhook URL: `https://your-production-domain.com/api/webhooks/meta`
5. Enter your verify token (create a secure random string and store it as `META_WEBHOOK_VERIFY_TOKEN` in your environment variables)
6. Subscribe to the following events:
   - `ads_insights`
   - `ads_management`
7. Click "Create" to save

## Database Migrations

Run the following SQL migrations in your Supabase SQL Editor to ensure all required schema changes are applied:

```sql
-- Add meta_access_token_expires_at column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS meta_access_token_expires_at TIMESTAMPTZ;

-- Add ai_credits_reset_at column if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS ai_credits_reset_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 month';

-- Create function to reset AI credits monthly
CREATE OR REPLACE FUNCTION reset_ai_credits()
RETURNS TRIGGER AS $$
BEGIN
  -- Reset credits based on subscription tier
  IF NEW.subscription_tier = 'pro' THEN
    NEW.ai_credits := 9999; -- Unlimited for Pro
  ELSE
    NEW.ai_credits := 10; -- Default for free tier
  END IF;
  
  -- Set next reset date to 1 month from now
  NEW.ai_credits_reset_at := NOW() + INTERVAL '1 month';
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to reset credits when reset date is reached
CREATE OR REPLACE TRIGGER trigger_reset_ai_credits
BEFORE UPDATE ON profiles
FOR EACH ROW
WHEN (OLD.ai_credits_reset_at < NOW())
EXECUTE FUNCTION reset_ai_credits();

-- Add generated_content column to ai_generations if it doesn't exist
ALTER TABLE ai_generations
ADD COLUMN IF NOT EXISTS generated_content JSONB NOT NULL DEFAULT '{}';
```

## Build and Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Configure all environment variables in the Vercel project settings
3. Deploy with the following settings:
   - Framework Preset: Next.js
   - Build Command: `next build`
   - Output Directory: `.next`
   - Install Command: `npm ci`

### Post-Deployment Verification

After deployment, verify the following:

1. User authentication flow works correctly
2. Meta API integration is functioning
3. Stripe subscriptions can be created and managed
4. AI content generation is working
5. Webhooks are receiving and processing events

## Troubleshooting

### Common Issues

1. **Meta API Token Expiration**: Meta access tokens expire after 60 days. Implement a token refresh mechanism or prompt users to reconnect.

2. **Stripe Webhook Failures**: Verify that your webhook endpoint is accessible and that the correct signing secret is configured.

3. **Database Connection Issues**: Check that your Supabase URL and keys are correctly configured.

4. **AI Service Rate Limiting**: Implement proper rate limiting and error handling for AI service calls.

## Monitoring and Maintenance

1. Set up logging with a service like Datadog or Sentry
2. Monitor Stripe webhook events for subscription changes
3. Regularly check Meta API token expiration dates
4. Monitor AI credit usage to prevent unexpected costs

## Support

For deployment assistance, contact the development team at dev@ezmeta.com.