-- EZ Meta Database Schema - Final Fixed Version
-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==========================================
-- 1. PROFILES TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
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
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT valid_subscription_tier CHECK (subscription_tier IN ('free', 'basic', 'pro', 'agency')),
    CONSTRAINT valid_subscription_status CHECK (subscription_status IN ('active', 'inactive', 'trial', 'expired', 'cancelled'))
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 2. AD ACCOUNTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ad_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    meta_ad_account_id TEXT NOT NULL,
    account_name TEXT NOT NULL,
    currency TEXT NOT NULL DEFAULT 'USD',
    timezone TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, meta_ad_account_id)
);

ALTER TABLE public.ad_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own ad accounts" ON ad_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own ad accounts" ON ad_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own ad accounts" ON ad_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own ad accounts" ON ad_accounts FOR DELETE USING (auth.uid() = user_id);

-- ==========================================
-- 3. AD METRICS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ad_metrics (
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
    ctr DECIMAL(5, 4) GENERATED ALWAYS AS (CASE WHEN impressions > 0 THEN clicks::DECIMAL / impressions::DECIMAL ELSE 0 END) STORED,
    cpc DECIMAL(10, 4) GENERATED ALWAYS AS (CASE WHEN clicks > 0 THEN spend / clicks::DECIMAL ELSE 0 END) STORED,
    conversions INTEGER DEFAULT 0,
    conversion_value DECIMAL(12, 2) DEFAULT 0,
    roas DECIMAL(10, 4) GENERATED ALWAYS AS (CASE WHEN spend > 0 THEN conversion_value / spend ELSE 0 END) STORED,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(ad_id, date)
);

ALTER TABLE public.ad_metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view metrics for their own ad accounts" ON ad_metrics FOR SELECT USING (EXISTS (SELECT 1 FROM ad_accounts WHERE ad_accounts.id = ad_metrics.ad_account_id AND ad_accounts.user_id = auth.uid()));

-- ==========================================
-- 4. AI GENERATIONS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS public.ai_generations (
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

ALTER TABLE public.ai_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own AI generations" ON ai_generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own AI generations" ON ai_generations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ==========================================
-- 5. SITE SETTINGS (CMS)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "App can manage site settings" ON site_settings FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 6. FAQS (CMS)
-- ==========================================
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_bm TEXT NOT NULL,
    answer_bm TEXT NOT NULL,
    question_en TEXT NOT NULL,
    answer_en TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view FAQs" ON faqs FOR SELECT USING (true);
CREATE POLICY "App can manage FAQs" ON faqs FOR ALL USING (true) WITH CHECK (true);

-- ==========================================
-- 7. USER FEEDBACK
-- ==========================================
CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    category TEXT NOT NULL CHECK (category IN ('Bug', 'Feature Request', 'General')),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert their own feedback" ON user_feedback FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own feedback" ON user_feedback FOR SELECT USING (auth.uid() = user_id);

-- ==========================================
-- 8. FUNCTIONS & TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- 9. SEED DATA (CMS DEFAULT VALUES)
-- ==========================================
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
  ('pricing_starter_benefits_bm', '{"items": ["1 Ad Account", "Dashboard Live", "Telegram Alerts", "Laporan BM Harian", "AI Recommendations"]}'::jsonb),
  ('pricing_starter_benefits_en', '{"items": ["1 Ad Account", "Live Dashboard", "Telegram Alerts", "Daily BM Report", "AI Recommendations"]}'::jsonb),
  ('pricing_pro_benefits_bm', '{"items": ["3 Ad Accounts", "Winning Ad Detector", "Creative Fatigue Detector", "Budget Tracker", "Weekly Report"]}'::jsonb),
  ('pricing_pro_benefits_en', '{"items": ["3 Ad Accounts", "Winning Ad Detector", "Creative Fatigue Detector", "Budget Tracker", "Weekly Report"]}'::jsonb),
  ('pricing_agency_benefits_bm', '{"items": ["Unlimited Ad Accounts", "Multi-client Dashboard", "AI Copywriter BM", "1-Click Optimization", "Priority Support"]}'::jsonb),
  ('pricing_agency_benefits_en', '{"items": ["Unlimited Ad Accounts", "Multi-client Dashboard", "AI Copywriter BM", "1-Click Optimization", "Priority Support"]}'::jsonb),
  ('contact_whatsapp', '{"number": "+60123456789", "label": "WhatsApp Support"}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

INSERT INTO faqs (question_bm, answer_bm, question_en, answer_en, sort_order)
VALUES
  (
    'Adakah token API Meta saya selamat?',
    'Ya. Token anda disimpan secara selamat dan hanya digunakan untuk sinkronisasi data iklan yang dibenarkan.',
    'Is my Meta API token secure?',
    'Yes. Your token is stored securely and used only for authorized ad-data synchronization.',
    1
  ),
  (
    'Bagaimana polisi bayaran langganan?',
    'Langganan dikenakan secara bulanan. Anda boleh naik taraf, turun taraf, atau batalkan mengikut kitaran semasa.',
    'How does subscription billing work?',
    'Subscriptions are billed monthly. You can upgrade, downgrade, or cancel based on your current billing cycle.',
    2
  ),
  (
    'Adakah AI benar-benar membantu ROI?',
    'AI membantu mengenal pasti iklan berprestasi rendah, mengesan creative fatigue, dan mencadangkan tindakan untuk meningkatkan ROI.',
    'Can AI really improve ROI?',
    'AI helps identify underperforming ads, detect creative fatigue, and recommend actions to improve ROI.',
    3
  )
ON CONFLICT DO NOTHING;
