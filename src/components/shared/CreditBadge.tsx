'use client';

import { Sparkles } from 'lucide-react';

interface CreditBadgeProps {
  currentCredits?: number;
  totalCredits?: number;
  showProgress?: boolean;
  className?: string;
}

export function CreditBadge({
  currentCredits = 8,
  totalCredits = 10,
  showProgress = true,
  className = '',
}: CreditBadgeProps) {
  const percentage = Math.min(100, Math.max(0, (currentCredits / totalCredits) * 100));
  const isLow = percentage < 30;
  const isMedium = percentage >= 30 && percentage < 70;
  
  const getColorClass = () => {
    if (isLow) return 'bg-red-500';
    if (isMedium) return 'bg-amber-500';
    return 'bg-green-500';
  };

  const getTextColorClass = () => {
    if (isLow) return 'text-red-300';
    if (isMedium) return 'text-amber-300';
    return 'text-green-300';
  };

  const getBorderColorClass = () => {
    if (isLow) return 'border-red-500/30';
    if (isMedium) return 'border-amber-500/30';
    return 'border-green-500/30';
  };

  const getBgColorClass = () => {
    if (isLow) return 'bg-red-500/10';
    if (isMedium) return 'bg-amber-500/10';
    return 'bg-green-500/10';
  };

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div
        className={`flex items-center gap-2 px-3 py-2 border rounded-lg ${getBorderColorClass()} ${getBgColorClass()} ${getTextColorClass()}`}
      >
        <Sparkles className="w-4 h-4" />
        <span className="font-medium">Kredit: {currentCredits}/{totalCredits}</span>
      </div>
      
      {showProgress && (
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-xs text-slate-400">
            <span>Kredit Tersedia</span>
            <span>{currentCredits} / {totalCredits}</span>
          </div>
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getColorClass()} transition-all duration-300`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-xs">
            <span className={getTextColorClass()}>
              {isLow ? 'Kredit hampir habis' : isMedium ? 'Kredit mencukupi' : 'Kredit banyak'}
            </span>
            <span className="text-slate-500">
              {percentage.toFixed(0)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}