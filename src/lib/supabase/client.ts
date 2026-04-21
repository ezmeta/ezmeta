// Re-export the Supabase client from our database client
import { supabase } from '@/db/client';
export { supabase };

// This file is kept for backward compatibility
// New code should import from @/db/client directly

export const supabaseClient = {
  auth: {
    signUp: async ({ email, password }: { email: string; password: string }) => {
      console.log('Supabase signUp called with:', email);
      // Mock implementation
      return { data: { user: { id: '123', email } }, error: null };
    },
    signIn: async ({ email, password }: { email: string; password: string }) => {
      console.log('Supabase signIn called with:', email);
      // Mock implementation
      return { data: { user: { id: '123', email } }, error: null };
    },
    signOut: async () => {
      console.log('Supabase signOut called');
      // Mock implementation
      return { error: null };
    },
  },
  from: (table: string) => ({
    select: () => ({
      eq: (field: string, value: any) => ({
        then: (callback: Function) => {
          // Mock data
          const mockData = {
            users: [{ id: '123', name: 'Test User', email: 'test@example.com' }],
            ad_accounts: [{ id: '456', name: 'Test Ad Account' }],
            campaigns: [{ id: '789', name: 'Test Campaign' }],
          };
          
          // @ts-ignore - This is just a mock
          return callback({ data: mockData[table] || [], error: null });
        },
      }),
    }),
    insert: (data: any) => ({
      then: (callback: Function) => {
        console.log(`Supabase insert into ${table}:`, data);
        return callback({ data, error: null });
      },
    }),
    update: (data: any) => ({
      eq: (field: string, value: any) => ({
        then: (callback: Function) => {
          console.log(`Supabase update ${table} where ${field} = ${value}:`, data);
          return callback({ data, error: null });
        },
      }),
    }),
    delete: () => ({
      eq: (field: string, value: any) => ({
        then: (callback: Function) => {
          console.log(`Supabase delete from ${table} where ${field} = ${value}`);
          return callback({ data: null, error: null });
        },
      }),
    }),
  }),
};