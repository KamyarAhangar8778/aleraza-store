'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  BadgeCheck,
  Award,
  Sparkles,
  Check,
  Clock,
  Tag,
  ShieldAlert,
} from 'lucide-react';
import { Product } from '@/lib/store-data';

interface ProductSpecsCardProps {
  product: Product;
  onChange: (updated: Product) => void;
}

const WARRANTY_ICONS = [
  { id: 'ShieldCheck', label: 'سپر ضمانت', icon: ShieldCheck },
  { id: 'BadgeCheck', label: 'نشان اصالت', icon: BadgeCheck },
  { id: 'Award', label: 'مدال کیفیت', icon: Award },
  { id: 'Sparkles', label: 'طرح ویژه', icon: Sparkles },
  { id: 'Check', label: 'تیک سلامت', icon: Check },
  { id: 'Clock', label: 'مهلت تعویض', icon: Clock },
];

const PRESET_BADGES = ['پیشنهاد ویژه', 'پرفروش', 'ارسال فوری', 'اورجینال شرکتی', 'تخفیف ویژه'];
const PRESET_WARRANTIES = [
  'ضمانت اصالت و سلامت قطعه',
  '۱۲ ماه ضمانت تعویض آلِرضا',
  '۲۴ ماه ضمانت شرکتی',
  '۳۶ ماه ضمانت طلایی آلِرضا',
  'ضمانت بازگشت وجه تا ۷ روز',
];

/**
 * کادر برچسب، گارانتی، آیکون اختصاصی و ویژگی‌های فنی محصول در فرم مدیریت
 */
export function ProductSpecsCard({ product, onChange }: ProductSpecsCardProps) {
  const [newFeatureText, setNewFeatureText] = useState('');

  const currentIcon = product.warrantyIcon || 'ShieldCheck';

  const handleAddFeature = () => {
    if (!newFeatureText.trim()) return;
    onChange({
      ...product,
      features: [...(product.features || []), newFeatureText.trim()],
    });
    setNewFeatureText('');
  };

  const handleRemoveFeature = (index: number) => {
    onChange({
      ...product,
      features: (product.features || []).filter((_, idx) => idx !== index),
    });
  };

  return (
    <div className="space-y-4">
      {/* کادر برچسب و ضمانت‌نامه کالا */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden shadow-xs">
        <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 text-xs font-bold text-[#1d2327] flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-[#2271b1]" />
            برچسب و ضمانت‌نامه محصول
          </span>
          <span className="text-[10px] text-[#50575e]">قابل تنظیم دلخواه</span>
        </div>

        <div className="p-4 space-y-4 text-xs">
          {/* ۱. برچسب ویژه کالا (پیشنهاد ویژه و ...) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#1d2327]">
                متن برچسب روی عکس (مانند پیشنهاد ویژه)
              </label>
              {product.badge && (
                <button
                  type="button"
                  onClick={() => onChange({ ...product, badge: '' })}
                  className="text-[10px] text-[#d63638] hover:underline cursor-pointer"
                >
                  حذف برچسب
                </button>
              )}
            </div>
            <input
              type="text"
              value={product.badge || ''}
              onChange={(e) => onChange({ ...product, badge: e.target.value })}
              placeholder="مثلاً: پیشنهاد ویژه، پرفروش، حراج فصل..."
              className="w-full rounded border border-[#8c8f94] px-3 py-1.5 text-xs text-[#1d2327] focus:border-[#2271b1] focus:outline-none"
            />
            {/* انتخاب‌های سریع برچسب */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {PRESET_BADGES.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => onChange({ ...product, badge: b })}
                  className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer ${
                    product.badge === b
                      ? 'bg-[#181615] text-white border-[#181615]'
                      : 'bg-[#f0f0f1] text-[#50575e] border-[#c3c4c7] hover:bg-[#e0e0e1]'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          {/* ۲. متن ضمانت و گارانتی */}
          <div className="pt-2 border-t border-[#f0f0f1]">
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-[#1d2327]">
                متن گارانتی و ضمانت کالا
              </label>
              {product.warranty && (
                <button
                  type="button"
                  onClick={() => onChange({ ...product, warranty: '' })}
                  className="text-[10px] text-[#d63638] hover:underline cursor-pointer"
                >
                  حذف ضمانت
                </button>
              )}
            </div>
            <input
              type="text"
              value={product.warranty || ''}
              onChange={(e) => onChange({ ...product, warranty: e.target.value })}
              placeholder="مثلاً: ۳۶ ماه ضمانت طلایی آلِرضا، ضمانت اصالت و سلامت..."
              className="w-full rounded border border-[#8c8f94] px-3 py-1.5 text-xs text-[#1d2327] focus:border-[#2271b1] focus:outline-none"
            />
            {/* انتخاب‌های سریع گارانتی */}
            <div className="mt-1.5 flex flex-wrap gap-1">
              {PRESET_WARRANTIES.map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => onChange({ ...product, warranty: w })}
                  className={`text-[10px] px-2 py-0.5 rounded border transition cursor-pointer ${
                    product.warranty === w
                      ? 'bg-[#1F6E58] text-white border-[#1F6E58]'
                      : 'bg-[#f0f0f1] text-[#50575e] border-[#c3c4c7] hover:bg-[#e0e0e1]'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* ۳. انتخاب آیکون ضمانت */}
          <div className="pt-2 border-t border-[#f0f0f1]">
            <label className="block font-bold text-[#1d2327] mb-1.5">
              آیکون نشان ضمانت
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {WARRANTY_ICONS.map((item) => {
                const IconCmp = item.icon;
                const isSelected = currentIcon === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onChange({ ...product, warrantyIcon: item.id })}
                    className={`flex flex-col items-center justify-center p-2 rounded border text-center transition cursor-pointer ${
                      isSelected
                        ? 'border-[#1F6E58] bg-[#1F6E58]/10 text-[#1F6E58] font-bold shadow-xs'
                        : 'border-[#c3c4c7] bg-[#f9f9f9] text-[#50575e] hover:bg-[#f0f0f1]'
                    }`}
                  >
                    <IconCmp className={`w-4 h-4 mb-1 ${isSelected ? 'text-[#1F6E58]' : 'text-[#50575e]'}`} />
                    <span className="text-[10px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* کادر مشخصات و ویژگی‌های فنی */}
      <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden shadow-xs">
        <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 text-xs font-bold">
          ویژگی‌های فنی محصول
        </div>
        <div className="p-4 space-y-3 text-xs">
          <ul className="space-y-1.5">
            {(product.features || []).map((f, i) => (
              <li key={i} className="flex items-center justify-between gap-2 bg-[#f6f7f7] px-2.5 py-1.5 rounded">
                <span>{f}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveFeature(i)}
                  className="text-[#d63638] font-bold cursor-pointer"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <div className="flex gap-1.5">
            <input
              type="text"
              value={newFeatureText}
              onChange={(e) => setNewFeatureText(e.target.value)}
              placeholder="ویژگی جدید..."
              className="flex-1 rounded border border-[#8c8f94] px-2.5 py-1.5 text-xs"
            />
            <button
              type="button"
              onClick={handleAddFeature}
              className="rounded border border-[#2271b1] px-3 py-1.5 font-bold text-[#2271b1] cursor-pointer hover:bg-[#f0f6fc]"
            >
              افزودن
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
