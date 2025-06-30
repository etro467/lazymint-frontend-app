import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useSubscriptionStore } from '@/stores/subscriptionStore';
import { 
  Plus, 
  Sparkles, 
  Palette, 
  QrCode, 
  BarChart3, 
  Download,
  Crown
} from 'lucide-react';

export function QuickActions() {
  const navigate = useNavigate();
  const { hasFeature, currentTier } = useSubscriptionStore();

  const actions = [
    {
      title: 'Create Campaign',
      description: 'Start a new digital content campaign',
      icon: Plus,
      action: () => navigate('/campaigns/new'),
      available: true,
    },
    {
      title: 'AI Content Generation',
      description: 'Generate campaign content with AI',
      icon: Sparkles,
      action: () => navigate('/ai/content'),
      available: hasFeature('ai_generation'),
      premium: !hasFeature('ai_generation'),
    },
    {
      title: 'Create QR Codes',
      description: 'Generate artistic QR codes',
      icon: QrCode,
      action: () => navigate('/ai/qr-codes'),
      available: hasFeature('ai_generation'),
      premium: !hasFeature('ai_generation'),
    },
    {
      title: 'Design Backgrounds',
      description: 'Create custom ticket backgrounds',
      icon: Palette,
      action: () => navigate('/ai/backgrounds'),
      available: hasFeature('ai_generation'),
      premium: !hasFeature('ai_generation'),
    },
    {
      title: 'Analytics',
      description: 'View detailed campaign analytics',
      icon: BarChart3,
      action: () => navigate('/analytics'),
      available: true,
    },
    {
      title: 'Export Data',
      description: 'Download campaign data as CSV',
      icon: Download,
      action: () => navigate('/exports'),
      available: currentTier.name !== 'Free',
      premium: currentTier.name === 'Free',
    },
  ];

  const handlePremiumAction = () => {
    navigate('/pricing');
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Quick Actions</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Card 
            key={index} 
            className={`card-hover cursor-pointer ${!action.available ? 'opacity-60' : ''}`}
            onClick={action.available ? action.action : handlePremiumAction}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <action.icon className={`h-6 w-6 ${action.available ? 'text-mint-500' : 'text-muted-foreground'}`} />
                {action.premium && (
                  <Crown className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <CardTitle className="text-base">{action.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm">
                {action.description}
                {action.premium && (
                  <span className="block text-yellow-600 font-medium mt-1">
                    Upgrade required
                  </span>
                )}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}