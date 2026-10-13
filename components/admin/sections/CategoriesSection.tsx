'use client';

import React, { useState } from 'react';
import { PlusCircle, Upload } from 'lucide-react';
import {
  Category,
  Product,
  PRESET_APPLIANCE_GALLERY,
  toPersianDigits,
  resolveAssetUrl,
} from '@/lib/store-data';
import { compressImageFile } from '@/lib/image-utils';

interface CategoriesSectionProps {
  categories: Category[];
  products: Product[];
  onSaveCategory: (category: Category) => Promise<void>;
  onDeleteCategory: (categoryId: string) => Promise<void>;
}

/**
 * بخش مدیریت دو ستونه دسته‌بندی‌های لوازم جانبی (فرم ایجاد/ویرایش و جدول دسته‌ها)
 */
export function CategoriesSection({
  categories,
  products,
  onSaveCategory,
  onDeleteCategory,
}: CategoriesSectionProps) {
  const [editingCategory, setEditingCategory] = useState<Category>(() => ({
    id: 'cat-new',
    name: '',
    slug: '',
    description: '',
    imageUrl: '/images/hero_appliance_accessories.jpg',
    iconName: 'Sparkles',
    order: 1,
    createdAt: new Date().toISOString(),
  }));
  const [isEditingExistingCat, setIsEditingExistingCat] = useState(false);
  const [confirmDeleteCatId, setConfirmDeleteCatId] = useState<string | null>(null);

  const resetForm = () => {
    setIsEditingExistingCat(false);
    setEditingCategory({
      id: `cat-${Date.now()}`,
      name: '',
      slug: '',
      description: '',
      imageUrl: '/images/hero_appliance_accessories.jpg',
      iconName: 'Sparkles',
      order: categories.length + 1,
      createdAt: new Date().toISOString(),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    compressImageFile(file, (dataUrl) => {
      setEditingCategory({ ...editingCategory, imageUrl: dataUrl });
    });
    e.target.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) return;
    await onSaveCategory({
      ...editingCategory,
      imageUrl: editingCategory.imageUrl || '/images/hero_appliance_accessories.jpg',
      slug:
        editingCategory.slug.trim() ||
        editingCategory.name.trim().toLowerCase().replace(/\s+/g, '-'),
    });
    resetForm();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1d2327]">
            دسته‌بندی‌های لوازم جانبی و قطعات
          </h1>
          <p className="text-xs text-[#50575e] mt-0.5">
            افزودن دسته‌بندی جدید، تعیین و ویرایش تصاویر شاخص، نام و توضیحات دسته‌ها
          </p>
        </div>
        {isEditingExistingCat && (
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-1.5 rounded border border-[#2271b1] bg-[#f0f6fc] px-3 py-1.5 text-xs font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            خروج از ویرایش و افزودن دسته جدید
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ستون راست: فرم ایجاد یا ویرایش دسته (۵ ستون) */}
        <div className="lg:col-span-5 bg-white border border-[#c3c4c7] p-5 rounded-md shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-3">
            <h2 className="text-sm font-bold text-[#1d2327]">
              {isEditingExistingCat ? 'ویرایش دسته‌بندی موجود' : 'افزودن دسته‌بندی تازه'}
            </h2>
            <span className="text-[11px] text-[#6E675F]">
              شناسه: {editingCategory.id}
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-[#1d2327] mb-1">
                نام دسته‌بندی <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                required
                value={editingCategory.name}
                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                placeholder="مثلاً: فیلترها و لوازم جانبی یخچال"
                className="w-full rounded border border-[#8c8f94] bg-white px-3 py-2 text-xs focus:border-[#2271b1] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1d2327] mb-1">نامک انگلیسی (Slug)</label>
              <input
                type="text"
                dir="ltr"
                value={editingCategory.slug}
                onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                placeholder="fridge-filters"
                className="w-full rounded border border-[#8c8f94] bg-white px-3 py-2 text-xs font-mono focus:border-[#2271b1] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-[#1d2327] mb-1">توضیح کوتاه</label>
              <textarea
                rows={2}
                value={editingCategory.description}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                placeholder="شرح کوتاه کالاهای این دسته..."
                className="w-full rounded border border-[#8c8f94] bg-white px-3 py-2 text-xs focus:border-[#2271b1] focus:outline-none"
              />
            </div>

            {/* تصویر شاخص دسته‌بندی */}
            <div className="rounded-lg border border-[#c5d9ed] bg-[#f0f6fc] p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="block font-bold text-[#1d2327] text-xs">
                  تصویر شاخص دسته‌بندی
                </label>
                {editingCategory.imageUrl && (
                  <button
                    type="button"
                    onClick={() => setEditingCategory({ ...editingCategory, imageUrl: '' })}
                    className="text-[11px] text-[#d63638] hover:underline cursor-pointer"
                  >
                    حذف تصویر
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <div className="h-16 w-24 rounded-lg bg-white border border-[#c3c4c7] overflow-hidden flex items-center justify-center shrink-0">
                  {editingCategory.imageUrl ? (
                    <img
                      src={resolveAssetUrl(editingCategory.imageUrl)}
                      alt="پیش‌نمایش تصویر دسته"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[10px] text-[#8c8f94] text-center px-1">
                      بدون تصویر
                    </span>
                  )}
                </div>
                <div className="flex-1 space-y-1.5">
                  <input
                    type="text"
                    dir="ltr"
                    value={editingCategory.imageUrl || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
                    placeholder="آدرس اینترنتی تصویر..."
                    className="w-full rounded border border-[#8c8f94] bg-white px-2.5 py-1.5 text-[11px] font-mono"
                  />
                  <label className="inline-flex items-center gap-1.5 rounded border border-[#2271b1] bg-white px-2.5 py-1 text-[11px] font-bold text-[#2271b1] cursor-pointer hover:bg-[#2271b1] hover:text-white transition">
                    <Upload className="w-3.5 h-3.5" />
                    <span>آپلود عکس دسته از دستگاه</span>
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
              </div>

              {/* انتخاب سریع از پیش‌فرض‌های لوازم خانگی */}
              <div className="pt-2 border-t border-[#c5d9ed]">
                <p className="text-[11px] font-bold text-[#50575e] mb-1.5">
                  یا انتخاب سریع از گالری لوازم جانبی آلِرضا:
                </p>
                <div className="grid grid-cols-4 gap-1.5">
                  {PRESET_APPLIANCE_GALLERY.slice(0, 8).map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setEditingCategory({ ...editingCategory, imageUrl: preset.url })}
                      title={preset.label}
                      className={`group relative aspect-square rounded border overflow-hidden transition cursor-pointer ${
                        editingCategory.imageUrl === preset.url
                          ? 'border-2 border-[#2271b1] ring-2 ring-[#2271b1]/30'
                          : 'border-[#c3c4c7] hover:border-[#2271b1]'
                      }`}
                    >
                      <img src={resolveAssetUrl(preset.url)} alt={preset.label} className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-[#f0f0f1]">
              <button
                type="submit"
                className="flex-1 rounded bg-[#2271b1] hover:bg-[#135e96] py-2.5 font-bold text-white transition text-center shadow-xs cursor-pointer"
              >
                {isEditingExistingCat ? 'ذخیره تغییرات دسته‌بندی' : 'افزودن دسته‌بندی تازه'}
              </button>
              {isEditingExistingCat && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded border border-[#8c8f94] px-4 py-2.5 font-bold text-[#50575e] hover:bg-[#f6f7f7] cursor-pointer"
                >
                  انصراف
                </button>
              )}
            </div>
          </form>
        </div>

        {/* ستون چپ: جدول دسته‌بندی‌ها (۷ ستون) */}
        <div className="lg:col-span-7 bg-white border border-[#c3c4c7] shadow-xs rounded-md overflow-hidden">
          <div className="p-3.5 bg-[#f6f7f7] border-b border-[#c3c4c7] flex items-center justify-between">
            <span className="font-bold text-xs text-[#1d2327]">
              لیست دسته‌بندی‌های ثبت‌شده ({toPersianDigits(categories.length)} دسته)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#c3c4c7] bg-[#f9f9f9] text-[#50575e] font-bold">
                  <th className="py-2.5 px-3">تصویر</th>
                  <th className="py-2.5 px-3">نام دسته‌بندی</th>
                  <th className="py-2.5 px-3">توضیح</th>
                  <th className="py-2.5 px-3 text-center">کالاها</th>
                  <th className="py-2.5 px-3 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0f0f1]">
                {categories.map((cat) => {
                  const count = products.filter((p) => p.categoryId === cat.id).length;
                  const isBeingEdited = isEditingExistingCat && editingCategory.id === cat.id;

                  return (
                    <tr
                      key={cat.id}
                      className={`transition ${isBeingEdited ? 'bg-[#f0f6fc]' : 'hover:bg-[#f9f9f9]'}`}
                    >
                      <td className="py-2.5 px-3">
                        <div className="h-10 w-14 rounded bg-gray-100 border border-[#c3c4c7] overflow-hidden">
                          <img
                            src={resolveAssetUrl(cat.imageUrl || '/images/hero_appliance_accessories.jpg')}
                            alt={cat.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-[#2271b1] text-xs">{cat.name}</div>
                        <div className="font-mono text-[10px] text-[#8c8f94] mt-0.5">{cat.slug}</div>
                      </td>
                      <td className="py-2.5 px-3 text-[#50575e] max-w-[180px] truncate">
                        {cat.description || '—'}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block rounded-full bg-[#f0f0f1] px-2 py-0.5 font-bold text-[11px] text-[#1d2327]">
                          {toPersianDigits(count)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-left space-x-2 space-x-reverse whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory({
                              ...cat,
                              imageUrl: cat.imageUrl || '/images/hero_appliance_accessories.jpg',
                            });
                            setIsEditingExistingCat(true);
                          }}
                          className="rounded bg-[#2271b1]/10 px-2 py-1 text-[#2271b1] font-bold hover:bg-[#2271b1] hover:text-white transition cursor-pointer"
                        >
                          ویرایش
                        </button>
                        {confirmDeleteCatId === cat.id ? (
                          <span className="inline-flex items-center gap-1.5 bg-[#fcf0f1] px-2 py-1 rounded border border-[#f5c2c7]">
                            <span className="text-[10px] font-bold text-[#d63638]">حذف شود؟</span>
                            <button
                              type="button"
                              onClick={async () => {
                                await onDeleteCategory(cat.id);
                                setConfirmDeleteCatId(null);
                              }}
                              className="rounded bg-[#d63638] px-2 py-0.5 text-[10px] font-bold text-white hover:bg-[#b32d2e] transition cursor-pointer"
                            >
                              بله، حذف
                            </button>
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteCatId(null)}
                              className="rounded bg-white border border-[#c3c4c7] px-2 py-0.5 text-[10px] text-[#50575e] hover:bg-[#f6f7f7] transition cursor-pointer"
                            >
                              انصراف
                            </button>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteCatId(cat.id)}
                            className="rounded bg-[#d63638]/10 px-2 py-1 text-[#d63638] font-bold hover:bg-[#d63638] hover:text-white transition cursor-pointer"
                          >
                            حذف
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-[#50575e]">
                      <p className="font-bold text-xs text-[#1d2327]">
                        هیچ دسته‌بندی در فروشگاه ثبت نشده است
                      </p>
                      <p className="text-[11px] text-[#50575e] mt-1">
                        از ستون سمت راست می‌توانید دسته‌بندی تازه اضافه کنید.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
