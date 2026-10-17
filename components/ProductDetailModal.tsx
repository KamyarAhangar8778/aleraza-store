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
  cacheImageResource,
} from '@/lib/store-data';
import { useStore } from './StoreProvider';
import { ProductImagePlaceholder } from './ProductImagePlaceholder';
import { Toman } from './TomanIcon';
import { WarrantyIcon } from './WarrantyIcon';

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
  const { addToCart, currentUser } = useStore();
  const [activeSlide, setActiveSlide] = useState(0);

  if (!product) return null;

  const validImages = (product.images || []).filter((img) => img && img.trim().length > 0);
  const hasImages = validImages.length > 0;
  const visibleImages = hasImages
    ? validImages.slice(0, Math.max(1, product.maxCarouselImages || validImages.length))
    : [];

  const safeSlide = visibleImages.length > 0 && activeSlide < visibleImages.length ? activeSlide : 0;
  const discountPercent = product.isDiscounted
    ? calcDiscountPercent(product.price, product.discountedPrice)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/65 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] sm:max-h-none rounded-t-3xl sm:rounded-3xl bg-[#FAF7F2] border-t sm:border border-[#E6DFD3] shadow-2xl overflow-y-auto sm:overflow-hidden grid grid-cols-1 md:grid-cols-12">
        {/* دستگیره لمسی کششی در نمای موبایل */}
        <div className="col-span-1 py-1.5 sm:hidden flex justify-center">
          <div className="w-12 h-1.5 bg-[#DCD4C6] rounded-full" />
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="بستن پنجره"
          className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 rounded-full bg-[#181615]/80 p-2 text-white hover:bg-[#C85A32] transition min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Right Side: Interactive Product Image Carousel */}
        <div className="md:col-span-6 bg-[#F3EFE6] p-3.5 sm:p-5 flex flex-col justify-between">
          <div className="relative aspect-[4/3] sm:aspect-square w-full rounded-2xl overflow-hidden bg-white border border-[#E6DFD3]">
            {hasImages ? (
              <>
                {visibleImages.map((imgUrl, idx) => (
                  <img
                    key={`${product.id}-modal-slide-${idx}`}
                    src={resolveAssetUrl(imgUrl)}
                    alt={`${product.title} - تصویر ${idx + 1}`}
                    loading="lazy"
                    decoding="async"
                    onLoad={() => cacheImageResource(imgUrl)}
                    className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-200 ${
                      idx === safeSlide ? 'opacity-100 z-[1]' : 'opacity-0 pointer-events-none z-0'
                    }`}
                  />
                ))}

                <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 flex items-center gap-1.5 z-10">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-black/65 backdrop-blur-md px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-medium text-white">
                    <Images className="w-3.5 h-3.5 text-[#E59872]" />
                    {toPersianDigits(safeSlide + 1)} از {toPersianDigits(visibleImages.length)}
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
                      className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-[#181615] shadow hover:bg-[#C85A32] hover:text-white transition"
                    >
                      <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setActiveSlide((prev) => (prev + 1) % visibleImages.length)
                      }
                      className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 z-10 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-[#181615] shadow hover:bg-[#C85A32] hover:text-white transition"
                    >
                      <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <ProductImagePlaceholder className="h-full w-full" title={product.title} />
            )}
          </div>

          {/* Thumbnails */}
          {hasImages && visibleImages.length > 1 && (
            <div className="mt-2.5 sm:mt-4 flex items-center gap-2 overflow-x-auto pb-1">
              {visibleImages.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveSlide(i)}
                  className={`h-12 w-16 sm:h-16 sm:w-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition ${
                    i === safeSlide
                      ? 'border-[#C85A32] scale-105 shadow-sm'
                      : 'border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <img
                    src={resolveAssetUrl(img)}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    onLoad={() => cacheImageResource(img)}
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Left Side: Details & Purchase */}
        <div className="md:col-span-6 p-4 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <span className="rounded-lg bg-[#C85A32]/15 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-bold text-[#C85A32]">
                {category ? category.name : 'قطعات لوازم خانگی آل رضا'}
              </span>
              {product.badge && (
                <span className="inline-flex items-center rounded-lg bg-[#181615] px-2.5 py-0.5 sm:py-1 text-[11px] sm:text-xs font-bold text-white shadow-xs">
                  {product.badge}
                </span>
              )}
              {product.isDiscounted && discountPercent > 0 && (
                <span className="inline-flex items-center gap-1 rounded-lg bg-[#D92D20] px-2 py-0.5 sm:px-2.5 sm:py-1 text-[11px] sm:text-xs font-bold text-white">
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  {toPersianDigits(discountPercent)}٪ تخفیف ویژه
                </span>
              )}
            </div>

            <h2 className="text-lg sm:text-2xl font-extrabold text-[#181615] leading-snug">
              {product.title}
            </h2>
            <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-[#6E675F] leading-relaxed">
              {product.subtitle}
            </p>

            {/* Warranty */}
            {product.warranty && (
              <div className="mt-3 sm:mt-4 flex items-center gap-2 rounded-xl bg-[#1F6E58]/10 border border-[#1F6E58]/25 px-3 py-2 sm:px-3.5 sm:py-2.5 text-xs font-bold text-[#1F6E58]">
                <WarrantyIcon iconName={product.warrantyIcon} className="w-4 h-4 flex-shrink-0 text-[#1F6E58]" />
                <span>{product.warranty}</span>
              </div>
            )}

            {/* Technical Specs List */}
            {product.features && product.features.length > 0 && (
              <div className="mt-4 sm:mt-5 space-y-1.5 sm:space-y-2">
                <h4 className="text-xs font-extrabold text-[#181615]">
                  مشخصات و ویژگی‌های برجسته:
                </h4>
                <ul className="space-y-1 sm:space-y-1.5">
                  {product.features.map((f, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#4A453F]"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#C85A32] flex-shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sticky Purchase Action Bar */}
          <div className="mt-5 sm:mt-6 pt-3 sm:pt-4 border-t border-[#E6DFD3] space-y-3 sticky bottom-0 bg-[#FAF7F2]/95 backdrop-blur-md pb-3 sm:pb-0">
            {/* مقایسه قیمت معمولی و قیمت همکاری/عمده */}
            <div className="space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-bold text-[#6E675F]">قیمت معمولی:</span>
                {product.isDiscounted && product.discountedPrice < product.price ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8C837A] line-through">
                      {formatToman(product.price)}
                    </span>
                    <span className="text-sm sm:text-lg font-black text-[#D92D20]">
                      {formatToman(product.discountedPrice)}
                    </span>
                    <Toman className="text-xs text-[#8C837A]" />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm sm:text-lg font-black text-[#181615]">
                      {formatToman(product.price)}
                    </span>
                    <Toman className="text-xs text-[#8C837A]" />
                  </div>
                )}
              </div>

              {product.wholesalePrice && product.wholesalePrice > 0 ? (
                <div
                  className={`p-3 rounded-2xl transition ${
                    currentUser
                      ? 'bg-[#1F6E58]/10 border border-[#1F6E58]/30 text-[#1F6E58]'
                      : 'bg-[#F3EFE6] border border-[#E6DFD3] text-[#504C46]'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 font-bold text-xs sm:text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-current shrink-0" />
                      <span>قیمت همکاری یا قیمت عمده:</span>
                    </span>
                    <div className="flex items-center gap-1 font-black text-base sm:text-lg">
                      <span>{formatToman(product.wholesalePrice)}</span>
                      <Toman className="text-xs text-current" />
                    </div>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] opacity-90">
                    <span>
                      برای تعداد بالای{' '}
                      <strong className="underline decoration-current">
                        {toPersianDigits(product.wholesaleMinQty || 5)} عدد
                      </strong>
                    </span>
                    {currentUser ? (
                      <span className="font-extrabold text-[#1F6E58] bg-[#1F6E58]/15 px-2 py-0.5 rounded-md text-[10px]">
                        فعال برای حساب شما
                      </span>
                    ) : (
                      <span className="text-[#C85A32] font-bold text-[10px]">
                        ویژه مشتریان عضو آلِرضا
                      </span>
                    )}
                  </div>
                </div>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => {
                addToCart(product);
                onClose();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-[#181615] py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-white shadow-lg hover:bg-[#C85A32] active:scale-98 transition cursor-pointer min-h-[46px]"
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
