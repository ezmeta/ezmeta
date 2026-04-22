import { cookies } from 'next/headers';
import { getSystemApiSettings, type SystemApiSettings } from '@/app/actions/admin-settings';

export type RuntimeConfigSummary = {
  openrouter: {
    configured: boolean;
    source: 'env' | 'db' | 'none';
    model: string;
    apiKeyPreview: string;
  };
  meta: {
    configured: boolean;
    source: 'env' | 'db' | 'none';
    appId: string;
    appSecretPreview: string;
    accessTokenPreview: string;
  };
  stripe: {
    configured: boolean;
    source: 'env' | 'db' | 'none';
    publishableKey: string;
    secretKeyPreview: string;
    webhookSecretPreview: string;
  };
  telegram: {
    configured: boolean;
    source: 'env' | 'db' | 'none';
    chatId: string;
    botTokenPreview: string;
  };
  tools: {
    configured: boolean;
    source: 'env' | 'db' | 'none';
    webhookUrl: string;
  };
};

function pickWithSource(envValue: string | undefined, dbValue: string): { value: string; source: 'env' | 'db' | 'none' } {
  const envTrimmed = (envValue ?? '').trim();
  if (envTrimmed.length > 0) return { value: envTrimmed, source: 'env' };

  const dbTrimmed = (dbValue ?? '').trim();
  if (dbTrimmed.length > 0) return { value: dbTrimmed, source: 'db' };

  return { value: '', source: 'none' };
}

export function maskSecret(value: string): string {
  if (!value) return '';
  if (value.length <= 8) return '••••••••';
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export async function assertAdminApiAccess(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get('admin_auth')?.value === 'true';
}

export async function getMergedRuntimeConfig(): Promise<{ raw: SystemApiSettings; summary: RuntimeConfigSummary }> {
  const db = await getSystemApiSettings();

  const openRouterApiKey = pickWithSource(process.env.OPENROUTER_API_KEY, db.openrouter_api_key);
  const openRouterModel = pickWithSource(process.env.OPENROUTER_MODEL, db.openrouter_model || 'openai/gpt-4o-mini');

  const metaAppId = pickWithSource(process.env.META_APP_ID, db.meta_app_id);
  const metaAppSecret = pickWithSource(process.env.META_APP_SECRET, db.meta_app_secret);
  const metaAccessToken = pickWithSource(process.env.META_ACCESS_TOKEN, db.meta_access_token);

  const stripeSecret = pickWithSource(process.env.STRIPE_SECRET_KEY, db.stripe_secret_key);
  const stripeWebhook = pickWithSource(process.env.STRIPE_WEBHOOK_SECRET, db.stripe_webhook_secret);
  const stripePublishable = pickWithSource(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, db.stripe_publishable_key);

  const telegramToken = pickWithSource(process.env.TELEGRAM_BOT_TOKEN, db.telegram_bot_token);
  const telegramChat = pickWithSource(process.env.TELEGRAM_CHAT_ID, db.telegram_chat_id);

  const toolsWebhook = pickWithSource(process.env.TOOLS_WEBHOOK_URL, db.tools_webhook_url);

  const raw: SystemApiSettings = {
    openrouter_api_key: openRouterApiKey.value,
    openrouter_model: openRouterModel.value || 'openai/gpt-4o-mini',
    meta_app_id: metaAppId.value,
    meta_app_secret: metaAppSecret.value,
    meta_access_token: metaAccessToken.value,
    stripe_secret_key: stripeSecret.value,
    stripe_webhook_secret: stripeWebhook.value,
    stripe_publishable_key: stripePublishable.value,
    telegram_bot_token: telegramToken.value,
    telegram_chat_id: telegramChat.value,
    tools_webhook_url: toolsWebhook.value,
  };

  const summary: RuntimeConfigSummary = {
    openrouter: {
      configured: Boolean(raw.openrouter_api_key),
      source: openRouterApiKey.source,
      model: raw.openrouter_model,
      apiKeyPreview: maskSecret(raw.openrouter_api_key),
    },
    meta: {
      configured: Boolean(raw.meta_app_id && raw.meta_app_secret && raw.meta_access_token),
      source: metaAppId.source === 'env' || metaAppSecret.source === 'env' || metaAccessToken.source === 'env'
        ? 'env'
        : metaAppId.source === 'db' || metaAppSecret.source === 'db' || metaAccessToken.source === 'db'
          ? 'db'
          : 'none',
      appId: raw.meta_app_id,
      appSecretPreview: maskSecret(raw.meta_app_secret),
      accessTokenPreview: maskSecret(raw.meta_access_token),
    },
    stripe: {
      configured: Boolean(raw.stripe_secret_key && raw.stripe_webhook_secret),
      source: stripeSecret.source === 'env' || stripeWebhook.source === 'env' || stripePublishable.source === 'env'
        ? 'env'
        : stripeSecret.source === 'db' || stripeWebhook.source === 'db' || stripePublishable.source === 'db'
          ? 'db'
          : 'none',
      publishableKey: raw.stripe_publishable_key,
      secretKeyPreview: maskSecret(raw.stripe_secret_key),
      webhookSecretPreview: maskSecret(raw.stripe_webhook_secret),
    },
    telegram: {
      configured: Boolean(raw.telegram_bot_token && raw.telegram_chat_id),
      source: telegramToken.source === 'env' || telegramChat.source === 'env'
        ? 'env'
        : telegramToken.source === 'db' || telegramChat.source === 'db'
          ? 'db'
          : 'none',
      chatId: raw.telegram_chat_id,
      botTokenPreview: maskSecret(raw.telegram_bot_token),
    },
    tools: {
      configured: Boolean(raw.tools_webhook_url),
      source: toolsWebhook.source,
      webhookUrl: raw.tools_webhook_url,
    },
  };

  return { raw, summary };
}

