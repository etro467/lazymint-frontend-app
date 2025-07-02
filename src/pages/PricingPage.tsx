import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

import { Check, Crown, Zap } from 'lucide-react';
import { toast } from 'sonner';

export function PricingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const { 
    currentTier, 
    loading, 
    purchaseProduct, 
    initializeSubscription, 
    products
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
      return; // Free tier doesn't require a purchase
    }

    try {
      // Find the corresponding Stripe priceId for the selected tier
      const product = products.find(p => p.name === tier.name); // Assuming product name matches tier name
      if (!product || !product.default_price) {
        toast.error('Product not available. Please try again.');
        return;
      }
      const priceId = product.default_price;

      await purchaseProduct(priceId);
      toast.success(`Successfully initiated upgrade to ${tier.name}! Please complete the checkout.`);
    } catch (error: any) {
      toast.error(error.message || 'Purchase failed. Please try again.');
    }
  };

  const isCurrentTier = (tierId: string) => currentTier.id === tierId;

  return (
    <div className="min-h-screen bg-gradient-to-b from-mint-50/50 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Choose Your <span className="text-gradient">Plan</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Start free and scale as you grow. All plans include our core features 
            with advanced tools available on higher tiers.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {SUBSCRIPTION_TIERS.map((tier) => (
            <Card 
              key={tier.id} 
              className={`relative ${
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

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl">{tier.name}</CardTitle>
                <CardDescription className="text-sm">{tier.description}</CardDescription>
                
                <div className="py-3">
                  <div className="text-3xl font-bold">
                    {tier.price}
                    {tier.priceValue > 0 && (
                      <span className="text-base font-normal text-muted-foreground">/month</span>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                {/* Features */}
                <ul className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Check className="h-4 w-4 text-mint-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs">{feature}</span>
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
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-base font-semibold mb-1">Can I change plans anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately 
                and you'll be charged or credited prorated amounts.
              </p>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-1">What happens if I exceed my plan limits?</h3>
              <p className="text-sm text-muted-foreground">
                We'll notify you when you're approaching your limits. You can either upgrade your plan 
                or wait until the next billing cycle when your limits reset.
              </p>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-1">Is there a setup fee?</h3>
              <p className="text-sm text-muted-foreground">
                No setup fees! All plans include everything you need to get started immediately.
              </p>
            </div>
            
            <div>
              <h3 className="text-base font-semibold mb-1">Can I cancel my subscription?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can cancel anytime from your account settings. You'll continue to have access 
                to paid features until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-mint-500 to-mint-600 text-white max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-3">Ready to get started?</h3>
              <p className="text-mint-100 mb-5">
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