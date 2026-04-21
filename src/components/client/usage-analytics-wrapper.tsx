'use client';

import { UsageAnalytics } from '@/components/shared/usage-analytics';

interface UsageAnalyticsWrapperProps {
  userId: string;
}

export function UsageAnalyticsWrapper({ userId }: UsageAnalyticsWrapperProps) {
  return <UsageAnalytics userId={userId} />;
}