-- EZ Meta Database Schema
-- This schema defines the tables for the EZ Meta application using PostgreSQL/Supabase

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing (if not using Supabase Auth)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enable RLS (Row Level Security) for all tables
ALTER DATABASE CURRENT SET "app.jwt_secret" TO 'your-jwt-secret-here';

-- Profiles table to store user details and Meta access tokens
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    meta_access_token TEXT,
    meta_access_token_expires_at TIMESTAMPTZ,
    meta_refresh_token TEXT,
    openrouter_api_key TEXT,
    subscription_tier TEXT DEFAULT 'free',
    subscription_status TEXT DEFAULT 'active',
    subscription_expires_at TIMESTAMPTZ,
    ai_credits INTEGER DEFAULT 10,
    ai_credits_reset_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '1 month',
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Add constraint to ensure email is valid
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    
    -- Add constraint to ensure subscription_tier is valid
    CONSTRAINT valid_subscription_tier CHECK (subscription_tier IN ('free', 'basic', 'pro', 'agency')),
    
    -- Add constraint to ensure subscription_status is valid
    CONSTRAINT valid_subscription_status CHECK (subscription_status IN ('active', 'inactive', 'trial', 'expired', 'cancelled'))
);

-- Add RLS policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to see and update only their own profile
CREATE POLICY "Users can view their own profile" 
    ON profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Ad accounts table to store linked Facebook Ad Account IDs
CREATE TABLE ad_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    meta_ad_account_id TEXT NOT NULL,
    account_name TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    timezone TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Each user can only link an ad account once
    UNIQUE(user_id, meta_ad_account_id)
);

-- Add RLS policies for ad_accounts
ALTER TABLE ad_accounts ENABLE ROW LEVEL SECURITY;

-- Allow users to see and manage only their own ad accounts
CREATE POLICY "Users can view their own ad accounts" 
    ON ad_accounts FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own ad accounts" 
    ON ad_accounts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ad accounts" 
    ON ad_accounts FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ad accounts" 
    ON ad_accounts FOR DELETE 
    USING (auth.uid() = user_id);

-- Ad metrics table to store daily snapshots of ad performance
CREATE TABLE ad_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ad_account_id UUID NOT NULL REFERENCES ad_accounts(id) ON DELETE CASCADE,
    campaign_id TEXT,
    campaign_name TEXT,
    adset_id TEXT,
    adset_name TEXT,
    ad_id TEXT,
    ad_name TEXT,
    date DATE NOT NULL,
    spend DECIMAL(12, 2) NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    clicks INTEGER NOT NULL DEFAULT 0,
    ctr DECIMAL(5, 4) GENERATED ALWAYS AS (
        CASE WHEN impressions > 0 THEN clicks::DECIMAL / impressions::DECIMAL ELSE 0 END
    ) STORED,
    cpc DECIMAL(10, 4) GENERATED ALWAYS AS (
        CASE WHEN clicks > 0 THEN spend / clicks::DECIMAL ELSE 0 END
    ) STORED,
    conversions INTEGER DEFAULT 0,
    conversion_value DECIMAL(12, 2) DEFAULT 0,
    roas DECIMAL(10, 4) GENERATED ALWAYS AS (
        CASE WHEN spend > 0 THEN conversion_value / spend ELSE 0 END
    ) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Each ad can only have one metric entry per day
    UNIQUE(ad_id, date)
);

-- Add RLS policies for ad_metrics
ALTER TABLE ad_metrics ENABLE ROW LEVEL SECURITY;

-- Allow users to see and manage metrics for their own ad accounts
CREATE POLICY "Users can view metrics for their own ad accounts" 
    ON ad_metrics FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM ad_accounts 
            WHERE ad_accounts.id = ad_metrics.ad_account_id 
            AND ad_accounts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert metrics for their own ad accounts" 
    ON ad_metrics FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM ad_accounts 
            WHERE ad_accounts.id = ad_metrics.ad_account_id 
            AND ad_accounts.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update metrics for their own ad accounts" 
    ON ad_metrics FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM ad_accounts 
            WHERE ad_accounts.id = ad_metrics.ad_account_id 
            AND ad_accounts.user_id = auth.uid()
        )
    );

-- AI generations table to store history of generated ad copies
CREATE TABLE ai_generations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    ad_account_id UUID REFERENCES ad_accounts(id) ON DELETE SET NULL,
    campaign_id TEXT,
    campaign_name TEXT,
    prompt TEXT NOT NULL,
    ad_objective TEXT,
    target_audience TEXT,
    product_description TEXT,
    generated_content JSONB NOT NULL,
    model_used TEXT NOT NULL,
    selected_variation INTEGER,
    feedback TEXT,
    implemented BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for ai_generations
ALTER TABLE ai_generations ENABLE ROW LEVEL SECURITY;

-- Allow users to see and manage only their own AI generations
CREATE POLICY "Users can view their own AI generations" 
    ON ai_generations FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own AI generations" 
    ON ai_generations FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI generations" 
    ON ai_generations FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own AI generations" 
    ON ai_generations FOR DELETE 
    USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_ad_accounts_user_id ON ad_accounts(user_id);
