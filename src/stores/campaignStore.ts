import { create } from 'zustand';
import { httpsCallable } from 'firebase/functions';
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, functions } from '@/config/firebase';
import { useAuthStore } from './authStore';

export interface Campaign {
  id: string;
  title: string;
  description: string;
  creatorId: string;
  status: 'active' | 'paused' | 'archived';
  createdAt: string;
  updatedAt: string;
  claimCount: number;
  maxClaims?: number;
  assetUrl?: string;
  qrCodeUrl?: string;
  backgroundUrl?: string;
  algorandTxId?: string;
}

export interface CampaignAnalytics {
  totalViews: number;
  totalClaims: number;
  conversionRate: number;
  topSources: { source: string; count: number }[];
  dailyStats: { date: string; views: number; claims: number }[];
}

interface CampaignState {
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  analytics: CampaignAnalytics | null;
  loading: boolean;
  error: string | null;
  
  // Actions
  fetchCampaigns: () => Promise<void>;
  createCampaign: (campaignData: Partial<Campaign>) => Promise<void>;
  updateCampaign: (id: string, updates: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
  pauseCampaign: (id: string) => Promise<void>;
  archiveCampaign: (id: string) => Promise<void>;
  fetchAnalytics: (campaignId: string) => Promise<void>;
  generateContent: (prompt: string) => Promise<string>;
  generateBackground: (style: string) => Promise<string>;
  generateQrCode: (campaignId: string, style: string) => Promise<string>;
  logToAlgorand: (campaignId: string) => Promise<string>;
  exportEmails: (campaignId: string) => Promise<void>;
  clearError: () => void;
}

export const useCampaignStore = create<CampaignState>((set, get) => ({
  campaigns: [],
  currentCampaign: null,
  analytics: null,
  loading: false,
  error: null,

  fetchCampaigns: async () => {
    set({ loading: true, error: null });
    try {
      const userId = useAuthStore.getState().user?.uid;
      if (!userId) {
        throw new Error("User not authenticated.");
      }
      const q = query(collection(db, "campaigns"), where("creatorId", "==", userId));
      const querySnapshot = await getDocs(q);
      const campaigns: Campaign[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as Omit<Campaign, 'id'>
      }));
      set({ campaigns, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createCampaign: async (campaignData: Partial<Campaign>) => {
    set({ loading: true, error: null });
    try {
      const createCampaignCallable = httpsCallable(functions, 'createCampaign');
      const result = await createCampaignCallable(campaignData);
      const newCampaignId = (result.data as any).campaignId;
      
      // Fetch the newly created campaign to get all its fields including server timestamps
      const newCampaignRef = doc(db, "campaigns", newCampaignId);
      const newCampaignSnap = await getDoc(newCampaignRef);
      
      if (!newCampaignSnap.exists()) {
        throw new Error("Newly created campaign not found.");
      }
      const newCampaign = { id: newCampaignSnap.id, ...newCampaignSnap.data() } as Campaign;

      set((state) => ({
        campaigns: [newCampaign, ...state.campaigns],
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  updateCampaign: async (id: string, updates: Partial<Campaign>) => {
    set({ loading: true, error: null });
    try {
      const campaignRef = doc(db, "campaigns", id);
      await updateDoc(campaignRef, { ...updates, updatedAt: serverTimestamp() });
      set((state) => ({
        campaigns: state.campaigns.map(campaign =>
          campaign.id === id ? { ...campaign, ...updates, updatedAt: new Date().toISOString() } : campaign // Optimistic update, timestamp will be corrected on re-fetch
        ),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  deleteCampaign: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteDoc(doc(db, "campaigns", id));
      set((state) => ({
        campaigns: state.campaigns.filter(campaign => campaign.id !== id),
        loading: false
      }));
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  pauseCampaign: async (id: string) => {
    await get().updateCampaign(id, { status: 'paused' });
  },

  archiveCampaign: async (id: string) => {
    await get().updateCampaign(id, { status: 'archived' });
  },

  fetchAnalytics: async (campaignId: string) => {
    set({ loading: true, error: null });
    try {
      const getCampaignAnalyticsCallable = httpsCallable(functions, 'getCampaignAnalytics');
      const result = await getCampaignAnalyticsCallable({ campaignId });
      set({ analytics: result.data as CampaignAnalytics, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  generateContent: async (prompt: string) => {
    set({ loading: true, error: null });
    try {
      const generateCampaignContentCallable = httpsCallable(functions, 'generateCampaignContent');
      const result = await generateCampaignContentCallable({ campaignTheme: prompt });
      set({ loading: false });
      return (result.data as any).title + ". " + (result.data as any).description + ". " + (result.data as any).message;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  generateBackground: async (style: string) => {
    set({ loading: true, error: null });
    try {
      const generateTicketBackgroundCallable = httpsCallable(functions, 'generateTicketBackground');
      const result = await generateTicketBackgroundCallable({ prompt: style });
      set({ loading: false });
      return (result.data as any).backgroundUrl;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  generateQrCode: async (campaignId: string, style: string) => {
    set({ loading: true, error: null });
    try {
      const generateArtisticQrCallable = httpsCallable(functions, 'generateArtisticQr');
      const result = await generateArtisticQrCallable({ campaignId, styleMode: 'prompt', stylePrompt: style });
      set({ loading: false });
      return (result.data as any).qrCodeUrl;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  logToAlgorand: async (campaignId: string) => {
    set({ loading: true, error: null });
    try {
      const logCampaignToAlgorandCallable = httpsCallable(functions, 'logCampaignToAlgorand');
      const result = await logCampaignToAlgorandCallable({ campaignId });
      const txId = (result.data as any).algorandTransactionId;
      
      // Update campaign with Algorand transaction ID
      await get().updateCampaign(campaignId, { algorandTxId: txId });
      
      set({ loading: false });
      return txId;
    } catch (error: any) {
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  exportEmails: async (campaignId: string) => {
    set({ loading: true, error: null });
    try {
      // Assuming you have an exportEmails Cloud Function that returns a downloadable URL or CSV content
      // For now, we'll simulate a direct download
      const exportEmailsCallable = httpsCallable(functions, 'exportEmails'); // You'd need to create this function
      const result = await exportEmailsCallable({ campaignId });
      const csvContent = (result.data as any).csvContent; // Assuming the function returns CSV content

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `campaign_${campaignId}_emails.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      set({ loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));