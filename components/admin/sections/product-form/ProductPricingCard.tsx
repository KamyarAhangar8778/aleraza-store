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

        {/* بخش قیمت همکاری و عمده (مخصوص مشتریان عضو که توسط ادمین ثبت شده‌اند) */}
        <div className="p-4 rounded border-2 border-[#1F6E58]/30 bg-[#1F6E58]/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#1F6E58]" />
              <h4 className="text-xs font-black text-[#1F6E58]">
                قیمت همکاری یا قیمت عمده (ویژه مشتریان عضو با حداقل تعداد)
              </h4>
            </div>
            <span className="text-[10px] text-[#1F6E58] bg-[#1F6E58]/10 px-2 py-0.5 rounded font-bold">
              قیمت اختصاصی مشتریان
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* قیمت همکاری / عمده */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-[#1d2327]">
                  قیمت هر عدد برای خرید عمده/همکاری (تومان)
                </label>
                {product.wholesalePrice ? (
                  <button
                    type="button"
                    onClick={() => onChange({ ...product, wholesalePrice: undefined })}
                    className="text-[11px] text-[#d63638] hover:underline cursor-pointer"
                  >
                    غیرفعال‌سازی
                  </button>
                ) : null}
              </div>
              <input
                type="text"
                inputMode="numeric"
                dir="ltr"
                placeholder="مثلاً: 18,000,000"
                value={formatNumericInput(product.wholesalePrice)}
                onChange={(e) => {
                  const val = parsePriceInput(e.target.value);
                  onChange({ ...product, wholesalePrice: val > 0 ? val : undefined });
                }}
                className="w-full rounded border border-[#1F6E58]/50 bg-white px-3 py-2 font-mono font-bold text-sm text-[#1F6E58] focus:border-[#1F6E58] focus:outline-none"
              />
              <div className="text-[11px] text-[#1F6E58] font-bold">
                {product.wholesalePrice && product.wholesalePrice > 0 ? (
                  <>معادل: {formatToman(product.wholesalePrice)} تومان</>
                ) : (
                  <span className="text-[#8c8f94] font-normal">قیمت همکاری هنوز تعریف نشده است</span>
                )}
              </div>
            </div>

            {/* حداقل تعداد برای قیمت همکاری */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#1d2327] block">
                حداقل تعداد خرید برای اعمال قیمت همکاری/عمده
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={1}
                  max={999}
                  placeholder="5"
                  value={product.wholesaleMinQty || 5}
                  onChange={(e) => {
                    const q = Math.max(1, parseInt(e.target.value, 10) || 1);
                    onChange({ ...product, wholesaleMinQty: q });
                  }}
                  className="w-24 rounded border border-[#8c8f94] bg-white px-3 py-2 text-center font-bold text-sm text-[#1d2327] focus:border-[#1F6E58] focus:outline-none"
                />
                <span className="text-xs text-[#50575e] font-bold">عدد به بالا</span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                {[3, 5, 10, 15, 20].map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => onChange({ ...product, wholesaleMinQty: qty })}
                    className={`rounded px-2 py-0.5 text-[10px] font-bold transition cursor-pointer border ${
                      (product.wholesaleMinQty || 5) === qty
                        ? 'bg-[#1F6E58] text-white border-[#1F6E58]'
                        : 'bg-white text-[#1F6E58] border-[#1F6E58]/30 hover:bg-[#1F6E58]/10'
                    }`}
                  >
                    بالای {toPersianDigits(qty)} تا
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
