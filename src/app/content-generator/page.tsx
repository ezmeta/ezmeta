import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AiHistory } from '@/components/shared/ai-history';
import { Sparkles, Clock } from 'lucide-react';

// Mock user ID for demonstration
const MOCK_USER_ID = '123e4567-e89b-12d3-a456-426614174000';

export default function ContentGenerator() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">AI Creative Studio</h1>
      
      <Tabs defaultValue="generator" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="generator" className="flex items-center gap-1">
            <Sparkles className="h-4 w-4" />
            <span>Content Generator</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>Generation History</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="generator">
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-4">Generate Ad Copy</h2>
            <p className="text-gray-600 mb-4">
              Use AI to generate compelling ad copy based on your performance data
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ad Objective
              </label>
              <select className="w-full p-2 border border-gray-300 rounded-md">
                <option>Brand Awareness</option>
                <option>Traffic</option>
                <option>Engagement</option>
                <option>Conversions</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Describe your target audience"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product/Service Description
              </label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={4}
                placeholder="Describe your product or service"
              ></textarea>
            </div>
            
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>Generate Content</span>
            </button>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <AiHistory userId={MOCK_USER_ID} limit={20} />
        </TabsContent>
      </Tabs>
      
      <div className="mt-4">
        <Link
          href="/dashboard"
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}