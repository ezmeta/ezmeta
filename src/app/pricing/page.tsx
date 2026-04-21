'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Sparkles, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createCheckoutSession } from '@/lib/stripe';
import { SUBSCRIPTION_PRICES, CREDITS_PER_PLAN } from '@/lib/stripe';
import { formatCurrency } from '@/lib/utils';
import { supabase } from '@/db/client';

interface PricingPlanProps {
  name: string;
  description: string;
  price: number | null;
  interval: string;
  features: string[];
  credits: number;
  buttonText: string;
  buttonVariant: 'default' | 'outline';
  popular?: boolean;
  disabled?: boolean;
}

const PricingPlan = ({
  name,
  description,
  price,
  interval,
  features,
  credits,
  buttonText,
  buttonVariant,
  popular = false,
  disabled = false,
}: PricingPlanProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    try {
      setLoading(true);

      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/login?redirect=/pricing');
        return;
      }

      // Get the user's profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        throw new Error('User profile not found');
      }

      // For free plan, just update the database
      if (name === 'Starter') {
        await supabase
          .from('profiles')
          .update({
            subscription_tier: 'free',
            subscription_status: 'active',
            ai_credits: CREDITS_PER_PLAN.free,
            ai_credits_reset_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
          } as any)
          .eq('user_id', user.id);
        
        router.push('/dashboard');
        return;
      }

      // For paid plans, create a checkout session
      const priceId = SUBSCRIPTION_PRICES.PRO.id;
      const successUrl = `${window.location.origin}/dashboard?subscription=success`;
      const cancelUrl = `${window.location.origin}/pricing?subscription=canceled`;

      const checkoutUrl = await createCheckoutSession(
        user.id,
        profile.email,
        priceId,
        successUrl,
        cancelUrl
      );

      // Redirect to checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Error subscribing:', error);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-lg border ${popular ? 'border-blue-500 shadow-lg' : 'border-border'} p-6 flex flex-col justify-between relative overflow-hidden`}>
      {popular && (
        <>
          <div className="absolute top-0 right-0 -mt-2 -mr-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            Popular
          </div>
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-blue-500/10 rounded-full"></div>
          <div className="absolute -bottom-6 -right-6 w-16 h-16 bg-blue-500/10 rounded-full"></div>
        </>
      )}
      <div>
        <div className="flex items-center gap-2 mb-2">
          {name === "Starter" ? (
            <Star className="h-5 w-5 text-blue-500" />
          ) : (
            <Sparkles className="h-5 w-5 text-blue-500" />
          )}
          <h3 className="text-lg font-semibold">{name}</h3>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
        <div className="mt-4 flex items-baseline">
          {price !== null ? (
            <>
              <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">{formatCurrency(price / 100)}</span>
              <span className="text-sm text-muted-foreground ml-1">/{interval}</span>
            </>
          ) : (
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Free</span>
          )}
        </div>
        <div className="mt-2 text-sm text-muted-foreground flex items-center">
          <Zap className="h-4 w-4 text-blue-500 mr-1" />
          <span className="font-medium">{credits}</span> AI credits per month
        </div>
        <ul className="mt-6 space-y-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start">
              <Check className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        variant={buttonVariant}
        className={`mt-6 w-full ${buttonVariant === 'default' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-500 text-blue-600 hover:bg-blue-50'}`}
        onClick={handleSubscribe}
        disabled={disabled || loading}
      >
        {loading ? 'Processing...' : buttonText}
      </Button>
    </div>
  );
};

export default function PricingPage() {
  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">Simple, Transparent Pricing</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Choose the plan that's right for you and start optimizing your Meta ads with AI.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <PricingPlan
          name="Starter"
          description="Perfect for trying out EZ Meta's AI capabilities"
          price={null}
          interval="month"
          credits={10}
          features={[
            "10 AI creative generations per month",
            "Meta Ads performance tracking",
            "Basic ad metrics analysis",
            "Single Meta Ad account",
            "7-day data history"
          ]}
          buttonText="Get Started Free"
          buttonVariant="outline"
        />

        <PricingPlan
          name="Pro"
          description="For marketers who need unlimited AI power"
          price={4900}
          interval="month"
          credits={9999}
          features={[
            "Unlimited AI creative generations",
            "Advanced performance analytics",
            "Multiple Meta Ad accounts",
            "30-day data history",
            "Priority support",
            "Custom AI training on your brand voice"
          ]}
          buttonText="Subscribe Now"
          buttonVariant="default"
          popular={true}
        />
      </div>

      <div className="mt-12 text-center">
        <h2 className="text-xl font-semibold">Need a custom plan?</h2>
        <p className="mt-2 text-muted-foreground">
          Contact us for enterprise pricing and custom solutions.
        </p>
        <Button variant="link" className="mt-4">
          Contact Sales
        </Button>
      </div>

      <div className="mt-16 border-t pt-8">
        <h2 className="text-xl font-semibold">Frequently Asked Questions</h2>
        <div className="mt-6 grid gap-6">
          <div>
            <h3 className="font-medium">What are AI credits?</h3>
            <p className="mt-1 text-muted-foreground">
              AI credits are used each time you generate creative content using our AI. Each generation costs 1 credit.
            </p>
          </div>
          <div>
            <h3 className="font-medium">How do I upgrade or downgrade my plan?</h3>
            <p className="mt-1 text-muted-foreground">
              You can change your plan at any time from your account settings. Upgrades take effect immediately, while downgrades will take effect at the end of your billing cycle.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Do unused credits roll over?</h3>
            <p className="mt-1 text-muted-foreground">
              No, AI credits reset at the beginning of each billing cycle. Pro plan subscribers have unlimited credits.
            </p>
          </div>
          <div>
            <h3 className="font-medium">Can I cancel my subscription?</h3>
            <p className="mt-1 text-muted-foreground">
              Yes, you can cancel your subscription at any time from your account settings. You'll continue to have access to your plan until the end of your current billing cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}