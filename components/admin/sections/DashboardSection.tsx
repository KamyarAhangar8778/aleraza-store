'use client';

import React from 'react';
import Link from 'next/link';
import {
  ExternalLink,
  Images,
  BadgePercent,
  Tags,
  UserPlus,
  Zap,
  RefreshCw,
} from 'lucide-react';
import {
  Category,
  Product,
  UserAccount,
  formatToman,
  toPersianDigits,
  resolveAssetUrl,
} from '@/lib/store-data';
import { IMAGE_CACHE_NAME } from '@/components/AssetCacheManager';
import { WpSection } from '../AdminSidebar';

interface DashboardSectionProps {
  products: Product[];
  categories: Category[];
  users: UserAccount[];
  cacheStats: { images: number; fonts: number; warming: boolean };
  onRefreshCache: () => void;
  onSelectSection: (section: WpSection) => void;
  onEditProduct: (product: Product) => void;
}

/**
 * بخش پیشخوان و آمار سریع فروشگاه آلِرضا
 */
export function DashboardSection({
  products,
  categories,
  users,
  cacheStats,
  onRefreshCache,
  onSelectSection,
  onEditProduct,
}: DashboardSectionProps) {
  const discountedCount = products.filter((p) => p.isDiscounted).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1d2327]">
            پیشخوان مدیریت لوازم جانبی و قطعات آلِرضا
          </h1>
          <p className="text-xs text-[#50575e] mt-1">
            به پنل مدیریت اختصاصی خوش آمدید. از منوی سمت راست می‌توانید لوازم جانبی و قطعات، کاروسل تصاویر، قیمت‌ها، دسته‌بندی‌ها و کاربران را مدیریت کنید.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded bg-[#2271b1] px-4 py-2 text-xs font-bold text-white hover:bg-[#135e96] transition"
        >
          <ExternalLink className="w-4 h-4" />
          مشاهده زنده لندینگ پیج آلِرضا
        </Link>
      </div>

      {/* پنل خوش‌آمدگویی وردپرس */}
      <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm p-6">
        <h2 className="text-base font-bold text-[#1d2327]">
          دسترسی سریع به بخش‌های اصلی فروشگاه آلِرضا
        </h2>
        <p className="text-xs text-[#50575e] mt-1">
          هر یک از عملیات مورد نظر خود را انتخاب کنید:
        </p>

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onSelectSection('media-carousels')}
            className="flex flex-col items-start p-4 rounded border border-[#c3c4c7] hover:border-[#2271b1] hover:bg-[#f0f6fc] text-right transition cursor-pointer"
          >
            <Images className="w-6 h-6 text-[#2271b1] mb-2" />
            <span className="text-xs font-bold text-[#1d2327]">
              تنظیم تعداد و عکس‌های کاروسل
            </span>
            <span className="text-[11px] text-[#50575e] mt-1">
              افزودن، حذف، ویرایش و تعیین تعداد اسلایدهای هر محصول
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('quick-pricing')}
            className="flex flex-col items-start p-4 rounded border border-[#c3c4c7] hover:border-[#2271b1] hover:bg-[#f0f6fc] text-right transition cursor-pointer"
          >
            <BadgePercent className="w-6 h-6 text-[#d63638] mb-2" />
            <span className="text-xs font-bold text-[#1d2327]">
              ویرایش قیمت‌ها و تخفیف اول صفحه
            </span>
            <span className="text-[11px] text-[#50575e] mt-1">
              تغییر سریع قیمت‌ها و انتخاب محصولات تخفیف‌دار ابتدای سایت
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('categories')}
            className="flex flex-col items-start p-4 rounded border border-[#c3c4c7] hover:border-[#2271b1] hover:bg-[#f0f6fc] text-right transition cursor-pointer"
          >
            <Tags className="w-6 h-6 text-[#00a32a] mb-2" />
            <span className="text-xs font-bold text-[#1d2327]">
              مدیریت دسته‌بندی محصولات
            </span>
            <span className="text-[11px] text-[#50575e] mt-1">
              ایجاد، ویرایش و حذف دسته‌بندی‌های لوازم خانگی
            </span>
          </button>

          <button
            type="button"
            onClick={() => onSelectSection('add-user')}
            className="flex flex-col items-start p-4 rounded border border-[#c3c4c7] hover:border-[#2271b1] hover:bg-[#f0f6fc] text-right transition cursor-pointer"
          >
            <UserPlus className="w-6 h-6 text-[#2271b1] mb-2" />
            <span className="text-xs font-bold text-[#1d2327]">
              افزودن کاربر (شماره، نام و رمز)
            </span>
            <span className="text-[11px] text-[#50575e] mt-1">
              تعریف دستی مشتری یا مدیر جدید با شماره و رمز عبور
            </span>
          </button>
        </div>
      </div>

      {/* ویجت‌های در یک نگاه */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm">
          <div className="border-b border-[#c3c4c7] px-4 py-3 font-bold text-xs text-[#1d2327]">
            در یک نگاه (وضعیت فروشگاه آلِرضا)
          </div>
          <div className="p-4 grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded bg-[#f6f7f7] border border-[#dcdcde]">
              <span className="text-[#50575e]">کل محصولات ثبت‌شده:</span>
              <p className="text-lg font-black text-[#2271b1] mt-1">
                {toPersianDigits(products.length)} کالا
              </p>
            </div>
            <div className="p-3 rounded bg-[#fcf0f1] border border-[#f5c2c7]">
              <span className="text-[#50575e]">محصولات تخفیف‌دار اول صفحه:</span>
              <p className="text-lg font-black text-[#d63638] mt-1">
                {toPersianDigits(discountedCount)} کالا
              </p>
            </div>
            <div className="p-3 rounded bg-[#f6f7f7] border border-[#dcdcde]">
              <span className="text-[#50575e]">دسته‌بندی‌های فعال:</span>
              <p className="text-lg font-black text-[#00a32a] mt-1">
                {toPersianDigits(categories.length)} دسته
              </p>
            </div>
            <div className="p-3 rounded bg-[#f6f7f7] border border-[#dcdcde]">
              <span className="text-[#50575e]">کاربران ثبت‌شده:</span>
              <p className="text-lg font-black text-[#1d2327] mt-1">
                {toPersianDigits(users.length)} کاربر
              </p>
            </div>
          </div>
        </div>

        {/* لیست آخرین کالاهای تخفیف‌دار */}
        <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm">
          <div className="border-b border-[#c3c4c7] px-4 py-3 flex items-center justify-between">
            <span className="font-bold text-xs text-[#1d2327]">
              محصولات در ویترین تخفیف اول صفحه
            </span>
            <button
              type="button"
              onClick={() => onSelectSection('quick-pricing')}
              className="text-[11px] font-bold text-[#2271b1] hover:underline cursor-pointer"
            >
              ویرایش همه قیمت‌ها ←
            </button>
          </div>
          <div className="divide-y divide-[#f0f0f1]">
            {products
              .filter((p) => p.isDiscounted)
              .slice(0, 4)
              .map((p) => (
                <div
                  key={p.id}
                  className="p-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={resolveAssetUrl(p.images[0])}
                      alt={p.title}
                      className="h-9 w-9 rounded object-cover border border-[#c3c4c7]"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-[#1d2327] truncate">{p.title}</p>
                      <p className="text-[11px] text-[#d63638] font-semibold">
                        {formatToman(p.discountedPrice)} تومان (قبل:{' '}
                        {formatToman(p.price)})
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onEditProduct(p)}
                    className="rounded border border-[#2271b1] px-2.5 py-1 text-[11px] font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition flex-shrink-0 cursor-pointer"
                  >
                    ویرایش
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* وضعیت کش مرورگر و سرویس‌ورکر */}
      <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm">
        <div className="border-b border-[#c3c4c7] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#00a32a]" />
            <span className="font-bold text-xs text-[#1d2327]">
              سیستم کش دائمی تصاویر کاروسل و فونت‌ها (Service Worker + HTTP Immutable Cache)
            </span>
          </div>
          <button
            type="button"
            onClick={onRefreshCache}
            disabled={cacheStats.warming}
            className="inline-flex items-center gap-1.5 rounded bg-[#2271b1] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#135e96] transition disabled:opacity-60 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${cacheStats.warming ? 'animate-spin' : ''}`} />
            {cacheStats.warming ? 'در حال بروزرسانی کش...' : 'بروزرسانی و کش مجدد تصاویر و فونت‌ها'}
          </button>
        </div>
        <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 rounded bg-[#edfaef] border border-[#00a32a]/30">
            <span className="text-[#50575e] font-medium">تصاویر کش‌شده در مرورگر:</span>
            <p className="text-base font-black text-[#00a32a] mt-1">
              {toPersianDigits(cacheStats.images)} تصویر کاروسل و بنر
            </p>
            <p className="text-[11px] text-[#50575e] mt-0.5">
              ذخیره در CacheStorage ({IMAGE_CACHE_NAME}) و حافظه مرورگر
            </p>
          </div>
          <div className="p-3 rounded bg-[#f0f6fc] border border-[#2271b1]/30">
            <span className="text-[#50575e] font-medium">فونت‌های فارسی کش‌شده:</span>
            <p className="text-base font-black text-[#2271b1] mt-1">
              فونت وزیرمتن ({toPersianDigits(cacheStats.fonts)} فایل WOFF2)
            </p>
            <p className="text-[11px] text-[#50575e] mt-0.5">
              کش دائمی یک‌ساله (max-age=31536000, immutable)
            </p>
          </div>
          <div className="p-3 rounded bg-[#f6f7f7] border border-[#dcdcde]">
            <span className="text-[#50575e] font-medium">وضعیت لود اسلایدرهای محصول:</span>
            <p className="text-base font-black text-[#1d2327] mt-1">
              فعال (بدون تاخیر و پرش)
            </p>
            <p className="text-[11px] text-[#50575e] mt-0.5">
              پیش‌بارگذاری خودکار تمام اسلایدهای کاروسل در پس‌زمینه
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
