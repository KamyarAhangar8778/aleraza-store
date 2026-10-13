'use client';

import React from 'react';
import { Save } from 'lucide-react';
import { Category, Product, toPersianDigits } from '@/lib/store-data';
import { ProductPricingCard } from './product-form/ProductPricingCard';
import { ProductCarouselGallery } from './product-form/ProductCarouselGallery';
import { ProductSpecsCard } from './product-form/ProductSpecsCard';

interface ProductFormSectionProps {
  editingProduct: Product;
  isNewProductMode: boolean;
  categories: Category[];
  onChangeProduct: (prod: Product) => void;
  onSaveProduct: (prod: Product) => Promise<void>;
  onCancel: () => void;
}

/**
 * فرم اصلی دو ستونه ایجاد و ویرایش کالا در سبک WooCommerce
 * متشکل از ساب‌کامپوننت‌های ماژولار قیمت‌گذاری، گالری تصاویر و مشخصات فنی
 */
export function ProductFormSection({
  editingProduct,
  isNewProductMode,
  categories,
  onChangeProduct,
  onSaveProduct,
  onCancel,
}: ProductFormSectionProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveProduct({
      ...editingProduct,
      title: editingProduct.title.trim() || 'محصول جدید آلِرضا',
    });
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-5">
      {/* سربرگ فرم ویرایش */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-[#1d2327]">
            {isNewProductMode ? 'افزودن محصول جدید' : 'ویرایش محصول'}
          </h1>
          <button
            type="button"
            onClick={onCancel}
            className="text-xs font-semibold text-[#2271b1] hover:underline cursor-pointer"
          >
            ← بازگشت به همه محصولات
          </button>
        </div>
        <button
          type="submit"
          className="inline-flex items-center gap-1.5 rounded bg-[#2271b1] hover:bg-[#135e96] px-5 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isNewProductMode ? 'انتشار محصول در سایت' : 'بروزرسانی محصول'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* ستون راست فرم (اصلی - ۸ ستون) */}
        <div className="lg:col-span-8 space-y-5">
          {/* عنوان و زیرعنوان فنی */}
          <div className="bg-white border border-[#c3c4c7] p-4 rounded-sm space-y-4 shadow-xs">
            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                نام محصول
              </label>
              <input
                type="text"
                value={editingProduct.title}
                onChange={(e) => onChangeProduct({ ...editingProduct, title: e.target.value })}
                placeholder="نام محصول را اینجا وارد کنید..."
                className="w-full rounded border border-[#8c8f94] px-3.5 py-2 text-base font-bold text-[#1d2327] focus:border-[#2271b1] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1">
                توضیح کوتاه / زیرعنوان فنی
              </label>
              <input
                type="text"
                value={editingProduct.subtitle}
                onChange={(e) => onChangeProduct({ ...editingProduct, subtitle: e.target.value })}
                placeholder="مثلاً: فیلتر ۴ مرحله‌ای • آنتی‌باکتریال با ضمانت اصالت"
                className="w-full rounded border border-[#8c8f94] px-3 py-2 text-xs text-[#1d2327]"
              />
            </div>
          </div>

          {/* کادر قیمت و تخفیف ویژه */}
          <ProductPricingCard
            product={editingProduct}
            onChange={onChangeProduct}
          />

          {/* گالری کاروسل تصاویر محصول */}
          <ProductCarouselGallery
            product={editingProduct}
            onChange={onChangeProduct}
          />
        </div>

        {/* ستون چپ فرم (۴ ستون: انتشار، دسته‌بندی، مشخصات فنی) */}
        <div className="lg:col-span-4 space-y-5">
          {/* کادر انتشار */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden shadow-xs">
            <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 text-xs font-bold">
              انتشار
            </div>
            <div className="p-4 space-y-3 text-xs text-[#50575e]">
              <div className="flex justify-between">
                <span>وضعیت:</span>
                <strong className="text-[#00a32a]">منتشرشده در سایت</strong>
              </div>
              <div className="flex justify-between">
                <span>تعداد اسلاید فعال:</span>
                <strong className="text-[#1d2327]">
                  {toPersianDigits(editingProduct.maxCarouselImages)} تصویر
                </strong>
              </div>
              <button
                type="submit"
                className="w-full rounded bg-[#2271b1] hover:bg-[#135e96] py-2.5 text-xs font-bold text-white transition cursor-pointer"
              >
                {isNewProductMode ? 'انتشار محصول' : 'ذخیره و بروزرسانی محصول'}
              </button>
            </div>
          </div>

          {/* کادر انتخاب دسته‌بندی */}
          <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden shadow-xs">
            <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 text-xs font-bold">
              دسته‌بندی محصول
            </div>
            <div className="p-4 space-y-2 max-h-56 overflow-y-auto text-xs">
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="radio"
                    name="wp_prod_cat"
                    checked={editingProduct.categoryId === cat.id}
                    onChange={() => onChangeProduct({ ...editingProduct, categoryId: cat.id })}
                    className="accent-[#2271b1]"
                  />
                  <span className="font-semibold text-[#1d2327]">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* کادر مشخصات و ویژگی‌های فنی */}
          <ProductSpecsCard
            product={editingProduct}
            onChange={onChangeProduct}
          />
        </div>
      </div>
    </form>
  );
}
