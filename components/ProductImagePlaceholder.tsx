'use client';

import React from 'react';
import { Package, ImageOff } from 'lucide-react';

interface ProductImagePlaceholderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'full';
  showText?: boolean;
  onClick?: () => void;
  title?: string;
}

export function ProductImagePlaceholder({
  className = '',
  size = 'full',
  showText = true,
  onClick,
  title,
}: ProductImagePlaceholderProps) {
  const isSmall = size === 'sm';

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center bg-neutral-100/90 text-neutral-400 select-none transition-colors ${
        onClick ? 'cursor-pointer hover:bg-neutral-200/80 group' : ''
      } ${className}`}
    >
      <div className="flex flex-col items-center justify-center p-3 text-center">
        <div className="flex items-center justify-center rounded-xl bg-white p-2.5 shadow-2xs border border-neutral-200/80 text-neutral-500 transition-transform group-hover:scale-105">
          {isSmall ? (
            <ImageOff className="h-4 w-4" />
          ) : (
            <Package className="h-6 w-6 stroke-[1.75]" />
          )}
        </div>

        {showText && !isSmall && (
          <div className="mt-2.5 space-y-0.5 max-w-[180px]">
            {title && (
              <p className="text-xs font-semibold text-neutral-700 truncate">
                {title}
              </p>
            )}
            <p className="text-[11px] text-neutral-400">
              فاقد تصویر اختصاصی
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
