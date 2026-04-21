import { Metadata } from 'next';
import Link from 'next/link';
import { Book, Sparkles, Zap, Target, BarChart3, CreditCard, HelpCircle, ChevronRight, Star, MessageSquare, Image, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'User Guide - AI Creative Studio | EZ Meta',
  description: 'Learn how to use AI Creative Studio to generate compelling ad copy, visual concepts, and video scripts for your Facebook ad campaigns.',
};

export default function GuidePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl">EZ Meta</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-slate-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/pricing" className="text-slate-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/guide" className="text-white font-medium">
              User Guide
            </Link>
          </nav>
          <Link href="/dashboard">
            <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/20 border border-violet-500/30 rounded-full text-violet-300 text-sm mb-6">
            <Book className="w-4 h-4" />
            Complete Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            AI Creative Studio
            <span className="block text-2xl md:text-3xl mt-2 text-violet-400">User Guide</span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Learn how to use our AI-powered creative generation tool to create compelling ad copy, 
            visual concepts, and video scripts for your Facebook ad campaigns.
          </p>
        </div>
      </section>

      {/* Table of Contents */}
      <section className="py-12 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <MenuIcon className="w-6 h-6" />
            Table of Contents
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <TOCLink href="#getting-started" number="01" title="Getting Started" />
            <TOCLink href="#understanding-credits" number="02" title="Understanding Credits" />
            <TOCLink href="#generating-creatives" number="03" title="Generating Creatives" />
            <TOCLink href="#copywriting-tab" number="04" title="Using the Copywriting Tab" />
            <TOCLink href="#visual-tab" number="05" title="Using the Visual Tab" />
            <TOCLink href="#video-tab" number="06" title="Using the Video Tab" />
            <TOCLink href="#history-feedback" number="07" title="History & Feedback" />
            <TOCLink href="#tips-tricks" number="08" title="Pro Tips & Tricks" />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12 space-y-16">
        {/* Getting Started */}
        <GuideSection
          id="getting-started"
          icon={<Zap className="w-6 h-6" />}
          title="Getting Started"
          subtitle="Begin your AI creative journey in 3 simple steps"
        >
          <div className="space-y-6">
            <StepCard
              number={1}
              title="Connect Your Meta Account"
              description="Before generating creatives, you need to connect your Facebook Ad Account to EZ Meta."
              details={[
                "Go to your Dashboard",
                "Click on 'Connect Account' modal",
                "Enter your Meta Business App ID and Access Token",
                "Click 'Save & Continue'"
              ]}
            />
            <StepCard
              number={2}
              title="View Your Ad Metrics"
              description="Once connected, you'll see your campaign performance data including spend, impressions, CTR, and CPC."
              details={[
                "Navigate to the Dashboard",
                "Select an Ad Account from the dropdown",
                "View real-time metrics from the last 7 days",
                "Click 'Refresh' to fetch latest data"
              ]}
            />
            <StepCard
              number={3}
              title="Generate Your First Creative"
              description="Click the magic wand button next to any campaign to generate AI-powered creatives."
              details={[
                "Find a campaign you want to optimize",
                "Click the 🪄 button in the 'Actions' column",
                "Wait for AI to analyze your metrics",
                "Explore the generated content in the modal"
              ]}
            />
          </div>
        </GuideSection>

        {/* Understanding Credits */}
        <GuideSection
          id="understanding-credits"
          icon={<CreditCard className="w-6 h-6" />}
          title="Understanding Credits"
          subtitle="How the credit system works"
        >
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4 text-violet-400">Credit Tiers</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold">Starter (Free)</span>
                </div>
                <p className="text-slate-400 text-sm">10 credits per month</p>
                <p className="text-slate-500 text-xs mt-2">Perfect for trying out the service</p>
              </div>
              <div className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 p-4 rounded-lg border border-violet-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="font-semibold text-violet-300">Pro ($49/month)</span>
                </div>
                <p className="text-slate-300 text-sm">Unlimited credits</p>
                <p className="text-slate-400 text-xs mt-2">Best for agencies and power users</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-amber-200 text-sm">
              <strong>Note:</strong> Each creative generation uses 1 credit, regardless of the type 
              (copywriting, visual, or video). Credits reset on the 1st of each month.
            </p>
          </div>

          <div className="mt-6">
            <h4 className="text-lg font-semibold mb-4">What Happens When Credits Run Out?</h4>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                <span>You'll see a warning message when generating creatives</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                <span>You'll be redirected to upgrade your plan</span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="w-4 h-4 text-violet-400 mt-1 flex-shrink-0" />
                <span>Pro users enjoy unlimited generations with no interruptions</span>
              </li>
            </ul>
          </div>
        </GuideSection>

        {/* Generating Creatives */}
        <GuideSection
          id="generating-creatives"
          icon={<Sparkles className="w-6 h-6" />}
          title="Generating Creatives"
          subtitle="How AI analyzes your data and creates content"
        >
          <p className="text-slate-300 mb-6">
            When you click the generate button, our AI analyzes your campaign's performance metrics 
            to create highly relevant and optimized content suggestions.
          </p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4">AI Analysis Factors</h4>
            <div className="grid md:grid-cols-2 gap-4">
              <MetricCard icon={<BarChart3 className="w-5 h-5" />} title="CTR (Click-Through Rate)" description="Low CTR triggers visual hook suggestions" />
              <MetricCard icon={<Target className="w-5 h-5" />} title="CPC (Cost Per Click)" description="High CPC prompts offer clarity improvements" />
              <MetricCard icon={<Zap className="w-5 h-5" />} title="Spend Data" description="Budget insights for scaling recommendations" />
              <MetricCard icon={<BarChart3 className="w-5 h-5" />} title="Impressions" description="Frequency analysis for fatigue detection" />
            </div>
          </div>

          <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-4">
            <p className="text-violet-200 text-sm">
              <strong>Smart Prompting:</strong> The AI automatically adjusts its suggestions based 
              on your metrics. For example, if your CTR is below 1%, it will focus more on 
              creating compelling visual hooks and attention-grabbing headlines.
            </p>
          </div>
        </GuideSection>

        {/* Copywriting Tab */}
        <GuideSection
          id="copywriting-tab"
          icon={<MessageSquare className="w-6 h-6" />}
          title="Using the Copywriting Tab"
          subtitle="Create compelling ad copy in seconds"
        >
          <p className="text-slate-300 mb-6">
            The Copywriting tab provides you with ready-to-use headlines and primary text 
            optimized for your campaign performance.
          </p>

          <div className="space-y-4 mb-6">
            <CopyCard
              type="Headlines"
              count={3}
              description="Short, attention-grabbing phrases (up to 255 characters)"
              styles={['Question', 'Urgency', 'Benefit-driven']}
            />
            <CopyCard
              type="Primary Text"
              count={2}
              description="Longer body copy explaining your offer (up to 63 characters)"
              styles={['Storytelling', 'Direct Response', 'Bullet Points']}
            />
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4">How to Use</h4>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="bg-violet-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <span className="text-slate-300">Read through all headline and text options</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-violet-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <span className="text-slate-300">Click the <strong>Copy</strong> button next to your favorite</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-violet-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                <span className="text-slate-300">Paste directly into Facebook Ads Manager or Business Manager</span>
              </li>
            </ol>
          </div>
        </GuideSection>

        {/* Visual Tab */}
        <GuideSection
          id="visual-tab"
          icon={<Image className="w-6 h-6" />}
          title="Using the Visual Tab"
          subtitle="AI-generated image concepts and prompts"
        >
          <p className="text-slate-300 mb-6">
            Get detailed visual concepts and ready-to-use prompts for AI image generators 
            like Midjourney, DALL-E, or Stable Diffusion.
          </p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4">What's Included</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg">
                <Image className="w-8 h-8 text-cyan-400 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold mb-1">Visual Description</h5>
                  <p className="text-slate-400 text-sm">Human-readable concept explaining the image idea</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg">
                <Sparkles className="w-8 h-8 text-violet-400 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold mb-1">AI Prompt</h5>
                  <p className="text-slate-400 text-sm">Optimized prompt ready for Midjourney/DALL-E</p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg">
                <HelpCircle className="w-8 h-8 text-amber-400 flex-shrink-0" />
                <div>
                  <h5 className="font-semibold mb-1">Rationale</h5>
                  <p className="text-slate-400 text-sm">Why this visual was recommended based on your metrics</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <p className="text-cyan-200 text-sm">
              <strong>Pro Tip:</strong> Copy the AI prompt and paste it directly into Midjourney 
              or DALL-E. Add "--ar 1:1" at the end for square Facebook feed ads, or 
              "--ar 4:5" for Instagram-style vertical images.
            </p>
          </div>
        </GuideSection>

        {/* Video Tab */}
        <GuideSection
          id="video-tab"
          icon={<Video className="w-6 h-6" />}
          title="Using the Video Tab"
          subtitle="Storyboard and script for short-form video ads"
        >
          <p className="text-slate-300 mb-6">
            The Video tab provides a complete 15-30 second video script with scene breakdowns, 
            visual descriptions, and audio cues.
          </p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4">Video Script Structure</h4>
            <div className="space-y-4">
              <SceneCard
                time="0-5s"
                title="The Hook"
                description="Grab attention immediately with a bold statement or visual"
                icon={<Zap className="w-5 h-5 text-amber-400" />}
              />
              <SceneCard
                time="5-15s"
                title="The Body"
                description="Present the problem/solution and key benefits"
                icon={<MessageSquare className="w-5 h-5 text-violet-400" />}
              />
              <SceneCard
                time="15-30s"
                title="The CTA"
                description="Clear call-to-action with urgency or incentive"
                icon={<Target className="w-5 h-5 text-cyan-400" />}
              />
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4">How to Use the Script</h4>
            <ol className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="bg-cyan-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">1</span>
                <span className="text-slate-300">Read through all scenes and timing</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-cyan-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">2</span>
                <span className="text-slate-300">Download or screenshot the storyboard for your production team</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-cyan-500 text-white text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">3</span>
                <span className="text-slate-300">Use the audio cues to match voiceover or music to the visual flow</span>
              </li>
            </ol>
          </div>
        </GuideSection>

        {/* History & Feedback */}
        <GuideSection
          id="history-feedback"
          icon={<BarChart3 className="w-6 h-6" />}
          title="History & Feedback"
          subtitle="Track your generations and help us improve"
        >
          <p className="text-slate-300 mb-6">
            All your AI generations are saved automatically. You can review past outputs 
            and provide feedback to help improve the AI.
          </p>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
            <h4 className="text-lg font-semibold mb-4">Accessing Your History</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-violet-400 mt-0.5" />
                <span className="text-slate-300">Go to <strong>Content Generator</strong> page from the sidebar</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-violet-400 mt-0.5" />
                <span className="text-slate-300">Scroll down to see your generation history</span>
              </li>
              <li className="flex items-start gap-3">
                <ChevronRight className="w-5 h-5 text-violet-400 mt-0.5" />
                <span className="text-slate-300">Click on any past generation to view full details</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <h4 className="text-lg font-semibold mb-4">Providing Feedback</h4>
            <p className="text-slate-400 mb-4">
              After viewing a generated creative, you'll see a feedback widget asking if the 
              content was helpful. Your responses help us train better models.
            </p>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <Star className="w-4 h-4 text-yellow-400 mt-1" />
                <span>Rate the generation from 1-5 stars</span>
              </li>
              <li className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-violet-400 mt-1" />
                <span>Leave optional comments on what worked or didn't</span>
              </li>
              <li className="flex items-start gap-2">
                <Target className="w-4 h-4 text-cyan-400 mt-1" />
                <span>Mark as "Implemented" if you used it in a real ad</span>
              </li>
            </ul>
          </div>
        </GuideSection>

        {/* Pro Tips */}
        <GuideSection
          id="tips-tricks"
          icon={<Sparkles className="w-6 h-6" />}
          title="Pro Tips & Tricks"
          subtitle="Get the most out of AI Creative Studio"
        >
          <div className="grid md:grid-cols-2 gap-4">
            <TipCard
              title="A/B Test Everything"
              description="Generate multiple variations and test them against each other. The AI provides diverse options for a reason!"
            />
            <TipCard
              title="Combine Outputs"
              description="Mix headlines from one generation with visuals from another for unique combinations."
            />
            <TipCard
              title="Review Before Using"
              description="Always review AI outputs carefully. They are starting points, not final products."
            />
            <TipCard
              title="Keep Brand Guidelines"
              description="Ensure generated content aligns with your brand voice and Facebook's ad policies."
            />
            <TipCard
              title="Use for Ideation"
              description="Even if you don't use the exact output, use it as inspiration for your own creative."
            />
            <TipCard
              title="Monitor Performance"
              description="Track which types of creatives perform best and request similar styles in future generations."
            />
          </div>
        </GuideSection>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-violet-900/30 to-cyan-900/30 rounded-2xl p-8 text-center border border-violet-500/30">
          <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing Ads?</h2>
          <p className="text-slate-300 mb-6 max-w-xl mx-auto">
            Start generating AI-powered creatives for your Facebook ad campaigns today.
            Connect your Meta account and let the magic begin!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-gradient-to-r from-violet-500 to-cyan-500 hover:from-violet-600 hover:to-cyan-600 text-white px-8 py-3">
                Go to Dashboard
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" className="border-slate-600 hover:bg-slate-800 px-8 py-3">
                View Pricing
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 px-4 mt-16">
        <div className="max-w-6xl mx-auto text-center text-slate-400">
          <p>EZ Meta - AI-Powered Facebook Ad Creative Studio</p>
          <p className="text-sm mt-2">Need more help? Contact our support team</p>
        </div>
      </footer>
    </div>
  );
}

