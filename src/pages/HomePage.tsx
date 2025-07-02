import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/authStore';
import { 
  Shield, 
  Users, 
  Sparkles, 
  CheckCircle, 
  ArrowRight,
  Globe,
  Palette,
  BarChart3
} from 'lucide-react';

export function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const features = [
    {
      icon: Shield,
      title: 'No Crypto Complexity',
      description: 'Secure digital content distribution without requiring users to understand blockchain technology.',
    },
    {
      icon: Users,
      title: 'Fan Engagement',
      description: 'Connect directly with your audience through exclusive digital content and campaigns.',
    },
    {
      icon: Sparkles,
      title: 'AI-Powered Creation',
      description: 'Generate compelling content, backgrounds, and artistic QR codes with advanced AI tools.',
    },
    {
      icon: Globe,
      title: 'Algorand Integration',
      description: 'Optional blockchain logging for campaign metadata verification and transparency.',
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Personalize your campaigns with custom designs, colors, and artistic elements.',
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track campaign performance with detailed insights and conversion metrics.',
    },
  ];

  const benefits = [
    'Create unlimited campaigns with Pro subscription',
    'Email verification system for secure claims',
    'Real-time analytics and performance tracking',
    'CSV export for email marketing integration',
    'Mobile-responsive claim pages',
    'Professional support and documentation',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-b from-mint-50/50 to-background">
        <div className="container text-center space-y-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Empower Your{' '}
              <span className="text-gradient">Digital Creativity</span>
            </h1>
            <p className="text-lg text-muted-foreground mt-6 max-w-2xl mx-auto">
              LazyMint enables creators to securely engage fans and distribute unique digital content 
              without crypto complexities, featuring lazy minting of verifiable campaign data to Algorand.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
            {isAuthenticated ? (
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="btn-mint text-lg px-8 py-6"
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <Button 
                size="lg" 
                onClick={() => navigate('/register')}
                className="btn-mint text-lg px-8 py-6"
              >
                Start Creating
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            
            <Button 
                size="lg" 
                variant="outline" 
                onClick={() => navigate('/demo')}
                className="text-lg px-8 py-6"
            >
              Try Demo
            </Button>
          </div>

          <div className="pt-8">
            <img
              src="https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
              alt="Digital content creation"
              className="mx-auto rounded-lg max-w-3xl w-full"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="section-padding">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Powerful tools and features designed to help creators build, engage, and monetize their digital presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-mint-500 mb-3" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-mint-50/50 dark:bg-mint-950/10">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-5">
                Why Choose LazyMint?
              </h2>
              <p className="text-base text-muted-foreground mb-6">
                Built for creators who want to focus on their art, not the technology. 
                Our platform handles the complexity so you can concentrate on what matters most.
              </p>
              
              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="h-5 w-5 text-mint-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Button 
                  size="lg"
                  onClick={() => navigate('/pricing')}
                  className="btn-mint"
                >
                  View Pricing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg"
                alt="Creator workspace"
                className="rounded-lg w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mint-500/10 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container">
          <Card className="bg-gradient-to-r from-mint-500 to-mint-600 text-white">
            <CardContent className="p-10 text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">
                Ready to Get Started?
              </h2>
              <p className="text-lg mb-6 text-mint-100">
                Join thousands of creators who trust LazyMint for their digital content distribution.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="text-lg px-8 py-6"
                >
                  Start Free Trial
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/contact')}
                  className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-mint-600"
                >
                  Contact Sales
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}