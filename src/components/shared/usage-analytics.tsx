'use client';

import { useState, useEffect } from 'react';
import { BarChart, PieChart, Activity } from 'lucide-react';
import { supabase } from '@/db/client';

interface UsageAnalyticsProps {
  userId: string;
}

interface UsageStats {
  totalGenerations: number;
  copyGenerations: number;
  visualGenerations: number;
  mostUsedTool: 'copy' | 'visual' | null;
  averageCredits: number | null;
}

export function UsageAnalytics({ userId }: UsageAnalyticsProps) {
  const [stats, setStats] = useState<UsageStats>({
    totalGenerations: 0,
    copyGenerations: 0,
    visualGenerations: 0,
    mostUsedTool: null,
    averageCredits: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsageStats() {
      try {
        setIsLoading(true);
        
        // Get all AI generations for the user
        const { data: generations, error } = await supabase
          .from('ai_generations')
          .select('id, ad_objective, generated_content')
          .eq('user_id', userId);
        
        if (error) {
          throw error;
        }

        // Get average AI credits across all users
        const { data: avgCredits, error: avgError } = await supabase
          .rpc('get_average_ai_credits');

        if (avgError) {
          console.error('Error fetching average credits:', avgError);
        }
        
        if (generations) {
          // Count total generations
          const totalGenerations = generations.length;
          
          // Count copy vs visual generations
          // Assuming we can determine the type from the generated_content or ad_objective
          let copyGenerations = 0;
          let visualGenerations = 0;
          
          generations.forEach(gen => {
            // Use type assertion to handle TypeScript errors
            const typedGen = gen as {
              generated_content: any;
              ad_objective?: string;
            };
            
            // This is a simplified logic - adjust based on your actual data structure
            const content = typedGen.generated_content;
            if (content && content.type === 'visual' || typedGen.ad_objective?.includes('image')) {
              visualGenerations++;
            } else {
              copyGenerations++;
            }
          });
          
          // Determine most used tool
          const mostUsedTool = copyGenerations > visualGenerations ? 'copy' :
                              visualGenerations > copyGenerations ? 'visual' : null;
          
          setStats({
            totalGenerations,
            copyGenerations,
            visualGenerations,
            mostUsedTool,
            averageCredits: avgCredits || null
          });
        }
      } catch (err) {
        console.error('Error fetching usage stats:', err);
        setError('Failed to load usage statistics');
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchUsageStats();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md animate-pulse">
        <div className="h-6 bg-slate-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-2 text-red-500">Error Loading Stats</h3>
        <p className="text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4 flex items-center">
        <Activity className="h-5 w-5 mr-2 text-blue-500" />
        Usage Analytics
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-md">
          <div className="flex items-center mb-2">
            <BarChart className="h-4 w-4 mr-2 text-blue-500" />
            <h4 className="font-medium text-sm">Total Generations</h4>
          </div>
          <p className="text-2xl font-bold">{stats.totalGenerations}</p>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-md">
          <div className="flex items-center mb-2">
            <PieChart className="h-4 w-4 mr-2 text-purple-500" />
            <h4 className="font-medium text-sm">Most Used Tool</h4>
          </div>
          <p className="text-2xl font-bold capitalize">
            {stats.mostUsedTool || 'None'}
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-md">
          <div className="flex items-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2 text-green-500">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M16 8h-6.5a2.5 2.5 0 0 0 0 5h3a2.5 2.5 0 0 1 0 5H6"></path>
              <path d="M12 18V6"></path>
            </svg>
            <h4 className="font-medium text-sm">Purata Baki Kredit</h4>
          </div>
          <p className="text-2xl font-bold">
            {stats.averageCredits !== null ? stats.averageCredits.toFixed(1) : 'N/A'}
          </p>
          {stats.averageCredits !== null && stats.averageCredits < 5 && (
            <p className="text-xs text-amber-600 mt-1">
              Masa sesuai untuk promosi 'Top-up'
            </p>
          )}
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-medium text-sm mb-2">Tool Usage Breakdown</h4>
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Copy
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {stats.totalGenerations > 0 
                  ? Math.round((stats.copyGenerations / stats.totalGenerations) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
            <div 
              style={{ width: `${stats.totalGenerations > 0 ? (stats.copyGenerations / stats.totalGenerations) * 100 : 0}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
            ></div>
          </div>
        </div>
        
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-purple-600 bg-purple-200">
                Visual
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-purple-600">
                {stats.totalGenerations > 0 
                  ? Math.round((stats.visualGenerations / stats.totalGenerations) * 100) 
                  : 0}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-purple-200">
            <div 
              style={{ width: `${stats.totalGenerations > 0 ? (stats.visualGenerations / stats.totalGenerations) * 100 : 0}%` }} 
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
            ></div>
          </div>
        </div>
      </div>
      
      {stats.totalGenerations === 0 && (
        <p className="text-sm text-slate-500 italic">
          No AI generations yet. Start creating content to see your usage analytics.
        </p>
      )}
    </div>
  );
}