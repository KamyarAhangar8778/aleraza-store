'use client';

import React from 'react';
import { BadgePercent } from 'lucide-react';
import {
  Product,
  formatToman,
  toPersianDigits,
  calcDiscountPercent,
  parsePriceInput,
  formatNumericInput,
} from '@/lib/store-data';

interface ProductPricingCardProps {
  product: Product;
  onChange: (updated: Product) => void;
}

/**
 * کادر مدیریت قیمت عادی، قیمت با تخفیف و دکمه‌های تخفیف درصدی سریع
 */
export function ProductPricingCard({ product, onChange }: ProductPricingCardProps) {
  return (
    <div className="bg-white border-2 border-[#2271b1]/40 rounded-sm overflow-hidden shadow-xs">
      <div className="bg-[#f0f6fc] border-b border-[#c5d9ed] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BadgePercent className="w-4 h-4 text-[#2271b1]" />
          <span className="text-xs font-bold text-[#1d2327]">
            اطلاعات محصول — قیمت‌گذاری و وضعیت تخفیف اول صفحه
          </span>
        </div>
        <label className="inline-flex items-center gap-2 cursor-pointer rounded bg-white border border-[#d63638]/40 px-3 py-1.5 shadow-2xs">
          <input
            type="checkbox"
            checked={product.isDiscounted}
            onChange={(e) => {
              const checked = e.target.checked;
              let nextDiscounted = product.discountedPrice;
              if (checked && product.price > 0 && (!nextDiscounted || nextDiscounted >= product.price)) {
                nextDiscounted = Math.round(product.price * 0.85);
              }
              onChange({
                ...product,
                isDiscounted: checked,
                discountedPrice: nextDiscounted,
              });
            }}
            className="w-4 h-4 accent-[#d63638]"
          />
          <span className="text-xs font-extrabold text-[#d63638]">
            نمایش در لیست تخفیف‌دار ابتدای سایت
          </span>
        </label>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* قیمت عادی */}
          <div className="p-3.5 rounded border border-[#c3c4c7] bg-[#f6f7f7] space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#1d2327]">
                قیمت عادی / قبل از تخفیف (تومان)
              </label>
              <button
                type="button"
                onClick={() => onChange({ ...product, price: 0 })}
                className="text-[11px] text-[#2271b1] hover:underline cursor-pointer"
              >
                پاک کردن
              </button>
            </div>
            <input
              type="text"
              inputMode="numeric"
              dir="ltr"
              placeholder="مثلاً: 25,000,000"
              value={formatNumericInput(product.price)}
              onChange={(e) => {
                const val = parsePriceInput(e.target.value);
                onChange({ ...product, price: val });
              }}
              className="w-full rounded border border-[#8c8f94] bg-white px-3 py-2.5 font-mono font-bold text-base text-[#1d2327] focus:border-[#2271b1] focus:outline-none"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-[#1d2327]">
                معادل: {formatToman(product.price)} تومان
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onChange({ ...product, price: product.price + 1000000 })}
                  className="rounded bg-white border border-[#c3c4c7] px-2 py-0.5 text-[10px] font-bold hover:bg-[#f0f6fc] cursor-pointer"
                >
                  +۱ میلیون
                </button>
                <button
                  type="button"
                  onClick={() => onChange({ ...product, price: Math.max(0, product.price - 1000000) })}
                  className="rounded bg-white border border-[#c3c4c7] px-2 py-0.5 text-[10px] font-bold hover:bg-[#f0f6fc] cursor-pointer"
                >
                  -۱ میلیون
                </button>
              </div>
            </div>
          </div>

          {/* قیمت با تخفیف */}
          <div className="p-3.5 rounded border border-[#f5c2c7] bg-[#fcf0f1]/50 space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-[#d63638]">
                قیمت فروش ویژه / با تخفیف (تومان)
              </label>
              <button
                type="button"
                onClick={() => onChange({ ...product, discountedPrice: 0 })}
                className="text-[11px] text-[#d63638] hover:underline cursor-pointer"
              >
                پاک کردن
              </button>
            </div>
            <input
              type="text"
              inputMode="numeric"
              dir="ltr"
              placeholder="مثلاً: 21,500,000"
              value={formatNumericInput(product.discountedPrice)}
              onChange={(e) => {
                const val = parsePriceInput(e.target.value);
                onChange({
                  ...product,
                  discountedPrice: val,
                  isDiscounted: val > 0 && val < product.price ? true : product.isDiscounted,
                });
              }}
              className="w-full rounded border border-[#d63638] bg-white px-3 py-2.5 font-mono font-bold text-base text-[#d63638] focus:outline-none"
            />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[11px] text-[#d63638] font-bold">
                معادل: {formatToman(product.discountedPrice)} تومان (
                {toPersianDigits(calcDiscountPercent(product.price, product.discountedPrice))}٪ تخفیف)
              </span>
            </div>
          </div>
        </div>

        {/* دکمه‌های تخفیف درصدی سریع */}
        <div className="p-3 rounded bg-[#f0f6fc] border border-[#c5d9ed] flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-bold text-[#1d2327]">
            اعمال سریع درصد تخفیف روی قیمت عادی:
          </span>
          <div className="flex flex-wrap items-center gap-1.5">
            {[5, 10, 15, 20, 25, 30, 40, 50].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => {
                  const base = product.price || 10000000;
                  const discounted = Math.round((base * (100 - pct)) / 100);
                  onChange({
                    ...product,
                    price: base,
                    discountedPrice: discounted,
                    isDiscounted: true,
                  });
                }}
                className="rounded bg-white border border-[#2271b1]/40 px-2.5 py-1 text-[11px] font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition cursor-pointer"
              >
                {toPersianDigits(pct)}٪ تخفیف
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
