'use client';

import React from 'react';
import { ImageOff, Sparkles, Box } from 'lucide-react';

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
  const isMedium = size === 'md';

  return (
    <div
      onClick={onClick}
      className={`relative flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#1E1B18] via-[#2A2521] to-[#181615] text-[#FAF7F2] select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      {/* Precision Geometric SVG Background Pattern (Blueprint / Technical Grid) */}
      <svg
        className="absolute inset-0 h-full w-full opacity-20 transition-opacity duration-300 group-hover:opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="geometric-grid"
            width="28"
            height="28"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 28 0 L 0 0 0 28"
              fill="none"
              stroke="#C85A32"
              strokeWidth="0.75"
              strokeDasharray="2 3"
            />
            <circle cx="14" cy="14" r="1.5" fill="#E59872" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geometric-grid)" />
      </svg>

      {/* Decorative Geometric Concentric Circles & Axis */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <div className="w-48 h-48 rounded-full border border-dashed border-[#C85A32]/40 animate-[spin_60s_linear_infinite]" />
        <div className="w-32 h-32 rounded-full border border-[#E59872]/30 absolute" />
        <div className="w-16 h-16 rounded-full border border-[#C85A32]/50 absolute" />
      </div>

      {/* Center Geometric Emblem Badge */}
      <div className="relative z-10 flex flex-col items-center justify-center p-4 text-center">
        <div
          className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-b from-[#C85A32]/25 to-[#181615] border border-[#C85A32]/50 shadow-lg backdrop-blur-md transition-transform duration-300 group-hover:scale-110 ${
            isSmall ? 'h-9 w-9 p-1.5' : isMedium ? 'h-12 w-12 p-2.5' : 'h-16 w-16 p-3'
          }`}
        >
          {/* Geometric Diamond Accent */}
          <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rotate-45 bg-[#C85A32] shadow-xs" />
          <div className="absolute -bottom-1 -left-1 h-2.5 w-2.5 rotate-45 bg-[#E59872] shadow-xs" />

          {isSmall ? (
            <ImageOff className="h-4 w-4 text-[#E59872]" />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Box className="h-7 w-7 text-[#E59872] drop-shadow" />
              <span className="text-[9px] font-black text-[#FAF7F2] -mt-1 tracking-tighter">
                آلِرضا
              </span>
            </div>
          )}
        </div>

        {/* Text Details (for normal/large cards) */}
        {showText && !isSmall && (
          <div className="mt-3 space-y-1 max-w-[200px]">
            <div className="inline-flex items-center gap-1 rounded-full bg-[#181615]/80 border border-[#C85A32]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#E59872]">
              <Sparkles className="w-3 h-3 text-[#C85A32]" />
              <span>فاقد تصویر اختصاصی</span>
            </div>
            {title ? (
              <p className="text-xs font-extrabold text-[#FAF7F2] line-clamp-1 opacity-90">
                {title}
              </p>
            ) : null}
            <p className="text-[10px] text-[#A79E94] leading-tight">
              قطعه و لوازم جانبی اورجینال
            </p>
          </div>
        )}
      </div>

      {/* Subtle Bottom Technical ID Ribbon */}
      {!isSmall && (
        <div className="absolute bottom-2 inset-x-3 flex items-center justify-between text-[9px] font-mono text-[#8C837A] opacity-70 z-10">
          <span>ALERAZA ACCESSORIES</span>
          <span>NO_IMAGE_PLACEHOLDER</span>
        </div>
      )}
    </div>
  );
}
