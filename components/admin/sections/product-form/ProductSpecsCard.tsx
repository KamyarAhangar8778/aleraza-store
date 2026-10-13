'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/store-data';

interface ProductSpecsCardProps {
  product: Product;
  onChange: (updated: Product) => void;
}

/**
 * کادر مشخصات و ویژگی‌های فنی محصول در فرم ادمین
 */
export function ProductSpecsCard({ product, onChange }: ProductSpecsCardProps) {
  const [newFeatureText, setNewFeatureText] = useState('');

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
    <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden">
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
  );
}