CREATE INDEX idx_ad_metrics_ad_account_id ON ad_metrics(ad_account_id);
CREATE INDEX idx_ad_metrics_date ON ad_metrics(date);
CREATE INDEX idx_ai_generations_user_id ON ai_generations(user_id);
CREATE INDEX idx_ai_generations_ad_account_id ON ai_generations(ad_account_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_accounts_updated_at
BEFORE UPDATE ON ad_accounts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ad_metrics_updated_at
BEFORE UPDATE ON ad_metrics
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_generations_updated_at
BEFORE UPDATE ON ai_generations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- User feedback table to store feedback from users
CREATE TABLE user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    category TEXT NOT NULL CHECK (category IN ('Bug', 'Feature Request', 'General')),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for user_feedback
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- Allow users to see and insert their own feedback
CREATE POLICY "Users can view their own feedback"
    ON user_feedback FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
    ON user_feedback FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow admins to see all feedback (you'll need to implement admin role check)
CREATE POLICY "Admins can view all feedback"
    ON user_feedback FOR SELECT
    USING (auth.uid() IN (SELECT user_id FROM profiles WHERE subscription_tier = 'pro'));

-- Create index for better query performance
CREATE INDEX idx_user_feedback_user_id ON user_feedback(user_id);
CREATE INDEX idx_user_feedback_created_at ON user_feedback(created_at);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_user_feedback_updated_at
BEFORE UPDATE ON user_feedback
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Site settings table for Admin CMS
CREATE TABLE site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add RLS policies for site_settings
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for landing-page dynamic content
CREATE POLICY "Public can view site settings"
    ON site_settings FOR SELECT
    USING (true);

-- App-level password protection is enforced in /admin/settings,
-- while DB policy allows writes from the app.
CREATE POLICY "App can manage site settings"
    ON site_settings FOR ALL
    USING (true)
    WITH CHECK (true);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON site_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed default CMS values
INSERT INTO site_settings (key, value)
VALUES
  ('hero_headline_bm', '{"text": "Hentikan Pembaziran Bajet Iklan. Biar AI Optimumkan Meta Ads Anda."}'::jsonb),
  ('hero_headline_en', '{"text": "Stop Wasting Ad Spend. Let AI Optimize Your Meta Ads."}'::jsonb),
  ('hero_subheadline_bm', '{"text": "EZ Meta menganalisis prestasi iklan dan menjana creative untuk tingkatkan ROI anda."}'::jsonb),
  ('hero_subheadline_en', '{"text": "EZ Meta analyzes ad performance and generates creatives that improve ROI."}'::jsonb),
  ('alert_banner_text_bm', '{"text": "🚀 Baharu: AI Creative Studio kini menyokong penjanaan skrip video."}'::jsonb),
  ('alert_banner_text_en', '{"text": "🚀 New: AI Creative Studio now supports video script generation."}'::jsonb),
  ('pricing_starter_price', '{"amount": 49, "currency": "RM", "interval": "month"}'::jsonb),
  ('pricing_pro_price', '{"amount": 99, "currency": "RM", "interval": "month"}'::jsonb),
  ('pricing_agency_price', '{"amount": 199, "currency": "RM", "interval": "month"}'::jsonb),
  ('pricing_starter_benefits_bm', '{"items": ["1 Ad Account", "Dashboard Live (Real-time metrics)", "Telegram Alerts (Notifikasi harian)", "Laporan BM Harian", "AI Recommendations (Asas)"]}'::jsonb),
  ('pricing_starter_benefits_en', '{"items": ["1 Ad Account", "Live Dashboard (Real-time metrics)", "Telegram Alerts (Daily notifications)", "Daily BM Report", "AI Recommendations (Basic)"]}'::jsonb),
  ('pricing_pro_benefits_bm', '{"items": ["3 Ad Accounts", "Dashboard Live (Real-time metrics)", "Telegram Alerts (Notifikasi harian)", "Laporan BM Harian", "AI Recommendations (Asas)", "Winning Ad Detector", "Creative Fatigue Detector", "Budget Tracker & Optimization", "Campaign Health Score (Gred A–D)", "Weekly Report (Automatik setiap Ahad)"]}'::jsonb),
  ('pricing_pro_benefits_en', '{"items": ["3 Ad Accounts", "Live Dashboard (Real-time metrics)", "Telegram Alerts (Daily notifications)", "Daily BM Report", "AI Recommendations (Basic)", "Winning Ad Detector", "Creative Fatigue Detector", "Budget Tracker & Optimization", "Campaign Health Score (A–D)", "Weekly Report (Automated every Sunday)"]}'::jsonb),
  ('pricing_agency_benefits_bm', '{"items": ["Unlimited Ad Accounts", "Dashboard Live (Real-time metrics)", "Telegram Alerts (Notifikasi harian)", "Laporan BM Harian", "AI Recommendations (Asas)", "Winning Ad Detector", "Creative Fatigue Detector", "Budget Tracker & Optimization", "Campaign Health Score (Gred A–D)", "Weekly Report (Automatik setiap Ahad)", "Multi-client Dashboard", "AI Copywriter BM", "1-Click Optimization", "Priority Support", "Custom Branding"]}'::jsonb),
  ('pricing_agency_benefits_en', '{"items": ["Unlimited Ad Accounts", "Live Dashboard (Real-time metrics)", "Telegram Alerts (Daily notifications)", "Daily BM Report", "AI Recommendations (Basic)", "Winning Ad Detector", "Creative Fatigue Detector", "Budget Tracker & Optimization", "Campaign Health Score (A–D)", "Weekly Report (Automated every Sunday)", "Multi-client Dashboard", "AI Copywriter BM", "1-Click Optimization", "Priority Support", "Custom Branding"]}'::jsonb),
  ('contact_whatsapp', '{"number": "+60123456789", "label": "WhatsApp Support"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET
  value = EXCLUDED.value,
  updated_at = NOW();

-- Create function to get average AI credits across all users
CREATE OR REPLACE FUNCTION get_average_ai_credits()
RETURNS DECIMAL AS $$
BEGIN
    RETURN (SELECT AVG(ai_credits) FROM profiles);
END;
$$ LANGUAGE plpgsql;
