import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CreatorDemo } from '@/components/demo/CreatorDemo';
import { FanDemo } from '@/components/demo/FanDemo';
import { 
  User, 
  Users, 
  Play, 
  RotateCcw, 
  CheckCircle 
} from 'lucide-react';

type DemoMode = 'intro' | 'creator' | 'fan' | 'complete';

export function DemoPage() {
  const [currentMode, setCurrentMode] = useState<DemoMode>('intro');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  const demoSteps = [
    { id: 'creator', title: 'Creator Experience', description: 'See how creators build campaigns' },
    { id: 'fan', title: 'Fan Experience', description: 'Experience the claim process' },
  ];

  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => [...prev, stepId]);
    
    if (stepId === 'fan' && completedSteps.includes('creator')) {
      setCurrentMode('complete');
    }
  };

  const resetDemo = () => {
    setCurrentMode('intro');
    setCompletedSteps([]);
  };

  const getProgressPercentage = () => {
    return (completedSteps.length / demoSteps.length) * 100;
  };

  if (currentMode === 'creator') {
    return <CreatorDemo onComplete={() => handleStepComplete('creator')} onBack={() => setCurrentMode('intro')} />;
  }

  if (currentMode === 'fan') {
    return <FanDemo onComplete={() => handleStepComplete('fan')} onBack={() => setCurrentMode('intro')} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50/50 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Interactive <span className="text-gradient">Demo</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience LazyMint from both creator and fan perspectives. 
            See how easy it is to create campaigns and engage with your audience.
          </p>
        </div>

        {currentMode === 'complete' ? (
          /* Completion Screen */
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <CheckCircle className="h-16 w-16 text-mint-500 mx-auto" />
              <h2 className="text-3xl font-bold">Demo Complete!</h2>
              <p className="text-lg text-muted-foreground">
                You've experienced the full LazyMint workflow. Ready to start creating your own campaigns?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="btn-mint">
                Start Creating
              </Button>
              <Button size="lg" variant="outline" onClick={resetDemo}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restart Demo
              </Button>
            </div>
          </div>
        ) : (
          /* Demo Steps */
          <div className="max-w-4xl mx-auto">
            {/* Progress */}
            <div className="mb-12">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Demo Progress</span>
                <span className="text-sm text-muted-foreground">
                  {completedSteps.length} of {demoSteps.length} completed
                </span>
              </div>
              <Progress value={getProgressPercentage()} className="h-2" />
            </div>

            {/* Demo Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Creator Demo */}
              <Card className="card-hover cursor-pointer" onClick={() => setCurrentMode('creator')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <User className="h-8 w-8 text-mint-500" />
                    {completedSteps.includes('creator') && (
                      <CheckCircle className="h-6 w-6 text-mint-500" />
                    )}
                  </div>
                  <CardTitle className="text-xl">Creator Experience</CardTitle>
                  <CardDescription>
                    Learn how to create campaigns, generate AI content, and manage your digital assets.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">You'll experience:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Campaign creation workflow</li>
                        <li>• AI-powered content generation</li>
                        <li>• Analytics and performance tracking</li>
                        <li>• Subscription tier benefits</li>
                      </ul>
                    </div>
                    
                    <Button className="w-full btn-mint">
                      <Play className="h-4 w-4 mr-2" />
                      Start Creator Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Fan Demo */}
              <Card className="card-hover cursor-pointer" onClick={() => setCurrentMode('fan')}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Users className="h-8 w-8 text-mint-500" />
                    {completedSteps.includes('fan') && (
                      <CheckCircle className="h-6 w-6 text-mint-500" />
                    )}
                  </div>
                  <CardTitle className="text-xl">Fan Experience</CardTitle>
                  <CardDescription>
                    See how fans discover, claim, and interact with digital content campaigns.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">You'll experience:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Campaign discovery process</li>
                        <li>• Email verification workflow</li>
                        <li>• Digital ticket claiming</li>
                        <li>• Content download experience</li>
                      </ul>
                    </div>
                    
                    <Button className="w-full btn-mint">
                      <Play className="h-4 w-4 mr-2" />
                      Start Fan Demo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Demo Features */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-center mb-8">What Makes LazyMint Special?</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-mint-100 dark:bg-mint-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h3 className="font-semibold mb-2">No Crypto Complexity</h3>
                    <p className="text-sm text-muted-foreground">
                      Fans don't need wallets or crypto knowledge to claim digital content
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-mint-100 dark:bg-mint-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">✨</span>
                    </div>
                    <h3 className="font-semibold mb-2">AI-Powered</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate content, backgrounds, and QR codes with advanced AI tools
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-mint-100 dark:bg-mint-900/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔗</span>
                    </div>
                    <h3 className="font-semibold mb-2">Blockchain Ready</h3>
                    <p className="text-sm text-muted-foreground">
                      Optional Algorand integration for campaign verification and transparency
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}