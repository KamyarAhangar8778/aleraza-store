'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  User,
  Sparkles,
  PhoneCall,
  LayoutDashboard,
  LogOut,
  BadgePercent,
} from 'lucide-react';
import { UserAccount, toPersianDigits } from '@/lib/store-data';

interface StoreHeaderProps {
  currentUser: UserAccount | null;
  totalCartCount: number;
  onOpenAuth: () => void;
  onOpenCart: () => void;
  onLogout: () => void;
}

/**
 * هدر جامع فروشگاه شامل نوار اعلان بالا، نوار مدیریت وردپرس (برای ادمین) و هدر چسبان اصلی
 */
export function StoreHeader({
  currentUser,
  totalCartCount,
  onOpenAuth,
  onOpenCart,
  onLogout,
}: StoreHeaderProps) {
  return (
    <>
      {/* نوار مدیریت وردپرس برای مدیر سیستم */}
      {currentUser?.role === 'admin' && (
        <div className="bg-[#1d2327] text-[#f0f0f1] px-4 h-9 flex items-center justify-between text-xs border-b border-black">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 font-bold text-white hover:text-[#72aee6] transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#72aee6]" />
              <span>پیشخوان مدیریت آلِرضا (WordPress Panel)</span>
            </Link>
            <Link
              href="/admin"
              className="hidden sm:inline-block text-[#c3c4c7] hover:text-white transition"
            >
              + افزودن محصول / تغییر قیمت‌ها / مدیریت کاروسل
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#c3c4c7] hidden sm:inline">
              مدیر فعال: <strong className="text-white">{currentUser.fullName}</strong>
            </span>
            <Link
              href="/admin"
              className="rounded bg-[#2271b1] px-2.5 py-0.5 text-[11px] font-bold text-white hover:bg-[#135e96] transition"
            >
              ورود به پیشخوان ←
            </Link>
          </div>
        </div>
      )}

      {/* نوار اعلان تخفیف‌ها و تماس در بالای صفحه */}
      <div className="bg-[#181615] text-[#FAF7F2] px-3 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="inline-flex items-center gap-1 rounded bg-[#D92D20] px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-white shrink-0">
              <Sparkles className="w-3 h-3" />
              جشنواره قطعات
            </span>
            <span className="text-[#E6DFD3] truncate text-[11px] sm:text-xs">
              تخفیف‌های ویژه لوازم جانبی و فیلترهای اورجینال با ضمانت اصالت
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#B8AFA6] shrink-0">
            <span className="inline-flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-[#C85A32]" />
              ۰۲۱-۸۸۹۹۴۴۰۰
            </span>
          </div>
        </div>
      </div>

      {/* هدر چسبان اصلی برند (فشرده در موبایل، ۵۶ پیکسل تا ۸۰ پیکسل) */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E6DFD3]">
        <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-2 sm:gap-4">
          {/* لوگو و نام برند */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#181615] text-[#FAF7F2] shadow-sm border border-[#C85A32]/40">
              <span className="text-lg sm:text-2xl font-black text-[#C85A32]">آ</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-[#181615]">
                  آلِرضا
                </h1>
                <span className="hidden sm:inline-block rounded-md bg-[#C85A32]/15 px-2 py-0.5 text-[10px] font-extrabold text-[#C85A32]">
                  ALERAZA ACCESSORIES
                </span>
              </div>
              <p className="text-[11px] text-[#6E675F] hidden md:block">
                مرجع تخصصی لوازم جانبی، فیلترها و قطعات اورجینال لوازم خانگی
              </p>
            </div>
          </div>

          {/* منوی ناوبری میانی */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-[#4A453F]">
            <a
              href="#discounted-grid"
              className="inline-flex items-center gap-1.5 text-[#D92D20] hover:opacity-80 transition"
            >
              <BadgePercent className="w-4 h-4" />
              پیشنهادهای تخفیف‌دار اول صفحه
            </a>
            <a
              href="#categories-section"
              className="hover:text-[#C85A32] transition"
            >
              دسته‌بندی لوازم جانبی
            </a>
            <a
              href="#all-products"
              className="hover:text-[#C85A32] transition"
            >
              کاتالوگ لوازم جانبی و قطعات
            </a>
            <a
              href="#why-aleraza"
              className="hover:text-[#C85A32] transition"
            >
              ضمانت اصالت آلِرضا
            </a>
          </nav>

          {/* دکمه‌های کنترلی سمت راست (پیشخوان، ورود کاربر، سبد خرید) */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <Link
              href="/admin"
              title="پیشخوان مدیریت"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1d2327] p-2 sm:px-3.5 sm:py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#2271b1] transition"
            >
              <LayoutDashboard className="w-4 h-4 text-[#72aee6]" />
              <span className="hidden sm:inline">پیشخوان مدیریت</span>
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-[#DCD4C6] p-1.5 sm:px-3 sm:py-2">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-extrabold text-[#181615] leading-none">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[10px] text-[#1F6E58] font-bold mt-0.5">
                    {currentUser.role === 'admin' ? 'مدیر سیستم' : 'مشتری آلِرضا'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onLogout}
                  title="خروج از حساب"
                  className="rounded-lg p-1.5 text-[#8C837A] hover:bg-[#D92D20]/10 hover:text-[#D92D20] transition min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                title="ورود یا ثبت‌نام"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#DCD4C6] p-2 sm:px-3.5 sm:py-2.5 text-xs font-bold text-[#181615] hover:border-[#C85A32] transition cursor-pointer min-h-[36px] min-w-[36px] justify-center"
              >
                <User className="w-4 h-4 text-[#C85A32]" />
                <span className="hidden sm:inline">ورود / ثبت‌نام</span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenCart}
              title="سبد خرید"
              className="relative inline-flex items-center gap-1.5 rounded-xl bg-[#C85A32] p-2 sm:px-3.5 sm:py-2.5 text-xs font-bold text-white hover:bg-[#B04B25] transition cursor-pointer min-h-[36px] min-w-[36px] justify-center"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">سبد خرید</span>
              {totalCartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#181615] px-1 text-[10px] sm:text-[11px] font-extrabold text-white">
                  {toPersianDigits(totalCartCount)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
