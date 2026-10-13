'use client';

import React from 'react';
import { ShieldCheck, Truck, Award, Headphones } from 'lucide-react';

/**
 * بخش ستون‌های اعتمادسازی و مزایای خرید از آلِرضا
 */
export function StorePillarsSection() {
  return (
    <section
      id="why-aleraza"
      className="py-14 bg-[#F3EFE6] border-t border-[#E6DFD3]"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-extrabold text-[#C85A32]">
            تعهد کیفیت و اصالت
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#181615] mt-1">
            چرا خانواده‌های ایرانی لوازم خانگی آلِرضا را انتخاب می‌کنند؟
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-5">
          <div className="rounded-xl sm:rounded-2xl bg-white border border-[#E6DFD3] p-3.5 sm:p-6 space-y-2">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-[#C85A32]/15 text-[#C85A32] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#181615]">
              ۳۶ ماه ضمانت طلایی
            </h3>
            <p className="text-[11px] sm:text-xs text-[#6E675F] leading-relaxed">
              تضمین اصالت فیزیکی و تأمین قطعات یدکی اورجینال شرکتی.
            </p>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-white border border-[#E6DFD3] p-3.5 sm:p-6 space-y-2">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-[#1F6E58]/15 text-[#1F6E58] flex items-center justify-center">
              <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#181615]">
              ارسال سریع و مطمئن
            </h3>
            <p className="text-[11px] sm:text-xs text-[#6E675F] leading-relaxed">
              بیمه سلامت فیزیکی قطعات و ارسال سریع در سراسر کشور.
            </p>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-white border border-[#E6DFD3] p-3.5 sm:p-6 space-y-2">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-[#C85A32]/15 text-[#C85A32] flex items-center justify-center">
              <Award className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#181615]">
              تضمین ۱۰۰٪ اصالت
            </h3>
            <p className="text-[11px] sm:text-xs text-[#6E675F] leading-relaxed">
              ارائه کد رهگیری و شناسه اصالت کالا برای تمامی فیلترها و ملزومات.
            </p>
          </div>

          <div className="rounded-xl sm:rounded-2xl bg-white border border-[#E6DFD3] p-3.5 sm:p-6 space-y-2">
            <div className="h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl bg-[#1F6E58]/15 text-[#1F6E58] flex items-center justify-center">
              <Headphones className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <h3 className="text-xs sm:text-sm font-extrabold text-[#181615]">
              مشاوره تخصصی خرید
            </h3>
            <p className="text-[11px] sm:text-xs text-[#6E675F] leading-relaxed">
              راهنمایی دقیق جهت انتخاب فیلتر یا قطعه مناسب مدل دستگاه شما.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
