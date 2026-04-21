/**
 * Stripe Integration Library
 * 
 * This module provides functions for interacting with the Stripe API
 * for subscription management and payment processing.
 */

import Stripe from 'stripe';
import { stripeConfig } from '@/config/env';
import { supabase } from '@/db/client';
import { Profile } from '@/db/types';

// Initialize Stripe client safely (server-only)
const stripe =
  typeof window === 'undefined' && stripeConfig.secretKey
    ? new Stripe(stripeConfig.secretKey, {
        apiVersion: '2026-03-25.dahlia',
      })
    : null;

function requireStripe(): Stripe {
  if (!stripe) {
    throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY on the server.');
  }
  return stripe;
}

// Subscription plan IDs
export const SUBSCRIPTION_PLANS = {
  FREE: 'free',
  PRO: 'pro',
};

// Subscription prices (stored in Stripe)
export const SUBSCRIPTION_PRICES = {
  PRO: {
    id: 'price_pro_monthly', // Replace with actual Stripe Price ID
    amount: 4900, // $49.00
    currency: 'usd',
    interval: 'month',
  },
};

// Credits per plan
export const CREDITS_PER_PLAN = {
  [SUBSCRIPTION_PLANS.FREE]: 10,
  [SUBSCRIPTION_PLANS.PRO]: 9999, // Effectively unlimited
};

/**
 * Create a Stripe customer for a user
 * @param userId The user ID
 * @param email The user's email
 * @returns The Stripe customer ID
 */
export async function createStripeCustomer(userId: string, email: string): Promise<string> {
  try {
    const stripeClient = requireStripe();
    // Create a new customer in Stripe
    const customer = await stripeClient.customers.create({
      email,
      metadata: {
        userId,
      },
    });

    // Update the user's profile with the Stripe customer ID
    await supabase
      .from('profiles')
      .update({ stripe_customer_id: customer.id } as any)
      .eq('user_id', userId);

    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create Stripe customer');
  }
}

/**
 * Get or create a Stripe customer for a user
 * @param userId The user ID
 * @param email The user's email
 * @returns The Stripe customer ID
 */
export async function getOrCreateStripeCustomer(userId: string, email: string): Promise<string> {
  // Check if the user already has a Stripe customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('user_id', userId)
    .single();

  if (profile && profile.stripe_customer_id) {
    return profile.stripe_customer_id;
  }

  // Create a new customer if one doesn't exist
  return createStripeCustomer(userId, email);
}

/**
 * Create a checkout session for subscription
 * @param userId The user ID
 * @param email The user's email
 * @param priceId The Stripe price ID
 * @param successUrl The URL to redirect to on success
 * @param cancelUrl The URL to redirect to on cancel
 * @returns The checkout session URL
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> {
  try {
    const stripeClient = requireStripe();
    // Get or create a Stripe customer
    const customerId = await getOrCreateStripeCustomer(userId, email);

    // Create a checkout session
    const session = await stripeClient.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
      },
    });

    return session.url || '';
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Create a billing portal session for managing subscriptions
 * @param userId The user ID
 * @param returnUrl The URL to return to after the portal session
 * @returns The billing portal URL
 */
export async function createBillingPortalSession(
  userId: string,
  returnUrl: string
): Promise<string> {
  try {
    // Get the user's Stripe customer ID
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (!profile || !profile.stripe_customer_id) {
      throw new Error('User does not have a Stripe customer ID');
    }

    // Create a billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl,
    });

    return session.url;
  } catch (error) {
    console.error('Error creating billing portal session:', error);
    throw new Error('Failed to create billing portal session');
  }
}

/**
 * Handle Stripe webhook events
 * @param event The Stripe event
 * @param signature The Stripe signature
 * @returns void
 */
export async function handleStripeWebhook(
  payload: string,
  signature: string
): Promise<void> {
  try {
    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      stripeConfig.webhookSecret
    );

    // Handle the event based on its type
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (error) {
    console.error('Error handling Stripe webhook:', error);
    throw new Error('Failed to handle Stripe webhook');
  }
}

/**
 * Handle checkout session completed event
 * @param session The checkout session
 * @returns void
 */
