/**
 * Database Types
 * 
 * This file contains TypeScript types that correspond to the database schema.
 * These types are used throughout the application to ensure type safety when
 * working with database entities.
 */

/**
 * User profile with Meta access tokens
 */
export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  meta_access_token: string | null;
  meta_access_token_expires_at: string | null;
  meta_refresh_token: string | null;
  openrouter_api_key: string | null;
  subscription_tier: 'free' | 'basic' | 'pro' | 'agency';
  subscription_status: 'active' | 'inactive' | 'trial' | 'expired' | 'cancelled' | 'past_due';
  subscription_expires_at: string | null;
  ai_credits: number;
  ai_credits_reset_at: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Meta Ad Account linked to a user
 */
export interface AdAccount {
  id: string;
  user_id: string;
  meta_ad_account_id: string;
  account_name: string;
  currency: string;
  timezone: string | null;
  status: 'active' | 'inactive' | 'deleted';
  created_at: string;
  updated_at: string;
}

/**
 * Daily ad performance metrics
 */
export interface AdMetric {
  id: string;
  ad_account_id: string;
  campaign_id: string | null;
  campaign_name: string | null;
  adset_id: string | null;
  adset_name: string | null;
  ad_id: string | null;
  ad_name: string | null;
  date: string;
  spend: number;
  impressions: number;
  clicks: number;
  ctr: number; // Calculated field: clicks / impressions
  cpc: number; // Calculated field: spend / clicks
  conversions: number | null;
  conversion_value: number | null;
  roas: number | null; // Calculated field: conversion_value / spend
  created_at: string;
  updated_at: string;
}

/**
 * AI-generated ad copy
 */
export interface AiGeneration {
  id: string;
  user_id: string;
  ad_account_id: string | null;
  campaign_id: string | null;
  campaign_name: string | null;
  prompt: string;
  ad_objective: string | null;
  target_audience: string | null;
  product_description: string | null;
  generated_content: GeneratedContent;
  model_used: string;
  selected_variation: number | null;
  feedback: string | null;
  implemented: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Structure of AI-generated content
 */
export interface GeneratedContent {
  variations: AdCopyVariation[];
  suggestions?: string[];
  improvement_areas?: string[];
}

/**
 * Structure of a single ad copy variation
 */
export interface AdCopyVariation {
  headline: string;
  primary_text: string;
  description?: string;
  call_to_action?: string;
}

/**
 * User feedback for the application
 */
export interface UserFeedback {
  id: string;
  user_id: string;
  rating: number;
  category: 'Bug' | 'Feature Request' | 'General';
  comment: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Database schema type that includes all tables
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      ad_accounts: {
        Row: AdAccount;
        Insert: Omit<AdAccount, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AdAccount, 'id' | 'created_at' | 'updated_at'>>;
      };
      ad_metrics: {
        Row: AdMetric;
        Insert: Omit<AdMetric, 'id' | 'ctr' | 'cpc' | 'roas' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AdMetric, 'id' | 'ctr' | 'cpc' | 'roas' | 'created_at' | 'updated_at'>>;
      };
      ai_generations: {
        Row: AiGeneration;
        Insert: Omit<AiGeneration, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AiGeneration, 'id' | 'created_at' | 'updated_at'>>;
      };
      user_feedback: {
        Row: UserFeedback;
        Insert: Omit<UserFeedback, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<UserFeedback, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
    Functions: {};
    Enums: {};
  };
}

// Type-safe database operations
export type TablesInsert<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];

export type TablesUpdate<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type TablesRow<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
