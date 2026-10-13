'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Category,
  Product,
  formatToman,
  toPersianDigits,
  resolveAssetUrl,
} from '@/lib/store-data';
import { ProductImagePlaceholder } from '@/components/ProductImagePlaceholder';

interface ProductsSectionProps {
  products: Product[];
  categories: Category[];
  catFilter: string;
  searchFilter: string;
  onCatFilterChange: (cat: string) => void;
  onSearchFilterChange: (search: string) => void;
  onOpenNewProduct: () => void;
  onOpenEditProduct: (product: Product) => void;
  onOpenMediaProduct: (productId: string) => void;
  onDeleteProduct: (productId: string) => Promise<void>;
  onClearAllProducts: () => Promise<void>;
  onResetDemoData: () => Promise<void>;
}

/**
 * بخش جدول و مدیریت محصولات فروشگاه (سبک WooCommerce)
 */
export function ProductsSection({
  products,
  categories,
  catFilter,
  searchFilter,
  onCatFilterChange,
  onSearchFilterChange,
  onOpenNewProduct,
  onOpenEditProduct,
  onOpenMediaProduct,
  onDeleteProduct,
  onClearAllProducts,
  onResetDemoData,
}: ProductsSectionProps) {
  const [confirmDeleteProdId, setConfirmDeleteProdId] = useState<string | null>(null);
  const [showClearProductsConfirm, setShowClearProductsConfirm] = useState(false);
  const [showResetDemoConfirm, setShowResetDemoConfirm] = useState(false);

  const filteredProductsList = products.filter((p) => {
    const matchCat = catFilter === 'all' || p.categoryId === catFilter;
    const matchSearch =
      !searchFilter.trim() ||
      p.title.toLowerCase().includes(searchFilter.trim().toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchFilter.trim().toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-4">
      {/* سربرگ بخش و دکمه‌های عملیات سریع */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold text-[#1d2327]">
            محصولات ({toPersianDigits(products.length)} کالا)
          </h1>
          <button
            type="button"
            onClick={onOpenNewProduct}
            className="rounded border border-[#2271b1] bg-[#f6f7f7] px-3 py-1 text-xs font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition cursor-pointer"
          >
            افزودن محصول جدید
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* دکمه پاکسازی تمام کالاها */}
          {products.length > 0 &&
            (showClearProductsConfirm ? (
              <div className="flex items-center gap-2 bg-[#fcf0f1] border border-[#d63638] px-3 py-1 rounded text-xs">
                <span className="font-bold text-[#d63638]">تمامی کالاها پاک شوند؟</span>
                <button
                  type="button"
                  onClick={async () => {
                    await onClearAllProducts();
                    setShowClearProductsConfirm(false);
                  }}
                  className="rounded bg-[#d63638] px-2.5 py-0.5 text-white font-bold hover:bg-[#b32d2e] cursor-pointer"
                >
                  بله، حذف همه
                </button>
                <button
                  type="button"
                  onClick={() => setShowClearProductsConfirm(false)}
                  className="rounded bg-white border border-[#c3c4c7] px-2 py-0.5 text-[#50575e] cursor-pointer"
                >
                  انصراف
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowClearProductsConfirm(true)}
                className="rounded border border-[#d63638] bg-[#fcf0f1] px-3 py-1 text-xs font-bold text-[#d63638] hover:bg-[#d63638] hover:text-white transition cursor-pointer"
              >
                پاکسازی تمام محصولات (حذف کامل)
              </button>
            ))}

          {/* بازنشانی کالاهای دمو */}
          {showResetDemoConfirm ? (
            <div className="flex items-center gap-2 bg-[#f0f6fc] border border-[#2271b1] px-3 py-1 rounded text-xs">
              <span className="font-bold text-[#2271b1]">محصولات نمونه پیش‌فرض بارگذاری شوند؟</span>
              <button
                type="button"
                onClick={async () => {
                  await onResetDemoData();
                  setShowResetDemoConfirm(false);
                }}
                className="rounded bg-[#2271b1] px-2.5 py-0.5 text-white font-bold hover:bg-[#135e96] cursor-pointer"
              >
                بله، بارگذاری دمو
              </button>
              <button
                type="button"
                onClick={() => setShowResetDemoConfirm(false)}
                className="rounded bg-white border border-[#c3c4c7] px-2 py-0.5 text-[#50575e] cursor-pointer"
              >
                انصراف
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowResetDemoConfirm(true)}
              className="rounded border border-[#2271b1] bg-[#f0f6fc] px-3 py-1 text-xs font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition cursor-pointer"
            >
              بازنشانی کالاهای دمو
            </button>
          )}
        </div>
      </div>

      {/* نوار فیلتر و جستجو */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-[#c3c4c7] rounded-sm">
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={catFilter}
            onChange={(e) => onCatFilterChange(e.target.value)}
            className="rounded border border-[#8c8f94] bg-white px-3 py-1.5 text-xs text-[#1d2327]"
          >
            <option value="all">تمام دسته‌ها</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#8c8f94] absolute right-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => onSearchFilterChange(e.target.value)}
            placeholder="جستجوی عنوان محصول..."
            className="rounded border border-[#8c8f94] bg-white pr-8 pl-3 py-1.5 text-xs text-[#1d2327] focus:border-[#2271b1] focus:outline-none"
          />
        </div>
      </div>

      {/* جدول نمایش لیست محصولات */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-x-auto shadow-xs">
        <table className="w-full text-right text-xs">
          <thead className="bg-[#f6f7f7] text-[#1d2327] border-b border-[#c3c4c7] font-bold">
            <tr>
              <th className="py-2.5 px-3 w-14">تصویر</th>
              <th className="py-2.5 px-3">عنوان محصول</th>
              <th className="py-2.5 px-3">دسته‌بندی</th>
              <th className="py-2.5 px-3">قیمت و تخفیف</th>
              <th className="py-2.5 px-3 text-center">عکس‌های کاروسل</th>
              <th className="py-2.5 px-3 text-center">ویترین تخفیف اول صفحه</th>
              <th className="py-2.5 px-3 text-left">عملیات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#c3c4c7]">
            {filteredProductsList.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-[#50575e]">
                  <div className="space-y-1">
                    <p className="font-bold text-[#1d2327]">
                      {products.length === 0
                        ? 'هیچ محصولی در پایگاه داده فروشگاه وجود ندارد'
                        : 'محصولی مطابق فیلتر جستجو یافت نشد'}
                    </p>
                    <p className="text-xs text-[#50575e]">
                      {products.length === 0
                        ? 'تمامی محصولات پاک شده‌اند. برای ایجاد محصول جدید از دکمه «افزودن محصول جدید» استفاده کنید.'
                        : 'کلمه جستجو یا دسته‌بندی را تغییر دهید.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProductsList.map((prod) => {
                const cat = categories.find((c) => c.id === prod.categoryId);
                return (
                  <tr key={prod.id} className="hover:bg-[#f6f7f7] group">
                    <td className="py-3 px-3">
                      {prod.images && prod.images.length > 0 && prod.images[0]?.trim() ? (
                        <img
                          src={resolveAssetUrl(prod.images[0])}
                          alt={prod.title}
                          className="h-11 w-11 rounded object-cover border border-[#c3c4c7]"
                        />
                      ) : (
                        <div className="h-11 w-11 rounded overflow-hidden border border-[#c3c4c7]">
                          <ProductImagePlaceholder size="sm" showText={false} className="h-full w-full" />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        type="button"
                        onClick={() => onOpenEditProduct(prod)}
                        className="font-bold text-[#2271b1] hover:underline text-right cursor-pointer"
                      >
                        {prod.title}
                      </button>
                      <div className="mt-1 flex items-center gap-2 text-[11px] text-[#50575e]">
                        <button
                          type="button"
                          onClick={() => onOpenEditProduct(prod)}
                          className="text-[#2271b1] hover:underline cursor-pointer"
                        >
                          ویرایش کامل
                        </button>
                        <span>|</span>
                        <button
                          type="button"
                          onClick={() => onOpenMediaProduct(prod.id)}
                          className="text-[#2271b1] hover:underline cursor-pointer"
                        >
                          مدیریت عکس‌های کاروسل
                        </button>
                        <span>|</span>
                        {confirmDeleteProdId === prod.id ? (
                          <span className="inline-flex items-center gap-1 bg-[#fcf0f1] px-1.5 py-0.5 rounded border border-[#f5c2c7]">
                            <span className="text-[10px] font-bold text-[#d63638]">حذف شود؟</span>
                            <button
                              type="button"
                              onClick={async () => {
                                await onDeleteProduct(prod.id);
                                setConfirmDeleteProdId(null);
                              }}
                              className="font-bold text-[#d63638] underline text-[10px] cursor-pointer"
                            >
                              بله، حذف
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteProdId(null)}
                              className="text-[#50575e] text-[10px] cursor-pointer"
                            >
                              خیر
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteProdId(prod.id)}
                            className="text-[#d63638] hover:underline cursor-pointer"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-[#50575e]">
                      {cat ? cat.name : '—'}
                    </td>
                    <td className="py-3 px-3">
                      {prod.isDiscounted && prod.discountedPrice < prod.price ? (
                        <div>
                          <span className="line-through text-[#8c8f94] text-[11px] block">
                            {formatToman(prod.price)}
                          </span>
                          <span className="font-bold text-[#d63638]">
                            {formatToman(prod.discountedPrice)} تومان
                          </span>
                        </div>
                      ) : (
                        <span className="font-bold text-[#1d2327]">
                          {formatToman(prod.price)} تومان
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="inline-flex items-center gap-1 rounded bg-[#f0f6fc] border border-[#c5d9ed] px-2 py-0.5 text-[11px] font-bold text-[#2271b1]">
                        {toPersianDigits(
                          Math.min(prod.images.length, prod.maxCarouselImages || prod.images.length)
                        )}{' '}
                        از {toPersianDigits(prod.images.length)} تصویر
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      {prod.isDiscounted ? (
                        <span className="inline-block rounded bg-[#fcf0f1] border border-[#f5c2c7] px-2 py-0.5 text-[11px] font-bold text-[#d63638]">
                          بله (اول صفحه)
                        </span>
                      ) : (
                        <span className="text-[#8c8f94]">عادی</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-left">
                      <button
                        type="button"
                        onClick={() => onOpenEditProduct(prod)}
                        className="rounded bg-[#2271b1] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#135e96] transition cursor-pointer"
                      >
                        ویرایش
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
