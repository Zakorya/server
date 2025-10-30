import { Badge } from '@/components/ui/badge';
import { Clock, Truck, CheckCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
  size?: 'sm' | 'default';
}

export function OrderStatusBadge({ status, size = 'default' }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'قيد التحضير':
        return {
          icon: Clock,
          className: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400',
          label: 'قيد التحضير',
        };
      case 'قيد التوصيل':
        return {
          icon: Truck,
          className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400',
          label: 'قيد التوصيل',
        };
      case 'تم التوصيل':
        return {
          icon: CheckCircle,
          className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400',
          label: 'تم التوصيل',
        };
      default:
        return {
          icon: Clock,
          className: 'bg-muted text-muted-foreground',
          label: status,
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`gap-1.5 ${config.className} ${size === 'sm' ? 'text-xs px-2 py-0.5' : ''}`}
      data-testid="badge-order-status"
    >
      <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'} />
      {config.label}
    </Badge>
  );
}
