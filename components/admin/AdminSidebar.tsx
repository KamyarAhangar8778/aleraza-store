'use client';

import React from 'react';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tags,
  Users,
  UserPlus,
  Images,
  BadgePercent,
  LogOut,
} from 'lucide-react';
import { UserAccount } from '@/lib/store-data';

export type WpSection =
  | 'dashboard'
  | 'all-products'
  | 'edit-product'
  | 'quick-pricing'
  | 'categories'
  | 'media-carousels'
  | 'all-users'
  | 'add-user';

interface AdminSidebarProps {
  activeSection: WpSection;
  isNewProductMode: boolean;
  currentUser: UserAccount | null;
  onSelectSection: (section: WpSection) => void;
  onOpenNewProduct: () => void;
  onLogout: () => void;
}

/**
 * سایدبار منوی مدیریت با استایل وردپرس
 */
export function AdminSidebar({
  activeSection,
  isNewProductMode,
  currentUser,
  onSelectSection,
  onOpenNewProduct,
  onLogout,
}: AdminSidebarProps) {
  return (
    <aside className="w-full md:w-56 bg-[#1d2327] text-[#c3c4c7] shrink-0 flex flex-col justify-between border-l border-[#0c0d0e]">
      <div className="py-2">
        <div className="px-4 py-3 border-b border-[#2c3338] mb-2 flex items-center justify-between">
          <span className="text-xs font-black text-white">منوی پیشخوان</span>
          <span className="text-[10px] bg-[#2271b1] text-white px-2 py-0.5 rounded font-mono">
            v2.6
          </span>
        </div>

        <nav className="space-y-0.5 text-xs font-medium">
          {/* پیشخوان */}
          <button
            type="button"
            onClick={() => onSelectSection('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition cursor-pointer ${
              activeSection === 'dashboard'
                ? 'bg-[#2271b1] text-white font-bold'
                : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 shrink-0" />
            <span>پیشخوان اصلی</span>
          </button>

          {/* محصولات */}
          <div className="pt-2 pb-1 px-4 text-[10px] uppercase font-bold text-[#8c8f94] tracking-wider">
            مدیریت محصولات
          </div>

          <button
            type="button"
            onClick={() => onSelectSection('all-products')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition cursor-pointer ${
              activeSection === 'all-products'
                ? 'bg-[#2271b1] text-white font-bold'
                : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
            }`}
          >
            <Package className="w-4 h-4 shrink-0" />
            <span>همه محصولات</span>
          </button>

          <button
            type="button"
            onClick={onOpenNewProduct}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition cursor-pointer ${
              activeSection === 'edit-product' && isNewProductMode
                ? 'bg-[#2271b1] text-white font-bold'
                : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
            }`}
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>افزودن محصول جدید</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('quick-pricing')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition cursor-pointer ${
              activeSection === 'quick-pricing'
                ? 'bg-[#2271b1] text-white font-bold'
                : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
            }`}
          >
            <BadgePercent className="w-4 h-4 shrink-0" />
            <span>قیمت‌گذاری و تخفیف سریع</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('categories')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition cursor-pointer ${
              activeSection === 'categories'
                ? 'bg-[#2271b1] text-white font-bold'
                : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
            }`}
          >
            <Tags className="w-4 h-4 shrink-0" />
            <span>دسته‌بندی‌های لوازم</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('media-carousels')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition cursor-pointer ${
              activeSection === 'media-carousels'
                ? 'bg-[#2271b1] text-white font-bold'
                : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
            }`}
          >
            <Images className="w-4 h-4 shrink-0" />
            <span>رسانه‌ها و کاروسل تصاویر</span>
          </button>

          {/* کاربران و مشتریان - فقط برای مدیر کل */}
          {currentUser?.role === 'admin' && (
            <>
              <div className="pt-2 pb-1 px-4 text-[10px] uppercase font-bold text-[#8c8f94] tracking-wider">
                کاربران و مشتریان
              </div>

              <button
                type="button"
                onClick={() => onSelectSection('all-users')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition cursor-pointer ${
                  activeSection === 'all-users'
                    ? 'bg-[#2271b1] text-white font-bold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>فهرست کاربران</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectSection('add-user')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-right transition cursor-pointer ${
                  activeSection === 'add-user'
                    ? 'bg-[#2271b1] text-white font-bold'
                    : 'hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <UserPlus className="w-4 h-4 shrink-0" />
                <span>افزودن کاربر جدید</span>
              </button>
            </>
          )}
        </nav>
      </div>

      <div className="p-3 border-t border-[#2c3338]">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 rounded bg-[#d63638]/20 hover:bg-[#d63638] text-white py-2 text-xs font-bold transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>خروج از پیشخوان</span>
        </button>
      </div>
    </aside>
  );
}
