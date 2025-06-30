import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCampaignStore } from '@/stores/campaignStore';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { LoadingState } from '@/components/ui/loading-spinner';
import { CampaignList } from '@/components/dashboard/CampaignList';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Plus } from 'lucide-react';

export function DashboardPage() {
  const { campaigns, loading, fetchCampaigns } = useCampaignStore();
  const { currentTier, initializeSubscription } = useSubscriptionStore();

  useEffect(() => {
    fetchCampaigns();
    initializeSubscription();
  }, [fetchCampaigns, initializeSubscription]);

  if (loading && campaigns.length === 0) {
    return (
      <LoadingState>
        Loading your dashboard...
      </LoadingState>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your campaigns and track performance
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Plan: </span>
            <span className="font-medium text-mint-600">{currentTier.name}</span>
          </div>
          <Button className="btn-mint">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview campaigns={campaigns} />

      {/* Quick Actions */}
      <QuickActions />

      {/* Campaign List */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Campaigns</h2>
          <Button variant="outline" size="sm">
            View All
          </Button>
        </div>
        
        {campaigns.length > 0 ? (
          <CampaignList campaigns={campaigns} />
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <div className="space-y-4">
                <div className="text-muted-foreground">
                  <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium">No campaigns yet</h3>
                  <p>Create your first campaign to start engaging with your fans</p>
                </div>
                <Button className="btn-mint">
                  Create Your First Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}