export interface PurchasePackage {
  identifier: string;
  product: {
    identifier: string;
    title: string;
    description: string;
    priceString: string;
    price: number;
    currencyCode: string;
  };
}

export interface SubscriptionTier {
  id: string;
  name: string;
  description: string;
  price: string;
  priceValue: number;
  features: string[];
  popular?: boolean;
  entitlements: string[];
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Perfect for getting started',
    price: '$0',
    priceValue: 0,
    features: [
      '1 Active Campaign',
      'Basic Analytics',
      '100 Claims per month',
      'Standard Support'
    ],
    entitlements: []
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Great for growing creators',
    price: '$9.99',
    priceValue: 9.99,
    features: [
      '5 Active Campaigns',
      'Advanced Analytics',
      '1,000 Claims per month',
      'AI Content Generation',
      'Priority Support'
    ],
    popular: true,
    entitlements: ['basic_features', 'ai_generation']
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'For professional creators',
    price: '$29.99',
    priceValue: 29.99,
    features: [
      'Unlimited Campaigns',
      'Advanced Analytics & Insights',
      'Unlimited Claims',
      'AI Content Generation',
      'Artistic QR Codes',
      'Algorand Blockchain Logging',
      'CSV Export',
      'Premium Support'
    ],
    entitlements: ['basic_features', 'ai_generation', 'blockchain_logging', 'unlimited_campaigns']
  }
];

class RevenueCatService {
  private isDemo = true; // Force demo mode

  async initialize() {
    try {
      // All RevenueCat SDK calls are commented out to force demo mode
      // const apiKey = import.meta.env.VITE_REVENUECAT_API_KEY;
      // const appUserID = auth.currentUser?.uid || 'anonymous_user';
      
      // if (!apiKey || apiKey === 'demo-key') {
      //   console.warn('RevenueCat API key not configured, running in demo mode');
      //   this.isDemo = true;
      //   this.initialized = true;
      //   return;
      // }

      // await Purchases.configure(apiKey, appUserID);
      
      // this.initialized = true;
      console.log('RevenueCat initialized successfully in demo mode');
    } catch (error) {
      console.error('Failed to initialize RevenueCat:', error);
      this.isDemo = true;
      // this.initialized = true;
    }
  }

  async getCustomerInfo() {
    if (this.isDemo) {
      return {
        entitlements: {
          active: {}
        },
        originalPurchaseDate: null,
        activeSubscriptions: []
      };
    }

    try {
      // return await Purchases.getCustomerInfo();
      return { entitlements: { active: {} } }; // Mocked response
    } catch (error) {
      console.error('Failed to get customer info:', error);
      return {
        entitlements: {
          active: {}
        },
        originalPurchaseDate: null,
        activeSubscriptions: []
      };
    }
  }

  async getOfferings() {
    if (this.isDemo) {
      return {
        current: {
          availablePackages: SUBSCRIPTION_TIERS.slice(1).map(tier => ({
            identifier: tier.id,
            product: {
              identifier: tier.id,
              title: tier.name,
              description: tier.description,
              priceString: tier.price,
              price: tier.priceValue,
              currencyCode: 'USD'
            }
          }))
        }
      };
    }

    try {
      // return await Purchases.getOfferings();
      return { current: { availablePackages: [] } }; // Mocked response
    } catch (error) {
      console.error('Failed to get offerings:', error);
      return { current: { availablePackages: [] } };
    }
  }

  async purchasePackage(packageToPurchase: PurchasePackage) {
    if (this.isDemo) {
      console.log('Demo mode: Simulating purchase for', packageToPurchase.identifier);
      return {
        customerInfo: {
          entitlements: {
            active: {
              [packageToPurchase.identifier]: { isActive: true }
            }
          }
        }
      };
    }

    try {
      // return await Purchases.purchasePackage(packageToPurchase);
      return { customerInfo: { entitlements: { active: {} } } }; // Mocked response
    } catch (error) {
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async restorePurchases() {
    if (this.isDemo) {
      return {
        entitlements: {
          active: {}
        }
      };
    }

    try {
      // return await Purchases.restorePurchases();
      return { entitlements: { active: {} } }; // Mocked response
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  getUserTier(customerInfo: any): SubscriptionTier {
    if (this.isDemo || !customerInfo?.entitlements?.active) {
      return SUBSCRIPTION_TIERS[0]; // Free tier
    }

    const activeEntitlements = Object.keys(customerInfo.entitlements.active);
    
    if (activeEntitlements.includes('unlimited_campaigns')) {
      return SUBSCRIPTION_TIERS[2]; // Pro
    } else if (activeEntitlements.includes('basic_features')) {
      return SUBSCRIPTION_TIERS[1]; // Basic
    }
    
    return SUBSCRIPTION_TIERS[0]; // Free
  }

  hasEntitlement(customerInfo: any, entitlement: string): boolean {
    if (this.isDemo) {
      return false;
    }
    
    return customerInfo?.entitlements?.active?.[entitlement]?.isActive || false;
  }
}

export const revenueCatService = new RevenueCatService();