import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Mail, 
  Download,
  Share,
  Calendar,
  MapPin,
  Users
} from 'lucide-react';

interface FanDemoProps {
  onComplete: () => void;
  onBack: () => void;
}

type DemoStep = 'discover' | 'claim' | 'verify' | 'download' | 'complete';

export function FanDemo({ onComplete, onBack }: FanDemoProps) {
  const [currentStep, setCurrentStep] = useState<DemoStep>('discover');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');

  const steps = [
    { id: 'discover', title: 'Discover Campaign', icon: Users },
    { id: 'claim', title: 'Enter Email', icon: Mail },
    { id: 'verify', title: 'Verify Email', icon: CheckCircle },
    { id: 'download', title: 'Get Content', icon: Download },
  ];

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);
  const getProgress = () => ((getCurrentStepIndex() + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === 'claim' && !email) return;
    if (currentStep === 'verify' && !verificationCode) return;

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
    setLoading(false);

    const nextSteps: Record<DemoStep, DemoStep> = {
      discover: 'claim',
      claim: 'verify',
      verify: 'download',
      download: 'complete',
      complete: 'complete'
    };

    const nextStep = nextSteps[currentStep];
    if (nextStep === 'complete') {
      onComplete();
    } else {
      setCurrentStep(nextStep);
    }
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
            <h1 className="text-2xl font-bold">Fan Experience Demo</h1>
            <p className="text-muted-foreground">Claim digital content with ease</p>
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
          {currentStep === 'discover' && (
            <Card>
              <CardHeader>
                <div className="text-center space-y-2">
                  <Badge variant="secondary" className="mb-2">Live Campaign</Badge>
                  <CardTitle className="text-2xl">🎵 Summer Festival Digital Pass</CardTitle>
                  <CardDescription className="text-base">
                    Get exclusive access to our summer music festival featuring top artists, 
                    food trucks, and amazing vibes. Limited time offer!
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video bg-gradient-to-r from-mint-400 to-mint-600 rounded-lg overflow-hidden relative">
                  <img 
                    src="https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg" 
                    alt="Festival" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <div className="text-white text-center">
                      <h3 className="text-2xl font-bold mb-2">Summer Festival 2024</h3>
                      <p className="text-lg">July 15-17 • City Park</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-mint-500" />
                    <span>July 15-17, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-mint-500" />
                    <span>Central City Park</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-mint-500" />
                    <span>234 claimed so far</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-mint-500" />
                    <span>Verified by creator</span>
                  </div>
                </div>

                <div className="bg-mint-50 dark:bg-mint-950/20 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">What you'll get:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Digital festival pass with QR code</li>
                    <li>• Exclusive artist playlist</li>
                    <li>• Early access to merchandise</li>
                    <li>• Special backstage content</li>
                  </ul>
                </div>

                <Button className="w-full btn-mint text-lg py-6" onClick={handleNext}>
                  Claim Your Digital Pass
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'claim' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-mint-500" />
                  Enter Your Email
                </CardTitle>
                <CardDescription>
                  We'll send you a verification link to claim your digital content securely
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Your email will only be used for this claim and creator updates
                  </p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Why do we need your email?
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Email verification ensures secure access and prevents automated abuse. 
                    You'll receive your digital content immediately after verification.
                  </p>
                </div>

                <Button 
                  className="w-full btn-mint" 
                  onClick={handleNext}
                  disabled={!email || loading}
                >
                  {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  Send Verification Email
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'verify' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-mint-500" />
                  Verify Your Email
                </CardTitle>
                <CardDescription>
                  We sent a verification code to <strong>{email}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="code">Verification Code</Label>
                  <Input
                    id="code"
                    placeholder="Enter the 6-digit code"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    maxLength={6}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Code expires in 10 minutes
                  </p>
                </div>

                <div className="bg-mint-50 dark:bg-mint-950/20 p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-2">Demo Code:</p>
                  <p className="text-2xl font-mono font-bold text-mint-600">123456</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    In a real scenario, this would be sent to your email
                  </p>
                </div>

                <Button 
                  className="w-full btn-mint" 
                  onClick={handleNext}
                  disabled={!verificationCode || loading}
                >
                  {loading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
                  Verify and Claim Content
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>

                <Button variant="ghost" className="w-full text-sm">
                  Didn't receive the code? Resend
                </Button>
              </CardContent>
            </Card>
          )}

          {currentStep === 'download' && (
            <Card>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-mint-100 dark:bg-mint-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-mint-500" />
                </div>
                <CardTitle className="text-2xl">Claim Successful!</CardTitle>
                <CardDescription className="text-base">
                  Your digital festival pass is ready for download
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-mint-500 to-mint-600 text-white p-6 rounded-lg text-center">
                  <h3 className="text-xl font-bold mb-2">🎵 Summer Festival Pass</h3>
                  <p className="text-mint-100 mb-4">Your exclusive digital ticket</p>
                  <div className="bg-white/20 p-4 rounded-lg">
                    <img 
                      src="https://images.pexels.com/photos/7686280/pexels-photo-7686280.jpeg" 
                      alt="QR Code" 
                      className="w-24 h-24 mx-auto rounded-lg"
                    />
                    <p className="text-sm mt-2">Scan at venue entrance</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-white text-mint-600 border-2 border-mint-200 hover:bg-mint-50">
                    <Download className="h-4 w-4 mr-2" />
                    Download Digital Pass
                  </Button>
                  
                  <Button variant="outline" className="w-full">
                    <Share className="h-4 w-4 mr-2" />
                    Share with Friends
                  </Button>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
                  <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                    Save your pass!
                  </h4>
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    Add to your phone's wallet or save the image. You'll need to show this at the venue.
                  </p>
                </div>

                <Button 
                  className="w-full btn-mint" 
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading ? <LoadingSpinner size="sm" className="mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                  Complete Fan Demo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}