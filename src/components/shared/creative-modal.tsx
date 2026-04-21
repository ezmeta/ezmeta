'use client';

import { useState } from 'react';
import { Copy, Type, Image, Video, Sparkles, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { AdCreativeResponse } from '@/lib/ai-service';
import { AiHelpfulnessSurvey } from './ai-helpfulness-survey';

interface CreativeModalProps {
  isOpen: boolean;
  onClose: () => void;
  creative: AdCreativeResponse | null;
  isLoading: boolean;
  error?: string | null;
}

export function CreativeModal({ isOpen, onClose, creative, isLoading, error }: CreativeModalProps) {
  const [activeTab, setActiveTab] = useState('copywriting');
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // If no creative data and not loading, don't render
  if (!creative && !isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI Creative Studio
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-500">Generating creative ideas...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-md p-4 w-full mb-4">
              <h3 className="text-red-800 font-medium">Unable to Generate Creative</h3>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
            <Button
              variant="outline"
              onClick={() => window.location.href = '/pricing'}
              className="mt-4"
            >
              Upgrade Plan
            </Button>
          </div>
        ) : creative ? (
          <>
            {/* Analysis Banner */}
            <div className={`p-3 rounded-md mb-4 ${
              creative.analysis.status.toLowerCase().includes('low') 
                ? 'bg-yellow-50 border border-yellow-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              <h3 className="font-medium flex items-center gap-1">
                <Sparkles className="h-4 w-4" />
                {creative.analysis.status}
              </h3>
              <p className="text-sm mt-1">{creative.analysis.reasoning}</p>
            </div>

            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="copywriting" className="flex items-center gap-1">
                  <Type className="h-4 w-4" />
                  <span>Copywriting</span>
                </TabsTrigger>
                <TabsTrigger value="visual" className="flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  <span>Visual Ideas</span>
                </TabsTrigger>
                <TabsTrigger value="video" className="flex items-center gap-1">
                  <Video className="h-4 w-4" />
                  <span>Video Script</span>
                </TabsTrigger>
              </TabsList>

              {/* Copywriting Tab */}
              <TabsContent value="copywriting" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Headlines</h3>
                  <div className="space-y-3">
                    {creative.copywriting.headlines.map((headline, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{headline.text}</p>
                            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full mt-2 inline-block">
                              {headline.type}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(headline.text)}
                            className="h-8 w-8 p-0"
                          >
                            {copiedText === headline.text ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Primary Text</h3>
                  <div className="space-y-3">
                    {creative.copywriting.primary_texts.map((text, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="whitespace-pre-line">{text.text}</p>
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full mt-2 inline-block">
                              {text.style}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => copyToClipboard(text.text)}
                            className="h-8 w-8 p-0 ml-2"
                          >
                            {copiedText === text.text ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Visual Ideas Tab */}
              <TabsContent value="visual" className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Image Concepts</h3>
                  <div className="space-y-4">
                    {creative.visual_concepts.image_prompts.map((prompt, index) => (
                      <div key={index} className="p-4 border rounded-md">
                        <h4 className="font-medium mb-2">Concept {index + 1}</h4>
                        <p className="mb-3">{prompt.description}</p>
                        
                        <div className="bg-gray-50 p-3 rounded-md mb-3">
                          <h5 className="text-sm font-medium text-gray-700 mb-1">AI Generator Prompt:</h5>
                          <div className="flex justify-between items-start">
                            <p className="text-sm text-gray-600">{prompt.ai_prompt}</p>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => copyToClipboard(prompt.ai_prompt)}
                              className="h-8 w-8 p-0"
                            >
                              {copiedText === prompt.ai_prompt ? (
                                <Check className="h-4 w-4 text-green-500" />
                              ) : (
                                <Copy className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                          <h5 className="font-medium text-gray-700 mb-1">Rationale:</h5>
                          <p>{prompt.rationale}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Video Script Tab */}
              <TabsContent value="video" className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-medium">Video Script</h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        const fullScript = creative.visual_concepts.video_script.scenes
                          .map(scene => `${scene.time}:\n${scene.visual}\n${scene.audio}`)
                          .join('\n\n');
                        copyToClipboard(fullScript);
                      }}
                      className="flex items-center gap-1"
                    >
                      {copiedText?.includes('0-5s') ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span>Copy Full Script</span>
                    </Button>
                  </div>
                  
                  <h4 className="font-medium mb-2">{creative.visual_concepts.video_script.title}</h4>
                  
                  <div className="space-y-4 mt-4">
                    {creative.visual_concepts.video_script.scenes.map((scene, index) => (
                      <div key={index} className="p-4 border rounded-md">
                        <div className="flex justify-between items-start">
                          <h5 className="font-medium text-gray-700 mb-2">{scene.time}</h5>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            index === 0 ? 'bg-blue-100 text-blue-700' : 
                            index === 1 ? 'bg-green-100 text-green-700' : 
                            'bg-purple-100 text-purple-700'
                          }`}>
                            {index === 0 ? 'Hook' : index === 1 ? 'Body' : 'CTA'}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <h6 className="text-sm font-medium text-gray-700 mb-1">Visual:</h6>
                            <p className="text-sm">{scene.visual}</p>
                          </div>
                          <div>
                            <h6 className="text-sm font-medium text-gray-700 mb-1">Audio:</h6>
                            <p className="text-sm">{scene.audio}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            {/* AI Helpfulness Survey */}
            {creative.id && <AiHelpfulnessSurvey generationId={creative.id} />}
          </>
        ) : (
          <div className="py-8 text-center text-gray-500">
            No creative data available
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}