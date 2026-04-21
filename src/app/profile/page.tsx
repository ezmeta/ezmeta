import { UserProfile } from '@/components/server/user-profile';
import { UsageAnalyticsWrapper } from '@/components/client/usage-analytics-wrapper';

// Mock user ID for demonstration
const MOCK_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

export default function ProfilePage() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Your Profile</h1>
      
      <div className="grid grid-cols-1 gap-8">
        {/* User Profile Information */}
        <UserProfile userId={MOCK_USER_ID} />
        
        {/* Usage Analytics Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Usage Statistics</h2>
          <div className="client-only">
            <UsageAnalyticsWrapper userId={MOCK_USER_ID} />
          </div>
        </div>
      </div>
    </div>
  );
}