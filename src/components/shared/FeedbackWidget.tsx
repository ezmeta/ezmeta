'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Rating } from 'react-simple-star-rating';
import { Loader2, MessageCircle } from 'lucide-react';
import { submitFeedback } from '@/app/actions/feedback';

export default function FeedbackWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState<'Bug' | 'Feature Request' | 'General'>('General');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleRating = (rate: number) => {
    setRating(rate);
  };

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await submitFeedback(rating, category, comment);
      
      if (result.success) {
        setIsSubmitted(true);

        // Reset form and close dialog immediately after successful submit
        setRating(0);
        setCategory('General');
        setComment('');
        setIsSubmitted(false);
        setIsOpen(false);
      } else {
        console.error('Failed to submit feedback:', result.error);
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full bg-blue-600 p-4 shadow-lg hover:bg-blue-700"
            variant="default"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="sr-only">Beri Maklum Balas</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              {isSubmitted ? 'Terima Kasih!' : 'Beri Maklum Balas'}
            </DialogTitle>
          </DialogHeader>
          
          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center py-6">
              <p className="text-center text-muted-foreground">
                Maklum balas anda telah dihantar. Kami menghargai pandangan anda!
              </p>
            </div>
          ) : (
            <div className="flex flex-col space-y-4 py-4">
              <div className="flex flex-col items-center space-y-2">
                <p className="text-sm text-muted-foreground">Penilaian</p>
                <Rating
                  onClick={handleRating}
                  initialValue={rating}
                  size={30}
                  fillColor="#0284c7"
                  emptyColor="#e5e7eb"
                />
              </div>
              
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">Kategori</p>
                <Select value={category} onValueChange={(value) => setCategory(value as any)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bug">Bug</SelectItem>
                    <SelectItem value="Feature Request">Permintaan Ciri</SelectItem>
                    <SelectItem value="General">Umum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-muted-foreground">Komen (Pilihan)</p>
                <Textarea
                  placeholder="Berikan komen anda di sini..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={handleSubmit} 
                disabled={rating === 0 || isSubmitting}
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Submit'
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
