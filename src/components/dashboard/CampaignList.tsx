import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Campaign } from '@/stores/campaignStore';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Edit, 
  Pause, 
  Play, 
  Archive, 
  MoreHorizontal,
  Users,
  Calendar
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';

interface CampaignListProps {
  campaigns: Campaign[];
}

export function CampaignList({ campaigns }: CampaignListProps) {
  const navigate = useNavigate();

  const getStatusBadge = (status: Campaign['status']) => {
    const variants = {
      active: 'bg-mint-100 text-mint-800 dark:bg-mint-900/20 dark:text-mint-300',
      paused: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
    };

    return (
      <Badge variant="secondary" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="card-hover">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <CardTitle className="text-lg line-clamp-1">{campaign.title}</CardTitle>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {campaign.description}
                </p>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(campaign.status)}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate(`/campaigns/${campaign.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Campaign
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {campaign.status === 'active' ? (
                      <DropdownMenuItem>
                        <Pause className="mr-2 h-4 w-4" />
                        Pause Campaign
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem>
                        <Play className="mr-2 h-4 w-4" />
                        Resume Campaign
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive Campaign
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {campaign.assetUrl && (
              <div className="relative h-32 rounded-lg overflow-hidden bg-muted">
                <img
                  src={campaign.assetUrl}
                  alt={campaign.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{campaign.claimCount || 0} claims</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1"
                onClick={() => navigate(`/campaigns/${campaign.id}`)}
              >
                View Details
              </Button>
              <Button 
                size="sm" 
                className="flex-1 btn-mint"
                onClick={() => navigate(`/claim/${campaign.id}`)}
              >
                View Claim Page
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}