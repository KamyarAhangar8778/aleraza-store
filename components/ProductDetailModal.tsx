'use client';

import React, { useState } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Images,
} from 'lucide-react';
import {
  Product,
  Category,
  formatToman,
  toPersianDigits,
  calcDiscountPercent,
  resolveAssetUrl,
} from '@/lib/store-data';
import { useStore } from './StoreProvider';

interface ProductDetailModalProps {
  product: Product | null;
  category?: Category;
  onClose: () => void;
}

export function ProductDetailModal({
  product,
  category,
  onClose,
}: ProductDetailModalProps) {
  const { addToCart } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

  if (!product) return null;

  const visibleImages =
    product.images && product.images.length > 0
      ? product.images.slice(0, Math.max(1, product.maxCarouselImages || product.images.length))
      : ['/images/aleraza_hero_kitchen.jpg'];

  const safeSlide = activeSlide >= visibleImages.length ? 0 : activeSlide;
  const discountPercent = product.isDiscounted
    ? calcDiscountPercent(product.price, product.discountedPrice)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#FAF7F2] border border-[#E6DFD3] shadow-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 z-20 rounded-full bg-[#181615]/80 p-2 text-white hover:bg-[#C85A32] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Right Side: Interactive Product Image Carousel */}
        <div className="md:col-span-6 bg-[#F3EFE6] p-5 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#E6DFD3]">
            {visibleImages.map((imgUrl, idx) => (
              <img
                key={`${product.id}-modal-slide-${idx}`}
                src={resolveAssetUrl(imgUrl)}
                alt={`${product.title} - تصویر ${idx + 1}`}
                loading="eager"
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
                  idx === safeSlide ? 'opacity-100 z-[1]' : 'opacity-0 pointer-events-none z-0'
                }`}
              />
            ))}

            <div className="absolute top-3 right-3 flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-lg bg-black/65 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-white">
                <Images className="w-3.5 h-3.5 text-[#E59872]" />
                تصویر {toPersianDigits(safeSlide + 1)} از {toPersianDigits(visibleImages.length)}
              </span>
            </div>

            {visibleImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide(
                      (prev) => (prev - 1 + visibleImages.length) % visibleImages.length
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#181615] shadow hover:bg-[#C85A32] hover:text-white transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveSlide((prev) => (prev + 1) % visibleImages.length)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#181615] shadow hover:bg-[#C85A32] hover:text-white transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1">
            {visibleImages.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveSlide(i)}
                className={`h-16 w-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                  i === safeSlide
                    ? 'border-[#C85A32] scale-105 shadow-sm'
                    : 'border-transparent opacity-65 hover:opacity-100'
                }`}
              >
                <img src={resolveAssetUrl(img)} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Left Side: Details & Purchase */}
        <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="rounded-lg bg-[#C85A32]/15 px-2.5 py-1 text-xs font-bold text-[#C85A32]">
                {category ? category.name : 'لوازم خانگی آلِرضا'}
              </span>
              {product.isDiscounted && discountPercent > 0 && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#D92D20] px-2.5 py-1 text-xs font-bold text-white">
                  <Sparkles className="w-3.5 h-3.5" />
                  {toPersianDigits(discountPercent)}٪ تخفیف ویژه
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-[#181615] leading-snug">
              {product.title}
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6E675F] leading-relaxed">
              {product.subtitle}
            </p>

            {/* Warranty */}
            <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#1F6E58]/10 border border-[#1F6E58]/25 px-3.5 py-2.5 text-xs font-bold text-[#1F6E58]">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>{product.warranty}</span>
            </div>

            {/* Technical Specs List */}
            {product.features && product.features.length > 0 && (
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-extrabold text-[#181615]">
                  مشخصات و ویژگی‌های برجسته:
                </h4>
                <ul className="space-y-1.5">
                  {product.features.map((f, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#4A453F]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C85A32] flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-8 pt-5 border-t border-[#E6DFD3] space-y-4">
            <div>
              {product.isDiscounted && product.discountedPrice < product.price ? (
                <>
                  <div className="text-xs text-[#8C837A] line-through">
                    قیمت قبل از تخفیف: {formatToman(product.price)} تومان
                  </div>
                  <div className="text-2xl font-black text-[#D92D20] mt-0.5">
                    {formatToman(product.discountedPrice)}{' '}
                    <span className="text-xs font-bold text-[#181615]">تومان</span>
                  </div>
                </>
              ) : (
                <div className="text-2xl font-black text-[#181615]">
                  {formatToman(product.price)}{' '}
                  <span className="text-xs font-bold text-[#6E675F]">تومان</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#181615] py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#C85A32] transition"
            >
              <ShoppingBag className="w-4 h-4" />
              افزودن به سبد خرید آلِرضا
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
