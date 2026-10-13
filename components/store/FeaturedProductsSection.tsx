'use client';

import React from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Category, Product, UserAccount, toPersianDigits } from '@/lib/store-data';
import { ProductCard } from '@/components/ProductCard';

interface FeaturedProductsSectionProps {
  products: Product[];
  filteredProducts: Product[];
  categories: Category[];
  selectedCategoryId: string;
  searchQuery: string;
  sortBy: 'default' | 'discount' | 'price-asc' | 'price-desc';
  isLoading: boolean;
  currentUser: UserAccount | null;
  onSearchChange: (query: string) => void;
  onSortChange: (sort: 'default' | 'discount' | 'price-asc' | 'price-desc') => void;
  onResetFilters: () => void;
  onSelectProduct: (product: Product) => void;
}

/**
 * بخش نمایش کاتالوگ محصولات به همراه ابزار جستجو و مرتب‌سازی
 */
export function FeaturedProductsSection({
  products,
  filteredProducts,
  categories,
  selectedCategoryId,
  searchQuery,
  sortBy,
  isLoading,
  currentUser,
  onSearchChange,
  onSortChange,
  onResetFilters,
  onSelectProduct,
}: FeaturedProductsSectionProps) {
  const currentCategoryName =
    selectedCategoryId === 'all'
      ? 'تمامی لوازم جانبی و قطعات لوازم خانگی'
      : categories.find((c) => c.id === selectedCategoryId)?.name || 'محصولات دسته‌بندی';

  return (
    <section id="all-products-section" className="py-6 sm:py-8 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-4 sm:space-y-6">
      {/* تیتر بخش کاتالوگ */}
      <div className="flex flex-wrap items-end justify-between gap-2 sm:gap-4 border-b border-[#E6DFD3] pb-2.5 sm:pb-3">
        <div>
          <span className="text-[11px] sm:text-xs font-extrabold text-[#C85A32]">
            کاتالوگ و لیست محصولات
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-[#181615] mt-0.5">
            {currentCategoryName}
          </h2>
        </div>
        <span className="text-[11px] sm:text-xs text-[#6E675F]">
          نمایش {toPersianDigits(filteredProducts.length)} از {toPersianDigits(products.length)} کالا
        </span>
      </div>

      {/* نوار جستجو و ابزار مرتب‌سازی */}
      <div
        id="all-products"
        className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 rounded-2xl bg-white border border-[#E6DFD3] p-3 sm:p-4 shadow-xs"
      >
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-[#8C837A] absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجوی نام قطعه، فیلتر، مدل یا برند..."
            className="w-full rounded-xl bg-[#FAF7F2] border border-[#DCD4C6] pr-10 pl-4 py-2 sm:py-2.5 text-xs font-bold text-[#181615] placeholder-[#8C837A] focus:border-[#C85A32] focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-start gap-2">
          <span className="text-xs text-[#6E675F] font-bold shrink-0">مرتب‌سازی:</span>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(
                e.target.value as 'default' | 'discount' | 'price-asc' | 'price-desc'
              )
            }
            className="flex-1 sm:flex-none rounded-xl bg-[#FAF7F2] border border-[#DCD4C6] px-3 py-2 text-xs font-bold text-[#181615] focus:outline-none cursor-pointer"
          >
            <option value="default">پیش‌فرض (جدیدترین‌ها)</option>
            <option value="discount">بیشترین تخفیف</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
          </select>
        </div>
      </div>

      {/* گرید محصولات فیلترشده یا وضعیت خالی */}
      {isLoading ? (
        <div className="rounded-3xl bg-white border border-[#E6DFD3] p-12 text-center space-y-3">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#C85A32] border-t-transparent" />
          <p className="text-sm font-bold text-[#6E675F]">
            در حال بارگذاری لیست محصولات از پایگاه داده...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-3xl bg-white border border-[#E6DFD3] p-8 sm:p-12 text-center space-y-3">
          <p className="text-base font-extrabold text-[#181615]">
            {products.length === 0
              ? 'هیچ محصولی در پایگاه داده فروشگاه وجود ندارد'
              : 'محصولی مطابق با فیلتر انتخابی یافت نشد'}
          </p>
          <p className="text-xs text-[#6E675F]">
            {products.length === 0
              ? 'تمامی محصولات پاک شده‌اند. برای افزودن کالای جدید می‌توانید به پیشخوان مدیریت مراجعه کنید.'
              : 'کلمه جستجو یا دسته‌بندی را تغییر دهید.'}
          </p>
          {products.length === 0 ? (
            currentUser?.role === 'admin' ? (
              <Link
                href="/admin"
                className="inline-block rounded-xl bg-[#2271b1] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#135e96] transition"
              >
                ورود به پیشخوان مدیریت جهت افزودن یا مدیریت محصولات
              </Link>
            ) : null
          ) : (
            <button
              type="button"
              onClick={onResetFilters}
              className="rounded-xl bg-[#C85A32] px-4 py-2 text-xs font-bold text-white cursor-pointer hover:bg-[#B04B25]"
            >
              نمایش همه محصولات آلِرضا
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={categories.find((c) => c.id === product.categoryId)}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </section>
  );
}
