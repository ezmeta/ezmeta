import { getUserProfile } from '@/db/client';
import type { Profile } from '@/db/types';

interface UserProfileProps {
  userId: string;
}

/**
 * Server component to display user profile information
 * This demonstrates how to use the database client in a server component
 */
export async function UserProfile({ userId }: UserProfileProps) {
  // Fetch user profile from the database
  const profile = await getUserProfile(userId) as Profile | null;
  
  if (!profile) {
    return (
      <div className="p-4 border rounded-md bg-yellow-50">
        <h3 className="text-lg font-medium mb-2">Profile Not Found</h3>
        <p>Could not find a profile for this user.</p>
      </div>
    );
  }
  
  // Calculate subscription status
  const isSubscriptionActive = profile.subscription_status === 'active' || profile.subscription_status === 'trial';
  const hasMetaToken = !!profile.meta_access_token;
  
  return (
    <div className="p-4 border rounded-md">
      <h3 className="text-lg font-medium mb-4">User Profile</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          {profile.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt={profile.full_name || 'User'} 
              className="w-12 h-12 rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500 text-lg">
                {profile.full_name ? profile.full_name[0].toUpperCase() : 'U'}
              </span>
            </div>
          )}
          
          <div>
            <h4 className="font-medium">{profile.full_name || 'Anonymous User'}</h4>
            <p className="text-sm text-gray-500">{profile.email}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 border rounded-md">
            <h5 className="text-sm font-medium text-gray-500">Subscription</h5>
            <div className="flex items-center mt-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                isSubscriptionActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {profile.subscription_status}
              </span>
              <span className="ml-2 font-medium">{profile.subscription_tier}</span>
            </div>
            {profile.subscription_expires_at && (
              <p className="text-xs text-gray-500 mt-1">
                Expires: {new Date(profile.subscription_expires_at).toLocaleDateString()}
              </p>
            )}
          </div>
          
          <div className="p-3 border rounded-md">
            <h5 className="text-sm font-medium text-gray-500">Meta API Connection</h5>
            <div className="flex items-center mt-1">
              <span className={`px-2 py-1 rounded-full text-xs ${
                hasMetaToken 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {hasMetaToken ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            {profile.meta_access_token_expires_at && (
              <p className="text-xs text-gray-500 mt-1">
                Token expires: {new Date(profile.meta_access_token_expires_at).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}