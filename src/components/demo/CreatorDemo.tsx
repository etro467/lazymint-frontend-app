import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Sparkles, 
  Palette, 
  QrCode,
  BarChart3,
  Upload
} from 'lucide-react';

interface CreatorDemoProps {
  onComplete: () => void;
  onBack: () => void;
}

type DemoStep = 'create' | 'generate' | 'customize' | 'analytics' | 'complete';

export function CreatorDemo({ onComplete, onBack }: CreatorDemoProps) {
  const [currentStep, setCurrentStep] = useState<DemoStep>('create');
  const [loading, setLoading] = useState(false);
  const [campaignData, setCampaignData] = useState({
    title: '',
    description: '',
    aiContent: '',
    background: '',
    qrCode: ''
  });

  const steps = [
    { id: 'create', title: 'Create Campaign', icon: Upload },
    { id: 'generate', title: 'AI Generation', icon: Sparkles },
    { id: 'customize', title: 'Customize', icon: Palette },
    { id: 'analytics', title: 'Analytics', icon: BarChart3 },
  ];

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);
  const getProgress = () => ((getCurrentStepIndex() + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === 'create' && (!campaignData.title || !campaignData.description)) {
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setLoading(false);

    const nextSteps: Record<DemoStep, DemoStep> = {
      create: 'generate',
      generate: 'customize',
      customize: 'analytics',
      analytics: 'complete',
      complete: 'complete'
    };

    const nextStep = nextSteps[currentStep];
    if (nextStep === 'complete') {
      onComplete();
    } else {
      setCurrentStep(nextStep);
    }
  };

  const handleAIGenerate = async (type: 'content' | 'background' | 'qr') => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = {
      content: "🎵 Exclusive Summer Festival Access! Join us for an unforgettable musical experience featuring top artists, food trucks, and amazing vibes. Limited time offer - claim your digital pass now!",
      background: "https://images.pexels.com/photos/2387877/pexels-photo-2387877.jpeg",
      qr: "https://images.pexels.com/photos/7686280/pexels-photo-7686280.jpeg"
    };
    
    setCampaignData(prev => ({ 
      ...prev, 
      [type === 'content' ? 'aiContent' : type]: results[type] 
    }));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50/50 to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Demo Menu
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold">Creator Experience Demo</h1>
            <p className="text-muted-foreground">Build a campaign from start to finish</p>
          </div>
          <div className="w-20"></div>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Step {getCurrentStepIndex() + 1} of {steps.length}</span>
            <span className="text-sm text-muted-foreground">{Math.round(getProgress())}% complete</span>
          </div>
          <Progress value={getProgress()} className="h-2" />
        </div>

        {/* Content */}
        <div className="max-w-2xl mx-auto">
          {currentStep === 'create' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-mint-500" />
                  Create Your Campaign
                </CardTitle>
                <CardDescription>
                  Start by giving your campaign a title and description
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Campaign Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Summer Festival Digital Tickets"
                    value={campaignData.title}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what fans will receive when they claim..."
                    value={campaignData.description}
                    onChange={(e) => setCampaignData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <Button 
                  className="w-full btn-mint" 
                  onClick={handleNext}
                  disabled={!campaignData.title || !campaignData.description || loading}
                >
                  {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  Continue to AI Generation
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'generate' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-mint-500" />
                  AI-Powered Content Generation
                </CardTitle>
                <CardDescription>
                  Use AI to generate compelling content for your campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Campaign Content</Label>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleAIGenerate('content')}
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                      Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    value={campaignData.aiContent}
                    placeholder="AI will generate engaging content for your campaign..."
                    rows={4}
                    readOnly
                  />
                </div>

                <Button 
                  className="w-full btn-mint" 
                  onClick={handleNext}
                  disabled={!campaignData.aiContent || loading}
                >
                  Continue to Customization
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'customize' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-mint-500" />
                  Customize Your Campaign
                </CardTitle>
                <CardDescription>
                  Generate custom backgrounds and artistic QR codes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label>Background Design</Label>
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                      {campaignData.background ? (
                        <img src={campaignData.background} alt="Generated background" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          Preview will appear here
                        </div>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleAIGenerate('background')}
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <Palette className="h-4 w-4 mr-2" />}
                      Generate Background
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label>Artistic QR Code</Label>
                    <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                      {campaignData.qrCode ? (
                        <img src={campaignData.qrCode} alt="Generated QR code" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <QrCode className="h-12 w-12" />
                        </div>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleAIGenerate('qr')}
                      disabled={loading}
                    >
                      {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <QrCode className="h-4 w-4 mr-2" />}
                      Generate QR Code
                    </Button>
                  </div>
                </div>

                <Button 
                  className="w-full btn-mint" 
                  onClick={handleNext}
                  disabled={loading}
                >
                  View Analytics Dashboard
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'analytics' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-mint-500" />
                  Campaign Analytics
                </CardTitle>
                <CardDescription>
                  Track your campaign performance with detailed insights
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-mint-600">1,247</div>
                    <div className="text-sm text-muted-foreground">Total Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-mint-600">234</div>
                    <div className="text-sm text-muted-foreground">Claims</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-mint-600">18.8%</div>
                    <div className="text-sm text-muted-foreground">Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-mint-600">94%</div>
                    <div className="text-sm text-muted-foreground">Verified</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Top Traffic Sources</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Direct Links</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Social Media</span>
                      <span className="text-sm font-medium">32%</span>
                    </div>
                    <Progress value={32} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Email Campaigns</span>
                      <span className="text-sm font-medium">23%</span>
                    </div>
                    <Progress value={23} className="h-2" />
                  </div>
                </div>

                <Button 
                  className="w-full btn-mint" 
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Complete Creator Demo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}