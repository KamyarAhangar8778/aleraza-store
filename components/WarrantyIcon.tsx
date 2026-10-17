'use client';

import React from 'react';
import {
  ShieldCheck,
  BadgeCheck,
  Award,
  Sparkles,
  Check,
  Clock,
  Shield,
} from 'lucide-react';

interface WarrantyIconProps {
  iconName?: string;
  className?: string;
}

/**
 * رندر آیکون انتخابی ضمانت کالا با فال‌بک پیش‌فرض به ShieldCheck
 */
export function WarrantyIcon({ iconName, className = 'w-3 h-3' }: WarrantyIconProps) {
  switch (iconName) {
    case 'BadgeCheck':
      return <BadgeCheck className={className} />;
    case 'Award':
      return <Award className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    case 'Check':
      return <Check className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'Shield':
      return <Shield className={className} />;
    case 'ShieldCheck':
    default:
      return <ShieldCheck className={className} />;
  }
}
