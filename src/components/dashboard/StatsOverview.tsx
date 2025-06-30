import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Campaign } from '@/stores/campaignStore';
import { TrendingUp, Users, Target, Eye } from 'lucide-react';

interface StatsOverviewProps {
  campaigns: Campaign[];
}

export function StatsOverview({ campaigns }: StatsOverviewProps) {
  const stats = React.useMemo(() => {
    const totalCampaigns = campaigns.length;
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalClaims = campaigns.reduce((sum, c) => sum + (c.claimCount || 0), 0);
    const avgClaims = totalCampaigns > 0 ? Math.round(totalClaims / totalCampaigns) : 0;

    return [
      {
        title: 'Total Campaigns',
        value: totalCampaigns,
        icon: Target,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100 dark:bg-blue-900/20',
      },
      {
        title: 'Active Campaigns',
        value: activeCampaigns,
        icon: TrendingUp,
        color: 'text-mint-600',
        bgColor: 'bg-mint-100 dark:bg-mint-900/20',
      },
      {
        title: 'Total Claims',
        value: totalClaims,
        icon: Users,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100 dark:bg-purple-900/20',
      },
      {
        title: 'Avg Claims/Campaign',
        value: avgClaims,
        icon: Eye,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100 dark:bg-orange-900/20',
      },
    ];
  }, [campaigns]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value.toLocaleString()}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}