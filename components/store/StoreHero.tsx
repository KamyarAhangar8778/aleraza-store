'use client';

import React from 'react';
import { Sparkles, ArrowLeft, BadgePercent } from 'lucide-react';
import { resolveAssetUrl, cacheImageResource } from '@/lib/store-data';

/**
 * بخش بنر هیرو با تصویر باکیفیت و دعوت به اقدام برای کاتالوگ لوازم جانبی
 */
export function StoreHero() {
  const heroImage = '/images/hero_appliance_accessories.jpg';

  return (
    <section
      id="hero-banner"
      className="relative pt-6 pb-8 bg-gradient-to-b from-[#F3EFE6] via-[#FAF7F2] to-[#FAF7F2]"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl sm:rounded-3xl bg-[#181615] text-[#FAF7F2] overflow-hidden border border-[#C85A32]/30 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            {/* متن معرفی و دکمه‌های اقدام */}
            <div className="lg:col-span-7 p-4 sm:p-10 space-y-3.5 sm:space-y-5 z-10">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#D92D20] px-3 py-0.5 sm:py-1 text-[11px] sm:text-xs font-extrabold text-white shadow">
                <Sparkles className="w-3.5 h-3.5" />
                تخفیف‌های ویژه لوازم جانبی و قطعات
              </div>
              <h2 className="text-xl sm:text-4xl font-black leading-tight tracking-tight">
                لوازم جانبی و قطعات <span className="text-[#E59872]">آلِرضا</span>؛ ضامن کارایی و طول عمر لوازم خانگی شما
              </h2>
              <p className="text-xs sm:text-sm text-[#DCD4C6] leading-relaxed max-w-2xl">
                عرضه تخصصی فیلترهای تصفیه آب سایدبای‌ساید، فیلترهای هپا و پارویی توربو جاروبرقی، پورتافیلتر و تمپر باریستا، پایه‌های ضد لرزش ماشین لباسشویی و ظروف سیلیکونی نسوز سرخ‌کن با ضمانت اصالت.
              </p>
              <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                <a
                  href="#categories-section"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C85A32] px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-bold text-white shadow hover:bg-[#B04B25] transition"
                >
                  <span>مشاهده دسته‌بندی‌های لوازم جانبی</span>
                  <ArrowLeft className="w-4 h-4" />
                </a>
                <a
                  href="#discounted-grid"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 border border-white/15 px-4 sm:px-5 py-2.5 sm:py-3 text-xs font-bold text-white hover:bg-white/20 transition"
                >
                  <BadgePercent className="w-4 h-4" />
                  پیشنهادهای تخفیف‌دار اول صفحه
                </a>
              </div>
            </div>

            {/* تصویر شاخص لوازم جانبی */}
            <div className="lg:col-span-5 relative h-48 sm:h-64 lg:h-full min-h-[200px] sm:min-h-[280px]">
              <img
                src={resolveAssetUrl(heroImage)}
                alt="لوازم جانبی و قطعات اورجینال لوازم خانگی آلِرضا"
                loading="eager"
                decoding="async"
                onLoad={() => cacheImageResource(heroImage)}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#181615] via-[#181615]/40 to-transparent lg:block hidden" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181615] via-transparent to-transparent lg:hidden block" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
