'use client';

import React from 'react';

interface TomanProps {
  className?: string;
  size?: number | string;
  variant?: 'standard' | 'icon-only' | 'text-only' | 'badge';
}

/**
 * Authentic Iranian E-Commerce Toman Currency Symbol (نماد تومان استاندارد فروشگاه‌های ایرانی)
 * Precise vector path matching standard Iranian e-commerce platforms (Digikala, Snapp, Torob).
 */
export function TomanIcon({
  className = 'w-3.5 h-3.5',
  size,
}: {
  className?: string;
  size?: number | string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="تومان"
      className={`inline-block shrink-0 align-middle ${className}`}
      style={size ? { width: size, height: size } : undefined}
    >
      <title>تومان</title>
      {/* Precision Iranian E-Commerce Toman Glyph */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.25 4.5a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zm-3.5 0a1.25 1.25 0 1 1-2.5 0 1.25 1.25 0 0 1 2.5 0zM19 7.75a.75.75 0 0 1 .75.75v3.25c0 1.944-.766 3.73-2.128 5.06A8.25 8.25 0 0 1 11.75 19.25c-2.28 0-4.343-.925-5.834-2.416A8.25 8.25 0 0 1 3.5 11c0-1.895.638-3.64 1.714-5.032a.75.75 0 1 1 1.182.924A6.75 6.75 0 0 0 5 11c0 1.864.756 3.551 1.975 4.77A6.75 6.75 0 0 0 11.75 17.75c1.864 0 3.551-.756 4.77-1.975A6.75 6.75 0 0 0 18.5 11V8.5a.75.75 0 0 1 .75-.75h-.25zm-6 3a.75.75 0 0 1 .75.75v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 .75-.75zm-3.5.75a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0v-1.5z"
      />
    </svg>
  );
}

/**
 * Standard Persian Toman Currency Component for Pricing
 * Styled identically to leading Iranian marketplaces (دیجی‌کالا، اسنپ‌شاپ، ترب)
 * Clean, lightweight, professional typography with perfect baseline alignment.
 */
export function Toman({
  className = 'text-[11px] text-[#6E675F] font-normal',
  variant = 'standard',
}: TomanProps) {
  if (variant === 'icon-only') {
    return <TomanIcon className="w-3.5 h-3.5 text-current opacity-80" />;
  }

  if (variant === 'badge') {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#716A62] select-none">
        <TomanIcon className="w-3 h-3 text-[#C85A32]" />
        <span>تومان</span>
      </span>
    );
  }

  if (variant === 'text-only') {
    return (
      <span className={`inline-block select-none tracking-tight font-medium ${className}`}>
        تومان
      </span>
    );
  }

  // Standard clean Iranian e-commerce layout: subtle typography with integrated authentic Toman symbol
  return (
    <span className={`inline-flex items-center gap-1 select-none font-medium ${className}`}>
      <span>تومان</span>
      <TomanIcon className="w-3 h-3 opacity-75 inline-block -mt-0.5" />
    </span>
  );
}

export default Toman;
