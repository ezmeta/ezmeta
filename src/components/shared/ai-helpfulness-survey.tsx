'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { submitAiHelpfulnessFeedback } from '@/app/actions/feedback';

interface AiHelpfulnessSurveyProps {
  generationId: string;
}

export function AiHelpfulnessSurvey({ generationId }: AiHelpfulnessSurveyProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wasHelpful, setWasHelpful] = useState<boolean | null>(null);

  const handleFeedback = async (helpful: boolean) => {
    setIsSubmitting(true);
    setWasHelpful(helpful);
    
    try {
      await submitAiHelpfulnessFeedback(generationId, helpful);
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting AI helpfulness feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-md text-center">
        <p className="text-sm text-gray-600">
          Terima kasih atas maklum balas anda!
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-3 bg-gray-50 rounded-md">
      <p className="text-sm text-gray-600 mb-2 text-center">
        Adakah cadangan AI ini membantu anda?
      </p>
      <div className="flex justify-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedback(true)}
          disabled={isSubmitting}
          className={`flex items-center gap-1 ${wasHelpful === true ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
        >
          <ThumbsUp className="h-4 w-4" />
          <span>Ya</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleFeedback(false)}
          disabled={isSubmitting}
          className={`flex items-center gap-1 ${wasHelpful === false ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
        >
          <ThumbsDown className="h-4 w-4" />
          <span>Tidak</span>
        </Button>
      </div>
    </div>
  );
}