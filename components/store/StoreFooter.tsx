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
            <span className="text-xl font-black">فروشگاه قطعات لوازم خانگی آل رضا</span>
          </div>
          <p className="text-xs text-[#B8AFA6] leading-relaxed max-w-md">
            مرجع تخصصی قطعات لوازم خانگی آل رضا — مدیریت یعقوبی. عرضه‌کننده مستقیم فیلترهای تصفیه آب و هوای سایدبای‌ساید، قطعات یدکی جاروبرقی، تجهیزات باریستا و اسپرسوساز، پایه‌های ضد لرزش و ملزومات مصرفی لوازم خانگی. پخش در مشهد و سراسر شهرستان‌ها و استان‌های کشور.
          </p>
          <div className="flex flex-col gap-2 pt-2 text-xs text-[#DCD4C6]">
            <div className="flex flex-wrap items-center gap-4">
              <span className="inline-flex items-center gap-1.5 font-bold text-white">
                <PhoneCall className="w-4 h-4 text-[#C85A32]" />
                تماس و سفارش:
              </span>
              <a href="tel:09158010113" className="hover:text-[#C85A32] transition font-mono tabular-nums text-sm">
                ۰۹۱۵۸۰۱۰۱۱۳
              </a>
              <span className="text-[#8C837A]">|</span>
              <a href="tel:09940141516" className="hover:text-[#C85A32] transition font-mono tabular-nums text-sm">
                ۰۹۹۴۰۱۴۱۵۱۶
              </a>
              <span className="rounded bg-[#C85A32]/20 text-[#E59872] px-2 py-0.5 text-[11px] font-bold">
                مدیریت یعقوبی
              </span>
            </div>
            <div className="flex items-start gap-1.5 text-xs text-[#B8AFA6] pt-1">
              <MapPin className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
              <span>
                <strong className="text-[#FAF7F2]">نشانی دفتر (مراجعه اداری و پخش):</strong> مشهد، جلال ۶۶، پلاک ۱۶۶، زنگ اول (فروشگاه حضوری نداریم، پخش و ارسال سفارشات)
              </span>
            </div>
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
              <a href="#why-aleraza" className="hover:text-white transition">
                • شرایط ضمانت و خرید همکاری
              </a>
            </li>
          </ul>
        </div>

        {/* دسترسی‌های کاربری مشتریان */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-sm font-extrabold text-[#E59872]">حساب مشتریان و همکاران</h4>
          <p className="text-xs text-[#B8AFA6] leading-relaxed">
            مشتریان و همکاران گرامی می‌توانند با شماره موبایل و رمز عبوری که از سوی مدیریت فروشگاه برایشان ثبت شده وارد شوند.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={onOpenAuth}
              className="w-full rounded-xl bg-[#C85A32] py-2.5 text-xs font-bold text-white hover:bg-[#B04B25] transition cursor-pointer"
            >
              ورود به حساب مشتریان آلِرضا
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
