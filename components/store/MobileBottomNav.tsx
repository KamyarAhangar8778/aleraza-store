'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Home,
  LayoutGrid,
  Sparkles,
  ShoppingBag,
  User,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  X,
} from 'lucide-react';
import { UserAccount, toPersianDigits } from '@/lib/store-data';

interface MobileBottomNavProps {
  currentUser: UserAccount | null;
  totalCartCount: number;
  onOpenCart: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
}

/**
 * نوار ناوبری ثابت در پایین صفحه برای تجربه کاربری ارگونومیک با شست دست در موبایل
 * به همراه منوی باتم‌شیت کاربری حرفه‌ای هنگام کلیک روی دکمه حساب کاربری
 */
export function MobileBottomNav({
  currentUser,
  totalCartCount,
  onOpenCart,
  onOpenAuth,
  onLogout,
}: MobileBottomNavProps) {
  const [isProfileSheetOpen, setIsProfileSheetOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleUserClick = () => {
    if (currentUser) {
      setIsProfileSheetOpen(true);
    } else {
      onOpenAuth();
    }
  };

  return (
    <>
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

          {/* ۵. پروفایل / حساب کاربری / ورود */}
          <button
            type="button"
            onClick={handleUserClick}
            className={`relative flex flex-col items-center justify-center h-full min-h-[44px] min-w-[44px] active:scale-95 transition ${
              currentUser ? 'text-[#1F6E58]' : 'text-[#4A453F] hover:text-[#C85A32]'
            }`}
          >
            <div className="relative">
              <User className="w-5 h-5" />
              {currentUser && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#1F6E58] ring-2 ring-[#FAF7F2]" />
              )}
            </div>
            <span className="text-[10px] font-bold mt-1 truncate max-w-[50px]">
              {currentUser ? currentUser.fullName.split(' ')[0] : 'ورود'}
            </span>
          </button>
        </div>
      </nav>

      {/* باتم‌شیت حساب کاربری در موبایل */}
      {isProfileSheetOpen && currentUser && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm sm:hidden">
          <div className="relative w-full max-h-[85vh] rounded-t-3xl bg-[#FAF7F2] p-5 space-y-4 shadow-2xl border-t border-[#E6DFD3] animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-center pb-1">
              <div className="w-12 h-1.5 bg-[#DCD4C6] rounded-full" />
            </div>

            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1F6E58]/15 text-[#1F6E58] font-black text-lg">
                  {currentUser.fullName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#181615]">
                    {currentUser.fullName}
                  </h4>
                  <p className="text-[11px] text-[#6E675F] font-mono mt-0.5">
                    {currentUser.phone}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsProfileSheetOpen(false)}
                className="rounded-full bg-[#181615]/10 p-2 text-[#181615] hover:bg-[#181615]/20 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 rounded-xl bg-white border border-[#E6DFD3] p-3 text-xs font-bold text-[#1F6E58]">
                <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                <span>
                  {currentUser.role === 'admin' ? 'مدیر ارشد سیستم آلِرضا' : 'مشتری ویژه آلِرضا'}
                </span>
              </div>

              {currentUser.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setIsProfileSheetOpen(false)}
                  className="w-full flex items-center justify-between rounded-xl bg-[#2271b1] p-3 text-xs font-bold text-white shadow hover:bg-[#135e96] transition"
                >
                  <span className="inline-flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    ورود به پیشخوان مدیریت آلِرضا
                  </span>
                  <span>←</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsProfileSheetOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#D92D20]/10 border border-[#D92D20]/20 p-3 text-xs font-bold text-[#D92D20] hover:bg-[#D92D20]/20 transition"
              >
                <LogOut className="w-4 h-4" />
                خروج از حساب کاربری
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
