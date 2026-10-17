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
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import { Toman } from './TomanIcon';
import { WarrantyIcon } from './WarrantyIcon';

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

  // Filter valid image URLs and check if product has real images
  const validImages = (product.images || []).filter((img) => img && img.trim().length > 0);
  const hasImages = validImages.length > 0;
  const visibleImages = hasImages
    ? validImages.slice(0, Math.max(1, product.maxCarouselImages || validImages.length))
    : [];

  const safeSlideIndex = visibleImages.length > 0 && activeSlide < visibleImages.length ? activeSlide : 0;
  const discountPercent = product.isDiscounted
    ? calcDiscountPercent(product.price, product.discountedPrice)
    : 0;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (visibleImages.length <= 1) return;
    setActiveSlide((prev) => (prev - 1 + visibleImages.length) % visibleImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (visibleImages.length <= 1) return;
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
        {hasImages ? (
          <>
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
          </>
        ) : (
          /* Geometric Fallback Emblem when Product Has No Image */
          <ProductImagePlaceholder
            className="h-full w-full"
            title={product.title}
            onClick={() => onSelectProduct(product)}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2 sm:top-3 inset-x-2 sm:inset-x-3 flex items-start justify-between gap-1.5 z-10">
          <div className="flex flex-wrap items-center gap-1">
            {product.isDiscounted && discountPercent > 0 && (
              <span className="inline-flex items-center gap-1 rounded-md sm:rounded-lg bg-[#D92D20] px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-xs font-bold text-white shadow-sm">
                <Sparkles className="w-3 h-3" />
                <span>{toPersianDigits(discountPercent)}٪</span>
                <span className="hidden sm:inline">تخفیف ویژه</span>
              </span>
            )}
            {product.badge && (
              <span className="inline-flex items-center rounded-md sm:rounded-lg bg-[#181615]/85 backdrop-blur-md px-2 py-0.5 text-[10px] sm:text-xs font-bold text-[#FAF7F2] shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Image Count Indicator or No-Image Indicator */}
          {hasImages ? (
            <span
              title="تعداد تصاویر فعال در کاروسل این محصول"
              className="inline-flex items-center gap-0.5 sm:gap-1 rounded-md sm:rounded-lg bg-black/60 backdrop-blur-md px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium text-white"
            >
              <Images className="w-3 h-3 text-[#E59872]" />
              <span>{toPersianDigits(safeSlideIndex + 1)}/{toPersianDigits(visibleImages.length)}</span>
            </span>
          ) : (
            <span
              title="برای این کالا هنوز تصویری ثبت نشده است"
              className="inline-flex items-center gap-1 rounded-md bg-[#C85A32]/85 backdrop-blur-md px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-white shadow-xs"
            >
              بدون عکس
            </span>
          )}
        </div>

        {/* Next / Prev Carousel Buttons (when > 1 image) */}
        {hasImages && visibleImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              aria-label="تصویر قبلی"
              className="absolute right-1.5 sm:right-2.5 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/90 text-[#181615] shadow-md transition hover:bg-[#C85A32] hover:text-white"
            >
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label="تصویر بعدی"
              className="absolute left-1.5 sm:left-2.5 top-1/2 -translate-y-1/2 z-10 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-white/90 text-[#181615] shadow-md transition hover:bg-[#C85A32] hover:text-white"
            >
              <ChevronLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          </>
        )}

        {/* Carousel Thumbnails / Dots Bar */}
        <div className="absolute bottom-2 sm:bottom-2.5 inset-x-2 sm:inset-x-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-1">
            {visibleImages.map((imgUrl, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSlide(idx);
                }}
                aria-label={`نمایش تصویر ${idx + 1}`}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  idx === safeSlideIndex
                    ? 'w-4 sm:w-6 bg-[#C85A32]'
                    : 'w-1.5 sm:w-2 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1 sm:gap-1.5">
            {currentUser?.role === 'admin' && (
              <a
                href="/admin"
                onClick={(e) => {
                  if (onAdminEditProduct) {
                    e.preventDefault();
                    e.stopPropagation();
                    onAdminEditProduct(product);
                  }
                }}
                className="hidden sm:inline-flex items-center gap-1 rounded-md bg-[#C85A32] px-2 py-1 text-[11px] font-bold text-white shadow hover:bg-[#B04B25] transition"
              >
                <SlidersHorizontal className="w-3 h-3" />
                ویرایش
              </a>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelectProduct(product);
              }}
              className="inline-flex items-center gap-1 rounded-md bg-white/90 px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium text-[#181615] shadow hover:bg-white transition"
            >
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">بزرگ‌نمایی</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mini Thumbnail Strip under Main Carousel Image (Visible on tablet/desktop) */}
      {hasImages && visibleImages.length > 1 && (
        <div className="hidden sm:flex items-center gap-1.5 px-4 pt-3 pb-1 overflow-x-auto no-scrollbar">
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
      <div className="flex flex-1 flex-col justify-between p-3 sm:p-5 pt-2 sm:pt-3">
        <div>
          {/* Category & Warranty */}
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-xs text-[#6E675F] mb-1.5 sm:mb-2">
            <span className="font-bold text-[#C85A32] truncate">
              {category ? category.name : 'آلِرضا'}
            </span>
            {product.warranty && (
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] text-[#1F6E58] bg-[#1F6E58]/10 px-1.5 py-0.5 rounded shrink-0">
                <WarrantyIcon iconName={product.warrantyIcon} className="w-3 h-3 text-[#1F6E58]" />
                <span className="truncate max-w-[80px] sm:max-w-none">{product.warranty.split('+')[0]}</span>
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-xs sm:text-base font-bold text-[#181615] leading-snug line-clamp-2 hover:text-[#C85A32] transition cursor-pointer min-h-[2rem] sm:min-h-[2.5rem]"
          >
            {product.title}
          </h3>

          {/* Subtitle / Technical Specs */}
          <p className="mt-1 text-[10px] sm:text-xs text-[#6E675F] leading-relaxed line-clamp-1 sm:line-clamp-2">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing & Action Footer */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-[#EFECE6] space-y-2">
          {/* قیمت معمولی */}
          <div className="flex items-baseline justify-between gap-1.5">
            <span className="text-[10px] sm:text-xs font-bold text-[#6E675F]">قیمت معمولی:</span>
            {product.isDiscounted && product.discountedPrice < product.price ? (
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-[#8C837A] line-through">
                  {formatToman(product.price)}
                </span>
                <span className="text-[9px] font-bold text-[#D92D20] bg-[#D92D20]/10 px-1 py-0.2 rounded">
                  {toPersianDigits(discountPercent)}٪-
                </span>
                <div className="flex items-center gap-0.5">
                  <span className="text-xs sm:text-base font-black text-[#181615] tracking-tight">
                    {formatToman(product.discountedPrice)}
                  </span>
                  <Toman className="text-[9px] text-[#8C837A]" />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-0.5">
                <span className="text-xs sm:text-base font-black text-[#181615] tracking-tight">
                  {formatToman(product.price)}
                </span>
                <Toman className="text-[9px] text-[#8C837A]" />
              </div>
            )}
          </div>

          {/* قیمت همکاری یا عمده برای تعداد بالای X تا */}
          {product.wholesalePrice && product.wholesalePrice > 0 ? (
            <div
              className={`p-2 rounded-xl text-[10px] sm:text-[11px] transition ${
                currentUser
                  ? 'bg-[#1F6E58]/10 border border-[#1F6E58]/25 text-[#1F6E58]'
                  : 'bg-[#F3EFE6] border border-[#E6DFD3] text-[#6E675F]'
              }`}
            >
              <div className="flex items-center justify-between gap-1 font-bold">
                <span className="flex items-center gap-1 truncate">
                  <span className="h-1.5 w-1.5 rounded-full bg-current shrink-0" />
                  <span>قیمت همکاری / عمده:</span>
                </span>
                <div className="flex items-center gap-0.5 shrink-0 font-black">
                  <span>{formatToman(product.wholesalePrice)}</span>
                  <Toman className="text-[9px] text-current" />
                </div>
              </div>
              <div className="mt-0.5 flex items-center justify-between text-[9px] sm:text-[10px] opacity-90">
                <span>برای تعداد بالای {toPersianDigits(product.wholesaleMinQty || 5)} عدد</span>
                {currentUser ? (
                  <span className="font-extrabold text-[#1F6E58] bg-[#1F6E58]/15 px-1.5 py-0.2 rounded">
                    فعال برای شما
                  </span>
                ) : (
                  <span className="text-[#C85A32] font-semibold">ویژه مشتریان عضو</span>
                )}
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => addToCart(product)}
            className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#181615] px-2.5 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-bold text-[#FAF7F2] shadow-sm transition hover:bg-[#C85A32] active:scale-95 min-h-[38px] cursor-pointer"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>افزودن به سبد خرید</span>
          </button>
        </div>
      </div>
    </div>
  );
}
