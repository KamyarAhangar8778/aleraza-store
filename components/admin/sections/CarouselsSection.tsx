'use client';

import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Trash2, Upload } from 'lucide-react';
import {
  Product,
  PRESET_APPLIANCE_GALLERY,
  toPersianDigits,
  resolveAssetUrl,
} from '@/lib/store-data';
import { ProductImagePlaceholder } from '@/components/ProductImagePlaceholder';
import { compressImageFile } from '@/lib/image-utils';

interface CarouselsSectionProps {
  products: Product[];
  selectedMediaProductId: string;
  onSelectMediaProduct: (productId: string) => void;
  onUpdateProductCarousel: (
    productId: string,
    images: string[],
    maxCarouselImages: number
  ) => Promise<void>;
}

/**
 * بخش مدیریت کاروسل و اسلایدرهای تصاویر محصول به صورت مجزا
 */
export function CarouselsSection({
  products,
  selectedMediaProductId,
  onSelectMediaProduct,
  onUpdateProductCarousel,
}: CarouselsSectionProps) {
  const [newImageUrl, setNewImageUrl] = useState('');

  const selectedMediaProduct =
    products.find((p) => p.id === selectedMediaProductId) || products[0];

  if (!selectedMediaProduct) {
    return (
      <div className="bg-white p-8 rounded border border-[#c3c4c7] text-center text-xs text-[#50575e]">
        محصولی برای نمایش کاروسل یافت نشد.
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, (dataUrl) => {
      const next = [...selectedMediaProduct.images, dataUrl];
      onUpdateProductCarousel(
        selectedMediaProduct.id,
        next,
        Math.max(selectedMediaProduct.maxCarouselImages, next.length)
      );
    });
    e.target.value = '';
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-[#1d2327]">
          مدیریت کاروسل تصاویر محصولات (انتخاب تعداد، افزودن، حذف و ویرایش)
        </h1>
        <p className="text-xs text-[#50575e] mt-1">
          محصول مورد نظر را انتخاب کنید، تعداد عکس‌های کاروسل آن را تعیین نمایید و عکس‌ها را اضافه، حذف یا ویرایش کنید.
        </p>
      </div>

      <div className="bg-white border border-[#c3c4c7] p-5 rounded-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0f0f1] pb-4">
          <div className="flex items-center gap-3">
            <label className="text-xs font-bold text-[#1d2327]">
              انتخاب محصول:
            </label>
            <select
              value={selectedMediaProduct.id}
              onChange={(e) => onSelectMediaProduct(e.target.value)}
              className="rounded border border-[#8c8f94] px-3 py-2 text-xs font-bold text-[#1d2327]"
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#f0f6fc] border border-[#c5d9ed] px-3.5 py-2 rounded">
            <span className="text-xs font-bold text-[#1d2327]">
              تعداد عکس‌های قابل نمایش در کاروسل این محصول:
            </span>
            <input
              type="number"
              min={1}
              max={20}
              value={selectedMediaProduct.maxCarouselImages}
              onChange={(e) =>
                onUpdateProductCarousel(
                  selectedMediaProduct.id,
                  selectedMediaProduct.images,
                  Math.max(1, Number(e.target.value))
                )
              }
              className="w-16 rounded border border-[#2271b1] bg-white px-2 py-1 text-center text-sm font-black text-[#2271b1]"
            />
          </div>
        </div>

        {/* لیست عکس‌های کاروسل */}
        {!selectedMediaProduct.images || selectedMediaProduct.images.length === 0 ? (
          <div className="rounded-lg border border-dashed border-[#c3c4c7] p-6 text-center space-y-3 bg-[#f9f9f9]">
            <div className="mx-auto h-24 w-36 rounded-xl overflow-hidden border border-[#c3c4c7]">
              <ProductImagePlaceholder size="sm" showText={false} className="h-full w-full" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#1d2327]">
                این محصول هنوز هیچ تصویری ندارد
              </p>
              <p className="text-[11px] text-[#50575e] mt-0.5">
                در فروشگاه، نماد هندسی و فنی استاندارد جایگزین تصویر نمایش داده می‌شود.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2.5">
            {selectedMediaProduct.images.map((imgUrl, idx) => {
              const isVisible = idx < selectedMediaProduct.maxCarouselImages;
              return (
                <div
                  key={idx}
                  className={`flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded border ${
                    isVisible
                      ? 'bg-[#f6f7f7] border-[#c3c4c7]'
                      : 'bg-gray-50 border-dashed border-gray-300 opacity-60'
                  }`}
                >
                  <img
                    src={resolveAssetUrl(imgUrl)}
                    alt=""
                    className="h-14 w-20 rounded object-cover border border-[#c3c4c7]"
                  />
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2 text-xs font-bold mb-1">
                      <span>تصویر شماره {toPersianDigits(idx + 1)}</span>
                      {!isVisible && (
                        <span className="text-[11px] text-[#d63638]">
                          (خارج از سقف تعداد انتخابی کاروسل)
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={imgUrl}
                      onChange={(e) => {
                        const next = [...selectedMediaProduct.images];
                        next[idx] = e.target.value;
                        onUpdateProductCarousel(
                          selectedMediaProduct.id,
                          next,
                          selectedMediaProduct.maxCarouselImages
                        );
                      }}
                      className="w-full rounded border border-[#8c8f94] bg-white px-2.5 py-1.5 text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const next = [...selectedMediaProduct.images];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        onUpdateProductCarousel(
                          selectedMediaProduct.id,
                          next,
                          selectedMediaProduct.maxCarouselImages
                        );
                      }}
                      className="p-2 rounded border border-[#c3c4c7] bg-white hover:bg-[#f0f0f1] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === selectedMediaProduct.images.length - 1}
                      onClick={() => {
                        const next = [...selectedMediaProduct.images];
                        [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                        onUpdateProductCarousel(
                          selectedMediaProduct.id,
                          next,
                          selectedMediaProduct.maxCarouselImages
                        );
                      }}
                      className="p-2 rounded border border-[#c3c4c7] bg-white hover:bg-[#f0f0f1] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = selectedMediaProduct.images.filter((_, i) => i !== idx);
                        onUpdateProductCarousel(
                          selectedMediaProduct.id,
                          next,
                          selectedMediaProduct.maxCarouselImages
                        );
                      }}
                      className="p-2 rounded border border-[#d63638] text-[#d63638] bg-white hover:bg-[#d63638] hover:text-white transition cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}

            {/* دکمه پاک کردن تمام عکس‌ها */}
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  onUpdateProductCarousel(
                    selectedMediaProduct.id,
                    [],
                    selectedMediaProduct.maxCarouselImages
                  );
                }}
                className="inline-flex items-center gap-1.5 rounded border border-[#d63638] bg-[#fcf0f1] px-3 py-1.5 text-xs font-bold text-[#d63638] hover:bg-[#d63638] hover:text-white transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                حذف تمام عکس‌های این محصول
              </button>
            </div>
          </div>
        )}

        {/* افزودن تصویر جدید با آدرس اینترنتی یا فایل دستگاه */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-[#f0f0f1]">
          <input
            type="text"
            dir="ltr"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="وارد کردن لینک عکس جدید برای کاروسل..."
            className="flex-1 min-w-[220px] rounded border border-[#8c8f94] px-3 py-2 text-xs font-mono"
          />
          <button
            type="button"
            onClick={() => {
              if (!newImageUrl.trim()) return;
              const next = [...selectedMediaProduct.images, newImageUrl.trim()];
              onUpdateProductCarousel(
                selectedMediaProduct.id,
                next,
                Math.max(selectedMediaProduct.maxCarouselImages, next.length)
              );
              setNewImageUrl('');
            }}
            className="rounded bg-[#2271b1] px-4 py-2 text-xs font-bold text-white hover:bg-[#135e96] cursor-pointer"
          >
            + افزودن لینک به کاروسل
          </button>
          <label className="inline-flex items-center gap-1.5 rounded border border-[#2271b1] bg-[#f0f6fc] px-4 py-2 text-xs font-bold text-[#2271b1] cursor-pointer hover:bg-[#2271b1] hover:text-white transition">
            <Upload className="w-4 h-4" />
            آپلود عکس از سیستم
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* انتخاب سریع از پیش‌فرض‌های لوازم خانگی */}
        <div className="pt-2">
          <p className="text-xs font-bold text-[#50575e] mb-2">
            یا انتخاب با یک کلیک از گالری استودیویی آلِرضا:
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {PRESET_APPLIANCE_GALLERY.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  const next = [...selectedMediaProduct.images, item.url];
                  onUpdateProductCarousel(
                    selectedMediaProduct.id,
                    next,
                    Math.max(selectedMediaProduct.maxCarouselImages, next.length)
                  );
                }}
                className="group relative aspect-video rounded border border-[#c3c4c7] overflow-hidden hover:border-[#2271b1] cursor-pointer"
              >
                <img src={resolveAssetUrl(item.url)} alt={item.label} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white transition">
                  + افزودن به کاروسل
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
