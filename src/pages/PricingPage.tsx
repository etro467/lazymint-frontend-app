import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { SUBSCRIPTION_TIERS } from '@/config/revenuecat';
import { Check, Crown, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { 
    currentTier, 
    packages, 
    loading, 
    purchasePackage, 
    initializeSubscription 
  } = useSubscriptionStore();

  useEffect(() => {
    initializeSubscription();
  }, [initializeSubscription]);

  const handlePurchase = async (tier: typeof SUBSCRIPTION_TIERS[0]) => {
    if (!isAuthenticated) {
      navigate('/register');
      return;
    }

    if (tier.id === 'free') {
      return;
    }

    try {
      const packageToPurchase = packages.find(pkg => pkg.identifier === tier.id);
      if (!packageToPurchase) {
        toast.error('Package not available. Please try again.');
        return;
      }

      await purchasePackage(packageToPurchase);
      toast.success(`Successfully upgraded to ${tier.name}!`);
    } catch (error: any) {
      toast.error(error.message || 'Purchase failed. Please try again.');
    }
  };

  const isCurrentTier = (tierId: string) => currentTier.id === tierId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50/50 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="text-gradient">Plan</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core features 
            with advanced tools available on higher tiers.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative card-hover ${
                tier.popular 
                  ? 'border-mint-500 shadow-lg shadow-mint-200/25' 
                  : ''
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-mint-500 to-mint-600 text-white">
                    <Crown className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <CardTitle className="text-2xl">{tier.name}</CardTitle>
                <CardDescription className="text-base">{tier.description}</CardDescription>
                
                <div className="py-4">
                  <div className="text-4xl font-bold">
                    {tier.price}
                    {tier.priceValue > 0 && (
                      <span className="text-lg font-normal text-muted-foreground">/month</span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <ul className="space-y-3">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-mint-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Action Button */}
                <Button
                  className={`w-full ${
                    tier.popular 
                      ? 'btn-mint' 
                      : 'border-mint-200 hover:bg-mint-50'
                  }`}
                  variant={tier.popular ? 'default' : 'outline'}
                  disabled={loading || isCurrentTier(tier.id)}
                  onClick={() => handlePurchase(tier)}
                >
                  {loading ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : null}
                  
                  {isCurrentTier(tier.id) 
                    ? 'Current Plan' 
                    : tier.id === 'free' 
                      ? 'Get Started' 
                      : `Upgrade to ${tier.name}`
                  }
                </Button>

                {isCurrentTier(tier.id) && (
                  <p className="text-center text-sm text-mint-600 font-medium">
                    ✓ Your current plan
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately 
                and you'll be charged or credited prorated amounts.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">What happens if I exceed my plan limits?</h3>
              <p className="text-muted-foreground">
                We'll notify you when you're approaching your limits. You can either upgrade your plan 
                or wait until the next billing cycle when your limits reset.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a setup fee?</h3>
              <p className="text-muted-foreground">
                No setup fees! All plans include everything you need to get started immediately.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel anytime from your account settings. You'll continue to have access 
                to paid features until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-mint-500 to-mint-600 text-white max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-mint-100 mb-6">
                Join thousands of creators who trust LazyMint for their digital content distribution.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
              >
                <Zap className="h-5 w-5 mr-2" />
                {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}