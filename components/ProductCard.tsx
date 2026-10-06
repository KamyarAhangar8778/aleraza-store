'use client';

import React, { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Images,
  SlidersHorizontal,
  Eye,
} from 'lucide-react';
import {
  Product,
  Category,
  formatToman,
  toPersianDigits,
  calcDiscountPercent,
  resolveAssetUrl,
  cacheImageResource,
} from '@/lib/store-data';
import { useStore } from './StoreProvider';

interface ProductCardProps {
  product: Product;
  category?: Category;
  isFeaturedDiscount?: boolean;
  onSelectProduct: (product: Product) => void;
  onAdminEditProduct?: (product: Product) => void;
}

export function ProductCard({
  product,
  category,
  isFeaturedDiscount = false,
  onSelectProduct,
  onAdminEditProduct,
}: ProductCardProps) {
  const { addToCart, currentUser } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

  // Slice images according to maxCarouselImages configured by admin
  const visibleImages =
    product.images && product.images.length > 0
      ? product.images.slice(0, Math.max(1, product.maxCarouselImages || product.images.length))
      : ['/images/aleraza_hero_kitchen.jpg'];

  const safeSlideIndex = activeSlide >= visibleImages.length ? 0 : activeSlide;
  const discountPercent = product.isDiscounted
    ? calcDiscountPercent(product.price, product.discountedPrice)
    : 0;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev - 1 + visibleImages.length) % visibleImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveSlide((prev) => (prev + 1) % visibleImages.length);
  };

  return (
    <div
      className={`group relative flex flex-col rounded-2xl transition-all duration-300 overflow-hidden border ${
        isFeaturedDiscount
          ? 'bg-[#FFFFFF] border-[#C85A32]/30 shadow-[0_14px_34px_-12px_rgba(200,90,50,0.14)] hover:shadow-[0_20px_42px_-12px_rgba(200,90,50,0.24)]'
          : 'bg-[#FFFFFF] border-[#E6DFD3] shadow-[0_8px_24px_-12px_rgba(24,22,21,0.07)] hover:border-[#C85A32]/40 hover:shadow-[0_16px_36px_-12px_rgba(24,22,21,0.13)]'
      }`}
    >
      {/* Multi-Image Interactive Carousel Area (Lazy loaded & automatically cached on view) */}
      <div className="relative aspect-[4/3] w-full bg-[#F3EFE6] overflow-hidden select-none">
        {visibleImages.map((imgUrl, idx) => (
          <img
            key={`${product.id}-slide-${idx}`}
            src={resolveAssetUrl(imgUrl)}
            alt={`${product.title} - تصویر ${idx + 1}`}
            loading="lazy"
            decoding="async"
            onLoad={() => cacheImageResource(imgUrl)}
            onClick={() => onSelectProduct(product)}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-300 group-hover:scale-105 cursor-pointer ${
              idx === safeSlideIndex
                ? 'opacity-100 z-[1]'
                : 'opacity-0 pointer-events-none z-0'
            }`}
          />
        ))}

        {/* Subtle gradient overlay at bottom for carousel controls */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 via-black/15 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 inset-x-3 flex items-start justify-between gap-2 z-10">
          <div className="flex flex-wrap items-center gap-1.5">
            {product.isDiscounted && discountPercent > 0 && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-[#D92D20] px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                <Sparkles className="w-3.5 h-3.5" />
                {toPersianDigits(discountPercent)}٪ تخفیف ویژه
              </span>
            )}
            {product.badge && (
              <span className="inline-flex items-center rounded-lg bg-[#181615]/85 backdrop-blur-md px-2.5 py-1 text-xs font-medium text-[#FAF7F2]">
                {product.badge}
              </span>
            )}
          </div>

          {/* Image Count Indicator */}
          <span
            title="تعداد تصاویر فعال در کاروسل این محصول"
            className="inline-flex items-center gap-1 rounded-lg bg-black/60 backdrop-blur-md px-2 py-1 text-[11px] font-medium text-white"
          >
            <Images className="w-3.5 h-3.5 text-[#E59872]" />
            {toPersianDigits(safeSlideIndex + 1)} از {toPersianDigits(visibleImages.length)}
          </span>
        </div>

        {/* Next / Prev Carousel Buttons (when > 1 image) */}
        {visibleImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="تصویر قبلی"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#181615] shadow-md transition hover:bg-[#C85A32] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="تصویر بعدی"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-[#181615] shadow-md transition hover:bg-[#C85A32] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Carousel Thumbnails / Dots Bar */}
        <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            {visibleImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(idx);
                }}
                aria-label={`نمایش تصویر ${idx + 1}`}
                className={`h-2 rounded-full transition-all ${
                  idx === safeSlideIndex
                    ? 'w-6 bg-[#C85A32]'
                    : 'w-2 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            {currentUser?.role === 'admin' && onAdminEditProduct && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdminEditProduct(product);
                }}
                className="inline-flex items-center gap-1 rounded-md bg-[#C85A32] px-2 py-1 text-[11px] font-medium text-white shadow hover:bg-[#B04B25] transition"
              >
                <SlidersHorizontal className="w-3 h-3" />
                ویرایش کاروسل و قیمت
              </button>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-1 text-[11px] font-medium text-[#181615] shadow hover:bg-white transition"
            >
              <Eye className="w-3 h-3" />
              بزرگ‌نمایی
            </button>
          </div>
        </div>
      </div>

      {/* Mini Thumbnail Strip under Main Carousel Image */}
      {visibleImages.length > 1 && (
        <div className="flex items-center gap-1.5 px-4 pt-3 pb-1 overflow-x-auto no-scrollbar">
          {visibleImages.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveSlide(idx)}
              className={`relative h-11 w-14 flex-shrink-0 rounded-lg overflow-hidden border-2 transition ${
                idx === safeSlideIndex
                  ? 'border-[#C85A32] ring-1 ring-[#C85A32]/40'
                  : 'border-transparent opacity-65 hover:opacity-100'
              }`}
            >
              <img
                src={resolveAssetUrl(imgUrl)}
                alt=""
                loading="lazy"
                decoding="async"
                onLoad={() => cacheImageResource(imgUrl)}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5 pt-3">
        <div>
          {/* Category & Warranty */}
          <div className="flex items-center justify-between gap-2 text-xs text-[#6E675F] mb-2">
            <span className="font-medium text-[#C85A32]">
              {category ? category.name : 'کلکسیون آلِرضا'}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-[#1F6E58] bg-[#1F6E58]/10 px-2 py-0.5 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              {product.warranty.split('+')[0]}
            </span>
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-base font-bold text-[#181615] leading-snug line-clamp-2 hover:text-[#C85A32] transition cursor-pointer"
          >
            {product.title}
          </h3>

          {/* Subtitle / Technical Specs */}
          <p className="mt-1.5 text-xs text-[#6E675F] leading-relaxed line-clamp-2">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing & Action Footer */}
        <div className="mt-5 pt-4 border-t border-[#EFECE6] flex items-end justify-between gap-3">
          <div>
            {product.isDiscounted && product.discountedPrice < product.price ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#8C837A] line-through">
                    {formatToman(product.price)}
                  </span>
                  <span className="text-[11px] font-bold text-[#D92D20] bg-[#D92D20]/10 px-1.5 py-0.5 rounded">
                    {toPersianDigits(discountPercent)}٪-
                  </span>
                </div>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-[#181615] tracking-tight">
                    {formatToman(product.discountedPrice)}
                  </span>
                  <span className="text-xs font-medium text-[#6E675F]">تومان</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col">
                <span className="text-[11px] text-[#6E675F]">قیمت مصرف‌کننده:</span>
                <div className="mt-0.5 flex items-baseline gap-1">
                  <span className="text-xl font-extrabold text-[#181615] tracking-tight">
                    {formatToman(product.price)}
                  </span>
                  <span className="text-xs font-medium text-[#6E675F]">تومان</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => addToCart(product)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#181615] px-4 py-2.5 text-xs font-bold text-[#FAF7F2] shadow-sm transition hover:bg-[#C85A32] active:scale-95"
          >
            <ShoppingBag className="w-4 h-4" />
            افزودن به سبد
          </button>
        </div>
      </div>
    </div>
  );
}
