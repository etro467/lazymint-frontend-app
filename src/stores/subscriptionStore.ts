import { create } from 'zustand';
import { revenueCatService, SubscriptionTier, SUBSCRIPTION_TIERS, PurchasePackage } from '@/config/revenuecat';

interface SubscriptionState {
  currentTier: SubscriptionTier;
  customerInfo: any;
  loading: boolean;
  error: string | null;
  packages: PurchasePackage[];
  
  // Actions
  initializeSubscription: () => Promise<void>;
  refreshCustomerInfo: () => Promise<void>;
  purchasePackage: (packageToPurchase: PurchasePackage) => Promise<void>;
  restorePurchases: () => Promise<void>;
  hasFeature: (feature: string) => boolean;
  clearError: () => void;
}

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  currentTier: SUBSCRIPTION_TIERS[0], // Start with free tier
  customerInfo: null,
  loading: false,
  error: null,
  packages: [],

  initializeSubscription: async () => {
    set({ loading: true, error: null });
    try {
      await revenueCatService.initialize();
      const customerInfo = await revenueCatService.getCustomerInfo();
      const offerings = await revenueCatService.getOfferings();
      const currentTier = revenueCatService.getUserTier(customerInfo);
      
      set({
        customerInfo,
        currentTier,
        packages: offerings.current?.availablePackages || [],
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  refreshCustomerInfo: async () => {
    set({ loading: true });
    try {
      const customerInfo = await revenueCatService.getCustomerInfo();
      const currentTier = revenueCatService.getUserTier(customerInfo);
      
      set({
        customerInfo,
        currentTier,
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  purchasePackage: async (packageToPurchase: PurchasePackage) => {
    set({ loading: true, error: null });
    try {
      const result = await revenueCatService.purchasePackage(packageToPurchase);
      const currentTier = revenueCatService.getUserTier(result.customerInfo);
      
      set({
        customerInfo: result.customerInfo,
        currentTier,
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  restorePurchases: async () => {
    set({ loading: true, error: null });
    try {
      const customerInfo = await revenueCatService.restorePurchases();
      const currentTier = revenueCatService.getUserTier(customerInfo);
      
      set({
        customerInfo,
        currentTier,
        loading: false
      });
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  hasFeature: (feature: string) => {
    const { currentTier, customerInfo } = get();
    
    // Check by tier entitlements
    if (currentTier.entitlements.includes(feature)) {
      return true;
    }
    
    // Check by RevenueCat entitlements
    return revenueCatService.hasEntitlement(customerInfo, feature);
  },

  clearError: () => set({ error: null }),
}));