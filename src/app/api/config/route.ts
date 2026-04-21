import { NextResponse } from 'next/server';
import { validateEnv } from '@/config/env';

/**
 * API route to check if environment variables are properly configured
 * This is for demonstration purposes only and should not be used in production
 * as it could expose sensitive information about your configuration
 */
export async function GET() {
  try {
    // Validate all environment variables
    validateEnv();
    
    return NextResponse.json({
      status: 'success',
      message: 'Environment variables are properly configured',
      // Only return public variables
      publicConfig: {
        supabaseConfigured: true,
        metaConfigured: true,
        openRouterConfigured: true
      }
    });
  } catch (error) {
    // Return error without exposing sensitive information
    return NextResponse.json(
      {
        status: 'error',
        message: 'Environment variables are not properly configured',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}