// Helper Components
function TOCLink({ href, number, title }: { href: string; number: string; title: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:bg-slate-800 hover:border-violet-500/30 transition-all group"
    >
      <span className="text-violet-400 font-mono text-sm">{number}</span>
      <span className="text-slate-300 group-hover:text-white transition-colors">{title}</span>
    </a>
  );
}

function GuideSection({ 
  id, 
  icon, 
  title, 
  subtitle, 
  children 
}: { 
  id: string; 
  icon: React.ReactNode; 
  title: string; 
  subtitle: string; 
  children: React.ReactNode; 
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-violet-400">{icon}</span>
        <h2 className="text-3xl font-bold">{title}</h2>
      </div>
      <p className="text-slate-400 mb-8">{subtitle}</p>
      {children}
    </section>
  );
}

function StepCard({ number, title, description, details }: { number: number; title: string; description: string; details: string[] }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
      <div className="flex items-start gap-4">
        <div className="bg-violet-500 text-white text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
          {number}
        </div>
        <div>
          <h4 className="text-xl font-semibold mb-2">{title}</h4>
          <p className="text-slate-400 mb-4">{description}</p>
          <ul className="space-y-2">
            {details.map((detail, i) => (
              <li key={i} className="flex items-start gap-2 text-slate-300 text-sm">
                <ChevronRight className="w-4 h-4 text-violet-400 mt-0.5 flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-slate-900/50 rounded-lg">
      <span className="text-violet-400 mt-0.5">{icon}</span>
      <div>
        <h5 className="font-semibold text-sm">{title}</h5>
        <p className="text-slate-400 text-xs">{description}</p>
      </div>
    </div>
  );
}

function CopyCard({ type, count, description, styles }: { type: string; count: number; description: string; styles: string[] }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-semibold text-violet-300">{type}</h5>
        <span className="text-sm text-slate-500">{count} options</span>
      </div>
      <p className="text-slate-400 text-sm mb-3">{description}</p>
      <div className="flex flex-wrap gap-2">
        {styles.map((style, i) => (
          <span key={i} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
            {style}
          </span>
        ))}
      </div>
    </div>
  );
}

function SceneCard({ time, title, description, icon }: { time: string; title: string; description: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 p-4 bg-slate-900/50 rounded-lg">
      <span className="bg-violet-500/20 text-violet-300 px-3 py-1 rounded text-sm font-mono flex-shrink-0">
        {time}
      </span>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <h5 className="font-semibold">{title}</h5>
        </div>
        <p className="text-slate-400 text-sm">{description}</p>
      </div>
    </div>
  );
}

function TipCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
      <h5 className="font-semibold mb-2 text-violet-300">{title}</h5>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
