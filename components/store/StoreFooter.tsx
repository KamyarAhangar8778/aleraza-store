'use client';

import React from 'react';
import Link from 'next/link';
import { PhoneCall, MapPin } from 'lucide-react';

interface StoreFooterProps {
  onOpenAuth: () => void;
}

/**
 * فوتر اصلی فروشگاه شامل اطلاعات تماس، معرفی فروشگاه و پیوندهای سریع
 */
export function StoreFooter({ onOpenAuth }: StoreFooterProps) {
  return (
    <footer className="bg-[#181615] text-[#FAF7F2] py-12 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* معرفی برند و اطلاعات تماس */}
        <div className="md:col-span-5 space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C85A32] text-white font-black text-lg">
              آ
            </div>
            <span className="text-xl font-black">فروشگاه لوازم خانگی آلِرضا</span>
          </div>
          <p className="text-xs text-[#B8AFA6] leading-relaxed max-w-md">
            مرجع تخصصی لوازم جانبی آلِرضا، عرضه‌کننده مستقیم فیلترهای تصفیه آب و هوای سایدبای‌ساید، فیلتر هپا و قطعات جاروبرقی، تجهیزات باریستا و اسپرسوساز، پایه‌های ضد لرزش و ملزومات مصرفی لوازم خانگی با ضمانت اصالت فیزیکی.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#DCD4C6]">
            <span className="inline-flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-[#C85A32]" />
              ۰۲۱-۸۸۹۹۴۴۰۰
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#C85A32]" />
              تهران، بلوار آفریقا، گالری مرکزی آلِرضا
            </span>
          </div>
        </div>

        {/* بخش‌های فروشگاه */}
        <div className="md:col-span-4 space-y-2.5">
          <h4 className="text-sm font-extrabold text-[#E59872]">بخش‌های فروشگاه</h4>
          <ul className="space-y-2 text-xs text-[#DCD4C6]">
            <li>
              <a href="#discounted-grid" className="hover:text-white transition">
                • جشنواره تخفیف‌های ویژه اول صفحه
              </a>
            </li>
            <li>
              <a href="#categories-section" className="hover:text-white transition">
                • دسته‌بندی‌های لوازم خانگی آلِرضا
              </a>
            </li>
            <li>
              <a href="#all-products" className="hover:text-white transition">
                • کاتالوگ کامل محصولات
              </a>
            </li>
            <li>
              <Link href="/admin" className="text-[#72aee6] hover:underline font-bold">
                • ورود به پیشخوان مدیریت سایت (WordPress Admin)
              </Link>
            </li>
          </ul>
        </div>

        {/* دسترسی‌های کاربری و ادمین */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-sm font-extrabold text-[#E59872]">حساب کاربری و مدیریت</h4>
          <p className="text-xs text-[#B8AFA6] leading-relaxed">
            ورود سریع مشتریان با شماره موبایل و رمز عبور یا دسترسی به پیشخوان مجزای مدیریت.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full rounded-xl bg-[#C85A32] py-2.5 text-xs font-bold text-white hover:bg-[#B04B25] transition cursor-pointer"
            >
              ورود / ثبت‌نام مشتریان
            </button>
            <Link
              href="/admin"
              className="w-full text-center rounded-xl bg-white/10 border border-white/15 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
            >
              ورود به پنل مدیریت مجزا (/admin)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
