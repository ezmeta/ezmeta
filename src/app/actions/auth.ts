'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient } from '@supabase/ssr';
import { supabaseConfig } from '@/config/env';

export async function loginAction(formData: FormData): Promise<void> {
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: any) {
        cookieStore.set(name, '', { ...options, maxAge: 0 });
      },
    },
  });

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (user) {
    const { error: profileError } = await (supabase as any)
      .from('profiles')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.warn('Profile lookup during login returned:', profileError.message);
    }
  }

  redirect('/dashboard');
}

export async function signupAction(formData: FormData): Promise<void> {
  const fullName = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const password = String(formData.get('password') || '');
  const confirmPassword = String(formData.get('confirm-password') || '');

  if (!email || !password) {
    redirect('/signup?error=Missing required fields');
  }

  if (password !== confirmPassword) {
    redirect('/signup?error=Password confirmation does not match');
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseConfig.url, supabaseConfig.anonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set(name: string, value: string, options: any) {
        cookieStore.set(name, value, options);
      },
      remove(name: string, options: any) {
        cookieStore.set(name, '', { ...options, maxAge: 0 });
      },
    },
  });

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  const userId = data.user?.id;
  if (userId) {
    const { error: profileError } = await (supabase as any).from('profiles').upsert(
      {
        user_id: userId,
        email,
        full_name: fullName || null,
        subscription_tier: 'free',
        subscription_status: 'active',
        ai_credits: 10,
      },
      { onConflict: 'user_id' }
    );

    if (profileError) {
      console.error('Failed to create default profile after signup:', profileError);
    }
  }

  redirect('/dashboard');
}