async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  // Get the subscription ID from the session
  if (!session.subscription || typeof session.subscription !== 'string') {
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(session.subscription);
  const userId = session.metadata?.userId;

  if (!userId) {
    console.error('No userId found in session metadata');
    return;
  }

  // Update the user's profile with the subscription details
  await supabase
    .from('profiles')
    .update({
      subscription_tier: SUBSCRIPTION_PLANS.PRO,
      subscription_status: 'active',
      subscription_expires_at: new Date((subscription as any).current_period_end * 1000).toISOString(),
      stripe_subscription_id: subscription.id,
      ai_credits: CREDITS_PER_PLAN[SUBSCRIPTION_PLANS.PRO],
      ai_credits_reset_at: new Date((subscription as any).current_period_end * 1000).toISOString(),
    } as any)
    .eq('user_id', userId);
}

/**
 * Handle subscription updated event
 * @param subscription The subscription
 * @returns void
 */
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
): Promise<void> {
  // Get the customer ID from the subscription
  const customerId = subscription.customer as string;

  // Find the user with this customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) {
    console.error('No user found with customer ID:', customerId);
    return;
  }

  // Determine the subscription status
  let status: string;
  switch (subscription.status) {
    case 'active':
    case 'trialing':
      status = 'active';
      break;
    case 'past_due':
      status = 'past_due';
      break;
    case 'canceled':
    case 'unpaid':
    case 'incomplete':
    case 'incomplete_expired':
      status = 'inactive';
      break;
    default:
      status = 'inactive';
  }

  // Update the user's profile with the subscription details
  await supabase
    .from('profiles')
    .update({
      subscription_status: status,
      subscription_expires_at: new Date((subscription as any).current_period_end * 1000).toISOString(),
    } as any)
    .eq('user_id', profile.user_id);
}

/**
 * Handle subscription deleted event
 * @param subscription The subscription
 * @returns void
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  // Get the customer ID from the subscription
  const customerId = subscription.customer as string;

  // Find the user with this customer ID
  const { data: profile } = await supabase
    .from('profiles')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (!profile) {
    console.error('No user found with customer ID:', customerId);
    return;
  }

  // Update the user's profile to revert to free tier
  await supabase
    .from('profiles')
    .update({
      subscription_tier: SUBSCRIPTION_PLANS.FREE,
      subscription_status: 'inactive',
      subscription_expires_at: null,
      ai_credits: CREDITS_PER_PLAN[SUBSCRIPTION_PLANS.FREE],
      ai_credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    } as any)
    .eq('user_id', profile.user_id);
}

/**
 * Check if a user has enough credits for an AI generation
 * @param userId The user ID
 * @returns Whether the user has enough credits
 */
export async function hasEnoughCredits(userId: string): Promise<boolean> {
  try {
    // Get the user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('ai_credits, subscription_tier, subscription_status')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      return false;
    }

    // Pro users with active subscriptions have unlimited credits
    if (
      profile.subscription_tier === SUBSCRIPTION_PLANS.PRO &&
      profile.subscription_status === 'active'
    ) {
      return true;
    }

    // Check if the user has any credits left
    return profile.ai_credits > 0;
  } catch (error) {
    console.error('Error checking credits:', error);
    return false;
  }
}

/**
 * Deduct a credit from a user's account
 * @param userId The user ID
 * @returns Whether the credit was successfully deducted
 */
export async function deductCredit(userId: string): Promise<boolean> {
  try {
    // Get the user's profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('ai_credits, subscription_tier, subscription_status')
      .eq('user_id', userId)
      .single();

    if (!profile) {
      return false;
    }

    // Pro users with active subscriptions don't need to deduct credits
    if (
      profile.subscription_tier === SUBSCRIPTION_PLANS.PRO &&
      profile.subscription_status === 'active'
    ) {
      return true;
    }

    // Check if the user has any credits left
    if (profile.ai_credits <= 0) {
      return false;
    }

    // Deduct a credit
    await supabase
      .from('profiles')
      .update({ ai_credits: profile.ai_credits - 1 } as any)
      .eq('user_id', userId);

    return true;
  } catch (error) {
    console.error('Error deducting credit:', error);
    return false;
  }
}
