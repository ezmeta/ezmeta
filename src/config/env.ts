/**
 * Environment variables configuration with validation
 * 
 * This module provides type-safe access to environment variables
 * with validation to ensure all required variables are present.
 */

/**
 * Get an environment variable with validation
 * @param key The environment variable key
 * @param defaultValue Optional default value if not found
 * @param required Whether the variable is required (defaults to true)
 * @returns The environment variable value
 * @throws Error if required variable is missing
 */
function getEnvVar(key: string, defaultValue?: string, required: boolean = true): string {
  const value = process.env[key] || defaultValue;
  
  if (required && !value) {
    throw new Error(`Environment variable ${key} is required but not set.`);
  }
  
  return value || '';
}

/**
 * Check if we're in a server context
 * Used to prevent accessing server-only env vars on the client
 */
const isServer = typeof window === 'undefined';

/**
 * Supabase configuration
 */
export const supabaseConfig = {
  get url() {
    return getEnvVar('NEXT_PUBLIC_SUPABASE_URL', '', false);
  },
  get anonKey() {
    return getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', '', false);
  },
};

/**
 * OpenRouter API configuration
 * These are server-only variables
 */
export const openRouterConfig = {
  get apiKey() {
    if (!isServer) {
      console.warn('Attempted to access server-only env var OPENROUTER_API_KEY on the client');
      return '';
    }
    return getEnvVar('OPENROUTER_API_KEY');
  },
};

/**
 * Meta API configuration
 * These are server-only variables
 */
export const metaConfig = {
  get appId() {
    if (!isServer) {
      console.warn('Attempted to access server-only env var META_APP_ID on the client');
      return '';
    }
    return getEnvVar('META_APP_ID');
  },
  
  get appSecret() {
    if (!isServer) {
      console.warn('Attempted to access server-only env var META_APP_SECRET on the client');
      return '';
    }
    return getEnvVar('META_APP_SECRET');
  },
  
  get accessToken() {
    if (!isServer) {
      console.warn('Attempted to access server-only env var META_ACCESS_TOKEN on the client');
      return '';
    }
    return getEnvVar('META_ACCESS_TOKEN');
  },
};

/**
 * Stripe API configuration
 * Secret key is server-only, publishable key is available on client
 */
export const stripeConfig = {
  get secretKey() {
    if (!isServer) {
      console.warn('Attempted to access server-only env var STRIPE_SECRET_KEY on the client');
      return '';
    }
    return getEnvVar('STRIPE_SECRET_KEY');
  },
  
  get webhookSecret() {
    if (!isServer) {
      console.warn('Attempted to access server-only env var STRIPE_WEBHOOK_SECRET on the client');
      return '';
    }
    return getEnvVar('STRIPE_WEBHOOK_SECRET');
  },
  
  get publishableKey() {
    return getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', '', false);
  },
};

/**
 * Validate all required environment variables on startup
 * This will throw an error if any required variables are missing
 */
export function validateEnv(): void {
  if (isServer) {
    // Validate server-only variables
    openRouterConfig.apiKey;
    metaConfig.appId;
    metaConfig.appSecret;
    metaConfig.accessToken;
    stripeConfig.secretKey;
    stripeConfig.webhookSecret;
  }
  
  // Validate public variables
  supabaseConfig.url;
  supabaseConfig.anonKey;
  if (!stripeConfig.publishableKey) {
    console.warn('⚠️ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not set. Stripe checkout UI may be unavailable.');
  }
}

// Validate environment variables in development
if (process.env.NODE_ENV !== 'production') {
  try {
    validateEnv();
    console.log('✅ Environment variables validated successfully');
  } catch (error) {
    console.error('❌ Environment validation failed:', error);
  }
}
