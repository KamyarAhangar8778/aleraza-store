'use client';

import React from 'react';
import { MessageSquareText, CheckCircle2, X } from 'lucide-react';

interface ToastBannerProps {
  message: string | null;
  onClose: () => void;
}

/**
 * بنر و توست پیامکی سراسری برای تأیید آنی ذخیره، ویرایش و حذف در پیشخوان و فروشگاه
 */
export function ToastBanner({ message, onClose }: ToastBannerProps) {
  if (!message) return null;

  return (
    <div
      dir="rtl"
      role="status"
      aria-live="polite"
      className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-[9999] w-[92%] sm:w-auto max-w-lg animate-in fade-in slide-in-from-top-4 duration-300"
    >
      <div className="flex items-center gap-3.5 rounded-2xl bg-[#181615]/95 text-[#FAF7F2] p-3.5 sm:px-5 sm:py-4 shadow-2xl border-2 border-[#00a32a] backdrop-blur-md ring-4 ring-[#00a32a]/20">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#00a32a]/25 text-[#00a32a]">
          <MessageSquareText className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a32a] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#00a32a]" />
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-extrabold text-[#00a32a] tracking-wider mb-0.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>پیامک تأیید سیستم • ذخیره‌سازی ابری</span>
          </div>
          <p className="text-xs sm:text-sm font-bold text-white leading-snug break-words">
            {message}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="بستن پیام"
          className="rounded-lg p-1.5 text-[#c3c4c7] hover:bg-white/10 hover:text-white transition cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
