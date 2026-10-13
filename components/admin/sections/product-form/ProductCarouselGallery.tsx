'use client';

import React, { useState } from 'react';
import { Images, ArrowUp, ArrowDown, Trash2, Upload } from 'lucide-react';
import {
  Product,
  PRESET_APPLIANCE_GALLERY,
  toPersianDigits,
  resolveAssetUrl,
} from '@/lib/store-data';
import { compressImageFile } from '@/lib/image-utils';

interface ProductCarouselGalleryProps {
  product: Product;
  onChange: (updated: Product) => void;
}

/**
 * گالری تصاویر محصول در فرم ادمین، شامل تغییر چیدمان، حذف و افزودن تصویر از سیستم یا کتابخانه
 */
export function ProductCarouselGallery({ product, onChange }: ProductCarouselGalleryProps) {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, (dataUrl) => {
      const next = [...product.images, dataUrl];
      onChange({
        ...product,
        images: next,
        maxCarouselImages: Math.max(product.maxCarouselImages, next.length),
      });
    });
    e.target.value = '';
  };

  return (
    <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden">
      <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Images className="w-4 h-4 text-[#2271b1]" />
          <span className="text-xs font-bold text-[#1d2327]">
            گالری کاروسل تصاویر محصول
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#1d2327]">
            تعداد عکس در کاروسل:
          </span>
          <input
            type="number"
            min={1}
            max={20}
            value={product.maxCarouselImages}
            onChange={(e) =>
              onChange({
                ...product,
                maxCarouselImages: Math.max(1, Number(e.target.value)),
              })
            }
            className="w-16 rounded border border-[#2271b1] px-2 py-1 text-center text-xs font-bold text-[#2271b1]"
          />
        </div>
      </div>

      <div className="p-4 space-y-4">
        {product.images.length > 0 ? (
          <div className="space-y-2">
            {product.images.map((imgUrl, idx) => {
              const activeInCarousel = idx < product.maxCarouselImages;
              return (
                <div
                  key={idx}
                  className={`flex flex-wrap sm:flex-nowrap items-center gap-3 p-2.5 rounded border ${
                    activeInCarousel
                      ? 'bg-[#f6f7f7] border-[#c3c4c7]'
                      : 'bg-gray-50 border-dashed border-gray-300 opacity-60'
                  }`}
                >
                  <img
                    src={resolveAssetUrl(imgUrl)}
                    alt=""
                    className="h-12 w-16 rounded object-cover border border-[#c3c4c7] shrink-0"
                  />
                  <div className="flex-1 min-w-[180px]">
                    <div className="flex items-center gap-2 text-[11px] font-bold mb-1">
                      <span>اسلاید #{toPersianDigits(idx + 1)}</span>
                      {!activeInCarousel && (
                        <span className="text-[#d63638]">
                          (خارج از سقف {toPersianDigits(product.maxCarouselImages)} عکس)
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      dir="ltr"
                      value={imgUrl}
                      onChange={(e) => {
                        const next = [...product.images];
                        next[idx] = e.target.value;
                        onChange({ ...product, images: next });
                      }}
                      className="w-full rounded border border-[#8c8f94] bg-white px-2.5 py-1 text-xs font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => {
                        const next = [...product.images];
                        [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                        onChange({ ...product, images: next });
                      }}
                      className="p-1.5 rounded border border-[#c3c4c7] bg-white hover:bg-[#f0f0f1] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === product.images.length - 1}
                      onClick={() => {
                        const next = [...product.images];
                        [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                        onChange({ ...product, images: next });
                      }}
                      className="p-1.5 rounded border border-[#c3c4c7] bg-white hover:bg-[#f0f0f1] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = product.images.filter((_, i) => i !== idx);
                        onChange({ ...product, images: next });
                      }}
                      title="حذف این تصویر"
                      className="p-1.5 rounded border border-[#d63638] text-[#d63638] bg-white hover:bg-[#d63638] hover:text-white transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-4 rounded border border-dashed border-[#c3c4c7] bg-[#f9f9f9] text-center space-y-2">
            <p className="text-xs font-bold text-[#1d2327]">
              این محصول هیچ تصویری ندارد (حالت بدون عکس)
            </p>
            <p className="text-[11px] text-[#50575e]">
              در سایت نماد اختصاصی و استاندارد «فاقد عکس» نمایش داده می‌شود.
            </p>
          </div>
        )}

        {/* پاکسازی تمام عکس‌ها */}
        {product.images.length > 0 && (
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={() => onChange({ ...product, images: [] })}
              className="inline-flex items-center gap-1.5 rounded border border-[#d63638] bg-[#fcf0f1] px-3 py-1.5 text-xs font-bold text-[#d63638] hover:bg-[#d63638] hover:text-white transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              حذف تمام عکس‌های این محصول
            </button>
          </div>
        )}

        {/* افزودن عکس با لینک یا آپلود */}
        <div className="flex flex-wrap gap-2 pt-2">
          <input
            type="text"
            dir="ltr"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            placeholder="آدرس اینترنتی یا مسیر عکس جدید..."
            className="flex-1 min-w-[200px] rounded border border-[#8c8f94] bg-white px-3 py-1.5 text-xs font-mono"
          />
          <button
            type="button"
            onClick={() => {
              if (!newImageUrl.trim()) return;
              const next = [...product.images, newImageUrl.trim()];
              onChange({
                ...product,
                images: next,
                maxCarouselImages: Math.max(product.maxCarouselImages, next.length),
              });
              setNewImageUrl('');
            }}
            className="rounded bg-[#2271b1] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#135e96] cursor-pointer"
          >
            افزودن آدرس تصویر
          </button>
          <label className="inline-flex items-center gap-1.5 rounded border border-[#2271b1] bg-[#f0f6fc] px-3.5 py-1.5 text-xs font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white cursor-pointer transition">
            <Upload className="w-3.5 h-3.5" />
            آپلود از سیستم
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>
        </div>

        {/* کتابخانه پیش‌فرض */}
        <div className="pt-2 border-t border-[#f0f0f1]">
          <p className="text-[11px] font-bold text-[#50575e] mb-2">
            افزودن سریع از کتابخانه رسانه آلِرضا:
          </p>
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {PRESET_APPLIANCE_GALLERY.map((g, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  const next = [...product.images, g.url];
                  onChange({
                    ...product,
                    images: next,
                    maxCarouselImages: Math.max(product.maxCarouselImages, next.length),
                  });
                }}
                className="h-14 w-20 rounded border border-[#c3c4c7] overflow-hidden shrink-0 hover:border-[#2271b1] cursor-pointer"
                title={g.label}
              >
                <img src={resolveAssetUrl(g.url)} alt={g.label} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
