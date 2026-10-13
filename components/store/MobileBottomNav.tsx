'use client';

import React from 'react';
import {
  Home,
  LayoutGrid,
  Sparkles,
  ShoppingBag,
  User,
  LayoutDashboard,
} from 'lucide-react';
import { UserAccount, toPersianDigits } from '@/lib/store-data';

interface MobileBottomNavProps {
  currentUser: UserAccount | null;
  totalCartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
}

/**
 * نوار ناوبری ثابت در پایین صفحه برای تجربه کاربری ارگونومیک با شست دست در موبایل
 * این کامپوننت فقط در نمایشگرهای موبایل (زیر breakpoint sm) نمایش داده می‌شود.
 */
export function MobileBottomNav({
  currentUser,
  totalCartCount,
  onOpenCart,
  onOpenAuth,
}: MobileBottomNavProps) {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="ناوبری اصلی موبایل"
      className="fixed bottom-0 inset-x-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-lg border-t border-[#E6DFD3] shadow-[0_-4px_20px_rgba(24,22,21,0.06)] sm:hidden"
    >
      <div className="grid grid-cols-5 h-16 items-center px-1">
        {/* ۱. صفحه اصلی */}
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-[#4A453F] hover:text-[#C85A32] active:scale-95 transition"
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">خانه</span>
        </button>

        {/* ۲. دسته‌بندی‌ها */}
        <button
          type="button"
          onClick={() => scrollToSection('categories-section')}
          className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-[#4A453F] hover:text-[#C85A32] active:scale-95 transition"
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">دسته‌ها</span>
        </button>

        {/* ۳. پیشنهادهای شگفت‌انگیز */}
        <button
          type="button"
          onClick={() => scrollToSection('discounted-grid')}
          className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-[#D92D20] active:scale-95 transition"
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold mt-1">تخفیف‌ها</span>
        </button>

        {/* ۴. سبد خرید همراه با نشانگر زنده تعداد */}
        <button
          type="button"
          onClick={onOpenCart}
          className="relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-[#4A453F] hover:text-[#C85A32] active:scale-95 transition"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1.5 -left-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#C85A32] px-1 text-[9px] font-black text-white shadow-xs">
                {toPersianDigits(totalCartCount)}
              </span>
            )}
          </div>
          <span className="text-[10px] font-bold mt-1">سبد خرید</span>
        </button>

        {/* ۵. ورود / حساب کاربری یا پیشخوان ادمین */}
        {currentUser?.role === 'admin' ? (
          <a
            href="/admin"
            className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-[#2271b1] active:scale-95 transition"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">پیشخوان</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onOpenAuth}
            className="flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] text-[#4A453F] hover:text-[#C85A32] active:scale-95 transition"
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold mt-1">
              {currentUser ? 'پروفایل' : 'ورود'}
            </span>
          </button>
        )}
      </div>
    </nav>
  );
}
