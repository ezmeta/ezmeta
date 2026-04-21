'use client';

import { useState, useEffect } from 'react';
import { Clock, Sparkles, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CreativeModal } from './creative-modal';
import { getAiGenerationHistory, updateAiGenerationFeedback } from '@/app/actions/ai';
import { AiGeneration } from '@/db/types';
import { AdCreativeResponse } from '@/lib/ai-service';

interface AiHistoryProps {
  userId: string;
  limit?: number;
}

export function AiHistory({ userId, limit = 10 }: AiHistoryProps) {
  const [history, setHistory] = useState<AiGeneration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCreative, setSelectedCreative] = useState<AdCreativeResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [userId]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const generations = await getAiGenerationHistory(userId, limit);
      setHistory(generations);
    } catch (error) {
      console.error('Error loading AI generation history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCreative = (creative: AdCreativeResponse) => {
    setSelectedCreative(creative);
    setIsModalOpen(true);
  };

  const handleFeedback = async (id: string, implemented: boolean) => {
    try {
      const feedback = implemented 
        ? 'Creative was implemented in ad campaign' 
        : 'Creative was not used';
      
      await updateAiGenerationFeedback(id, feedback, implemented);
      
      // Update local state
      setHistory(history.map(item => 
        item.id === id 
          ? { ...item, feedback, implemented } 
          : item
      ));
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 border rounded-lg shadow-md bg-white">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="p-6 border rounded-lg shadow-md bg-white">
        <h3 className="text-lg font-medium mb-4">AI Generation History</h3>
        <div className="text-center py-8">
          <p className="text-gray-500">No AI generations found.</p>
          <p className="text-gray-500 mt-2">Generate creative content for your campaigns to see history here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white">
      <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
        <Clock className="h-5 w-5 text-blue-500" />
        AI Generation History
      </h3>

      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="p-4 border rounded-md hover:bg-gray-50">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-medium">{item.campaign_name || 'Unnamed Campaign'}</h4>
                <p className="text-sm text-gray-500">
                  Generated on {new Date(item.created_at).toLocaleDateString()} at {new Date(item.created_at).toLocaleTimeString()}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {item.model_used.split('/')[1] || item.model_used}
                  </span>
                  {item.implemented && (
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center gap-1">
                      <Check className="h-3 w-3" />
                      Implemented
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleViewCreative(item.generated_content as unknown as AdCreativeResponse)}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  View
                </Button>
                
                {!item.implemented && (
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleFeedback(item.id, true)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleFeedback(item.id, false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <CreativeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        creative={selectedCreative}
        isLoading={false}
      />
    </div>
  );
}