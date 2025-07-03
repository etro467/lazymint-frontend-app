import { create } from 'zustand';
import { getStripe } from '@/config/stripe';
import { Stripe } from '@stripe/stripe-js';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/config/firebase';

interface SubscriptionTier {
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

interface SubscriptionState {
  currentTier: SubscriptionTier;
  loading: boolean;
  error: string | null;
  stripeClient: Stripe | null;
  products: any[]; // Define a proper type for products later

  // Actions
  initializeSubscription: () => Promise<void>;
  refreshSubscriptionStatus: () => Promise<void>;
  purchaseProduct: (priceId: string) => Promise<void>;
  hasFeature: (feature: string) => boolean;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  currentTier: SUBSCRIPTION_TIERS[0], // Start with free tier
  loading: false,
  error: null,
  stripeClient: null,
  products: [],

  initializeSubscription: async () => {
    set({ loading: true, error: null });
    try {
      const stripe = await getStripe();
      set({ stripeClient: stripe });

      // Fetch products/prices from your Firebase backend
      const getProductsCallable = httpsCallable(functions, 'getStripeProducts');
      const result = await getProductsCallable();
      const products = result.data as any[]; // Assuming your function returns an array of products/prices

      set({
        products,
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  refreshSubscriptionStatus: async () => {
    set({ loading: true });
    try {
      // In a real Stripe integration, you'd likely fetch the user's subscription status
      // from your backend (e.g., a Firebase Cloud Function that queries Stripe).
      // For now, we'll assume the user is on the free tier unless a purchase is made.
      // You'll need to implement the logic to determine the actual current tier based on Stripe data.
      const currentTier = SUBSCRIPTION_TIERS[0]; // Placeholder: Implement actual logic to determine tier
      
      set({
        currentTier,
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  purchaseProduct: async (priceId: string) => {
    set({ loading: true, error: null });
    try {
      const { stripeClient } = get();
      if (!stripeClient) {
        throw new Error("Stripe.js not loaded.");
      }

      // Call your Firebase Cloud Function to create a Stripe Checkout Session
      const createCheckoutSessionCallable = httpsCallable(functions, 'createStripeCheckoutSession');
      const result = await createCheckoutSessionCallable({ priceId });
      const sessionId = (result.data as any).id;

      if (!sessionId) {
        throw new Error("Failed to create checkout session.");
      }

      const { error } = await stripeClient.redirectToCheckout({ sessionId });

      if (error) {
        throw new Error(error.message || "Stripe checkout failed.");
      }

      // After successful checkout, refresh subscription status
      await get().refreshSubscriptionStatus();

      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  hasFeature: (feature: string) => {
    const { currentTier } = get();
    return currentTier.entitlements.includes(feature);
  },

  clearError: () => set({ error: null }),
}));