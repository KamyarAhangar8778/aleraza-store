'use client';

import React from 'react';
import { Category, Product, toPersianDigits, resolveAssetUrl, cacheImageResource } from '@/lib/store-data';

interface StoreCategoriesProps {
  categories: Category[];
  products: Product[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

/**
 * بخش انتخاب و فیلتر بصری دسته‌بندی‌های لوازم جانبی با تصاویر و تعداد اقلام
 */
export function StoreCategories({
  categories,
  products,
  selectedCategoryId,
  onSelectCategory,
}: StoreCategoriesProps) {
  const handleCategoryClick = (catId: string) => {
    onSelectCategory(catId);
    document.getElementById('all-products')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="categories-section" className="py-6 sm:py-8 mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 space-y-3 sm:space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-2 sm:gap-4 border-b border-[#E6DFD3] pb-2 sm:pb-3">
        <div>
          <span className="text-[11px] sm:text-xs font-extrabold text-[#C85A32]">
            دسته‌بندی تخصصی لوازم جانبی و قطعات
          </span>
          <h2 className="text-lg sm:text-2xl font-black text-[#181615] mt-0.5">
            انتخاب دسته‌بندی لوازم جانبی آلِرضا
          </h2>
        </div>
        <span className="text-[11px] sm:text-xs font-semibold text-[#6E675F]">
          برای مشاهده و فیلتر، روی هر دسته بزنید
        </span>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3.5">
        {/* دکمه انتخاب تمام دسته‌ها */}
        <button
          type="button"
          onClick={() => handleCategoryClick('all')}
          className={`group relative flex flex-col rounded-xl sm:rounded-2xl border overflow-hidden text-right transition cursor-pointer ${
            selectedCategoryId === 'all'
              ? 'bg-[#181615] text-[#FAF7F2] border-[#181615] shadow-lg ring-2 ring-[#C85A32]'
              : 'bg-white text-[#181615] border-[#E6DFD3] hover:border-[#C85A32] hover:shadow-md'
          }`}
        >
          <div className="relative h-16 sm:h-24 w-full bg-[#E6DFD3] overflow-hidden">
            <img
              src={resolveAssetUrl('/images/hero_appliance_accessories.jpg')}
              alt="همه دسته‌ها"
              loading="lazy"
              decoding="async"
              onLoad={() => cacheImageResource('/images/hero_appliance_accessories.jpg')}
              className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <span className="absolute bottom-1.5 right-1.5 text-[9px] sm:text-[10px] font-extrabold bg-[#C85A32] text-white px-1.5 py-0.5 rounded shadow-xs">
              {toPersianDigits(products.length)} کالا
            </span>
          </div>
          <div className="p-2 sm:p-3">
            <p className="text-[11px] sm:text-xs font-black truncate">همه دسته‌ها</p>
            <p
              className={`text-[10px] line-clamp-1 mt-0.5 hidden sm:block ${
                selectedCategoryId === 'all' ? 'text-[#DCD4C6]' : 'text-[#6E675F]'
              }`}
            >
              تمام قطعات و لوازم
            </p>
          </div>
        </button>

        {/* لیست کارت‌های دسته‌بندی */}
        {categories.map((cat) => {
          const count = products.filter((p) => p.categoryId === cat.id).length;
          const active = selectedCategoryId === cat.id;
          const catImg = cat.imageUrl || '/images/hero_appliance_accessories.jpg';

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryClick(cat.id)}
              className={`group relative flex flex-col rounded-xl sm:rounded-2xl border overflow-hidden text-right transition cursor-pointer ${
                active
                  ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-lg ring-2 ring-[#181615]'
                  : 'bg-white text-[#181615] border-[#E6DFD3] hover:border-[#C85A32] hover:shadow-md'
              }`}
            >
              <div className="relative h-16 sm:h-24 w-full bg-[#E6DFD3] overflow-hidden">
                <img
                  src={resolveAssetUrl(catImg)}
                  alt={cat.name}
                  loading="lazy"
                  decoding="async"
                  onLoad={() => cacheImageResource(catImg)}
                  className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <span
                  className={`absolute bottom-1.5 right-1.5 text-[9px] sm:text-[10px] font-extrabold px-1.5 py-0.5 rounded shadow-xs ${
                    active ? 'bg-white text-[#C85A32]' : 'bg-[#181615] text-white'
                  }`}
                >
                  {toPersianDigits(count)} کالا
                </span>
              </div>
              <div className="p-2 sm:p-3">
                <p className="text-[11px] sm:text-xs font-extrabold truncate">{cat.name}</p>
                <p
                  className={`text-[10px] line-clamp-1 mt-0.5 hidden sm:block ${
                    active ? 'text-white/90' : 'text-[#6E675F]'
                  }`}
                >
                  {cat.description || 'قطعات و لوازم جانبی اورجینال'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
