'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Category, Product, toPersianDigits } from '@/lib/store-data';
import { ProductCard } from '@/components/ProductCard';

interface SpecialOffersSectionProps {
  discountedProducts: Product[];
  categories: Category[];
  onSelectProduct: (product: Product) => void;
}

/**
 * بخش نمایش محصولات تخفیف‌دار و ویژه در بالای صفحه
 */
export function SpecialOffersSection({
  discountedProducts,
  categories,
  onSelectProduct,
}: SpecialOffersSectionProps) {
  return (
    <section
      id="discounted-grid"
      className="py-10 bg-gradient-to-b from-[#F3EFE6]/70 via-[#FAF7F2] to-[#FAF7F2] border-b border-[#E6DFD3]"
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-2 sm:gap-4 border-b border-[#E6DFD3] pb-3 sm:pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-[#D92D20] mb-0.5 sm:mb-1">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              پیشنهادهای شگفت‌انگیز و تخفیف‌دار اول صفحه
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-[#181615]">
              لوازم جانبی تخفیف‌دار ویژه آلِرضا ({toPersianDigits(discountedProducts.length)} کالا)
            </h3>
          </div>
          <span className="text-[11px] sm:text-xs text-[#6E675F]">
            تخفیف‌های ویژه با زمان و تعداد محدود
          </span>
        </div>

        {discountedProducts.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#E6DFD3] p-8 text-center">
            <p className="text-sm font-bold text-[#6E675F]">
              در حال حاضر محصولی در لیست تخفیف ویژه قرار ندارد.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
            {discountedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                category={categories.find((c) => c.id === product.categoryId)}
                isFeaturedDiscount={true}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
