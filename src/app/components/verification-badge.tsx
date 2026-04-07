import { Shield, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface VerificationBadgeProps {
  isVerified: boolean;
  score: number;
  biStatus: 'pending' | 'verified' | 'rejected';
  propertyTitleStatus: 'pending' | 'verified' | 'rejected';
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function VerificationBadge({ isVerified, score, biStatus, propertyTitleStatus, size = 'sm', showTooltip = true }: VerificationBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const getBadgeConfig = () => {
    if (isVerified && score >= 80) {
      return {
        icon: ShieldCheck,
        label: 'Verificado',
        className: 'bg-green-100 text-green-700 border border-green-200',
      };
    }
    if (biStatus === 'verified' || propertyTitleStatus === 'verified') {
      return {
        icon: Shield,
        label: 'Em Verificação',
        className: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
      };
    }
    if (biStatus === 'rejected' || propertyTitleStatus === 'rejected') {
      return {
        icon: ShieldX,
        label: 'Não Verificado',
        className: 'bg-red-100 text-red-700 border border-red-200',
      };
    }
    return {
      icon: ShieldAlert,
      label: 'Pendente',
      className: 'bg-gray-100 text-gray-600 border border-gray-200',
    };
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const tooltipContent = (
    <div className="space-y-2 text-xs">
      <p className="font-semibold">Score de Verificação: {score}%</p>
      <div className="space-y-1">
        <p>BI: {biStatus === 'verified' ? 'Verificado' : biStatus === 'rejected' ? 'Rejeitado' : 'Pendente'}</p>
        <p>Título: {propertyTitleStatus === 'verified' ? 'Verificado' : propertyTitleStatus === 'rejected' ? 'Rejeitado' : 'Pendente'}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
        <div
          className={`h-1.5 rounded-full ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );

  const badge = (
    <span className={`inline-flex items-center font-medium rounded-full ${sizeClasses[size]} ${config.className}`}>
      <Icon className={iconSizes[size]} />
      {config.label}
    </span>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent side="top">{tooltipContent}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
