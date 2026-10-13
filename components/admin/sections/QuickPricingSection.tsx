'use client';

import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';
import {
  Product,
  formatToman,
  toPersianDigits,
  calcDiscountPercent,
  parsePriceInput,
  formatNumericInput,
  resolveAssetUrl,
} from '@/lib/store-data';
import { ProductImagePlaceholder } from '@/components/ProductImagePlaceholder';

interface QuickPricingSectionProps {
  products: Product[];
  onQuickUpdatePrice: (
    productId: string,
    price: number,
    discountedPrice: number,
    isDiscounted: boolean
  ) => Promise<void>;
  onUpdateProductCarousel: (
    productId: string,
    images: string[],
    maxCarouselImages: number
  ) => Promise<void>;
}

/**
 * جدول تغییر سریع قیمت‌ها، اعمال درصد تخفیف و انتخاب محصولات اول صفحه
 */
export function QuickPricingSection({
  products,
  onQuickUpdatePrice,
  onUpdateProductCarousel,
}: QuickPricingSectionProps) {
  const [priceDrafts, setPriceDrafts] = useState<
    Record<
      string,
      { price: number; discountedPrice: number; isDiscounted: boolean; maxCarouselImages: number }
    >
  >({});

  const handleSaveAll = async () => {
    for (const prod of products) {
      const d = priceDrafts[prod.id];
      if (!d) continue;
      if (
        d.price !== prod.price ||
        d.discountedPrice !== prod.discountedPrice ||
        d.isDiscounted !== prod.isDiscounted
      ) {
        await onQuickUpdatePrice(prod.id, d.price, d.discountedPrice, d.isDiscounted);
      }
      if (d.maxCarouselImages !== prod.maxCarouselImages) {
        await onUpdateProductCarousel(prod.id, prod.images, d.maxCarouselImages);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#1d2327]">
            تغییر سریع قیمت‌ها و محصولات تخفیف‌دار اول صفحه
          </h1>
          <p className="text-xs text-[#50575e] mt-1">
            می‌توانید هر عددی (با کیبورد فارسی یا انگلیسی) وارد کنید یا با یک کلیک درصد تخفیف بدهید.
          </p>
        </div>
        <button
          type="button"
          onClick={handleSaveAll}
          className="inline-flex items-center gap-1.5 rounded bg-[#00a32a] hover:bg-[#008a20] px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          ذخیره یکجای تمام تغییرات جدول
        </button>
      </div>

      <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-x-auto">
        <table className="w-full text-right border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7] font-bold text-[#1d2327]">
              <th className="py-3 px-3">محصول</th>
              <th className="py-3 px-3">قیمت اصلی (تومان)</th>
              <th className="py-3 px-3">قیمت با تخفیف (تومان)</th>
              <th className="py-3 px-3 text-center">تخفیف اول صفحه</th>
              <th className="py-3 px-3 text-center">تعداد عکس کاروسل</th>
              <th className="py-3 px-3 text-left">ذخیره</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f1]">
            {products.map((prod) => {
              const draft = priceDrafts[prod.id] || {
                price: prod.price,
                discountedPrice: prod.discountedPrice,
                isDiscounted: prod.isDiscounted,
                maxCarouselImages: prod.maxCarouselImages || prod.images.length,
              };
              const pct = calcDiscountPercent(draft.price, draft.discountedPrice);

              return (
                <tr key={prod.id} className="hover:bg-[#f6f7f7]">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      {prod.images && prod.images.length > 0 && prod.images[0]?.trim() ? (
                        <img
                          src={resolveAssetUrl(prod.images[0])}
                          alt=""
                          className="h-10 w-10 rounded object-cover border border-[#c3c4c7]"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded overflow-hidden border border-[#c3c4c7] shrink-0">
                          <ProductImagePlaceholder size="sm" showText={false} className="h-full w-full" />
                        </div>
                      )}
                      <span className="font-bold text-[#1d2327]">{prod.title}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                      placeholder="قیمت اصلی..."
                      value={formatNumericInput(draft.price)}
                      onChange={(e) =>
                        setPriceDrafts({
                          ...priceDrafts,
                          [prod.id]: {
                            ...draft,
                            price: parsePriceInput(e.target.value),
                          },
                        })
                      }
                      className="w-40 rounded border border-[#8c8f94] bg-white px-2.5 py-1.5 font-mono font-bold text-xs"
                    />
                    <div className="text-[10px] text-[#50575e] mt-0.5">
                      {formatToman(draft.price)} تومان
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      dir="ltr"
                      placeholder="قیمت با تخفیف..."
                      value={formatNumericInput(draft.discountedPrice)}
                      onChange={(e) => {
                        const val = parsePriceInput(e.target.value);
                        setPriceDrafts({
                          ...priceDrafts,
                          [prod.id]: {
                            ...draft,
                            discountedPrice: val,
                            isDiscounted: val > 0 && val < draft.price ? true : draft.isDiscounted,
                          },
                        });
                      }}
                      className="w-40 rounded border border-[#d63638] bg-white px-2.5 py-1.5 font-mono font-bold text-xs text-[#d63638]"
                    />
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-[10px] text-[#d63638] font-bold">
                        ({toPersianDigits(pct)}٪-)
                      </span>
                      {[10, 15, 20].map((quickPct) => (
                        <button
                          key={quickPct}
                          type="button"
                          onClick={() => {
                            const base = draft.price || prod.price;
                            const nextDisc = Math.round((base * (100 - quickPct)) / 100);
                            setPriceDrafts({
                              ...priceDrafts,
                              [prod.id]: {
                                ...draft,
                                price: base,
                                discountedPrice: nextDisc,
                                isDiscounted: true,
                              },
                            });
                          }}
                          className="rounded bg-[#fcf0f1] border border-[#f5c2c7] px-1.5 py-0.5 text-[9px] font-bold text-[#d63638] hover:bg-[#d63638] hover:text-white transition cursor-pointer"
                        >
                          {toPersianDigits(quickPct)}٪
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="checkbox"
                      checked={draft.isDiscounted}
                      onChange={async (e) => {
                        const checked = e.target.checked;
                        let nextDisc = draft.discountedPrice;
                        if (checked && draft.price > 0 && nextDisc >= draft.price) {
                          nextDisc = Math.round(draft.price * 0.9);
                        }
                        setPriceDrafts({
                          ...priceDrafts,
                          [prod.id]: {
                            ...draft,
                            isDiscounted: checked,
                            discountedPrice: nextDisc,
                          },
                        });
                        await onQuickUpdatePrice(prod.id, draft.price, nextDisc, checked);
                      }}
                      className="h-4 w-4 accent-[#d63638] cursor-pointer"
                    />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={draft.maxCarouselImages}
                      onChange={(e) =>
                        setPriceDrafts({
                          ...priceDrafts,
                          [prod.id]: {
                            ...draft,
                            maxCarouselImages: Math.max(1, Number(e.target.value)),
                          },
                        })
                      }
                      className="w-16 rounded border border-[#8c8f94] px-2 py-1.5 text-center font-bold"
                    />
                  </td>
                  <td className="py-3 px-3 text-left">
                    <button
                      type="button"
                      onClick={async () => {
                        await onQuickUpdatePrice(
                          prod.id,
                          draft.price,
                          draft.discountedPrice,
                          draft.isDiscounted
                        );
                        if (draft.maxCarouselImages !== prod.maxCarouselImages) {
                          await onUpdateProductCarousel(
                            prod.id,
                            prod.images,
                            draft.maxCarouselImages
                          );
                        }
                      }}
                      className="inline-flex items-center gap-1 rounded bg-[#2271b1] hover:bg-[#135e96] px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                      بروزرسانی
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
