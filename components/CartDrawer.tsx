'use client';

import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from './StoreProvider';
import { formatToman, toPersianDigits, resolveAssetUrl } from '@/lib/store-data';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { cart, removeFromCart, updateCartQty, clearCart, showToast } = useStore();
  const [orderPlaced, setOrderPlaced] = useState(false);

  if (!isOpen) return null;

  const totalAmount = cart.reduce((acc, item) => {
    const unitPrice = item.product.isDiscounted
      ? item.product.discountedPrice
      : item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  const handleCheckout = () => {
    setOrderPlaced(true);
    clearCart();
    showToast('سفارش شما در سیستم آلِرضا با موفقیت ثبت شد!');
    setTimeout(() => {
      setOrderPlaced(false);
      onClose();
    }, 2600);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-sm">
      <div className="relative flex h-full w-full max-w-md flex-col bg-[#FAF7F2] border-r border-[#E6DFD3] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#181615] px-6 py-5 text-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#C85A32]" />
            <h3 className="text-base font-extrabold">سبد خرید آلِرضا</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {orderPlaced ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
              <div className="h-16 w-16 rounded-full bg-[#1F6E58]/15 text-[#1F6E58] flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h4 className="text-lg font-extrabold text-[#181615]">
                سفارش شما با موفقیت ثبت شد
              </h4>
              <p className="text-xs text-[#6E675F] leading-relaxed">
                کارشناسان فروش و ارسال لوازم خانگی آلِرضا جهت هماهنگی زمان ارسال و نصب رایگان با شما تماس خواهند گرفت.
              </p>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
              <ShoppingBag className="w-12 h-12 text-[#DCD4C6]" />
              <p className="text-sm font-bold text-[#181615]">
                سبد خرید شما در حال حاضر خالی است
              </p>
              <p className="text-xs text-[#6E675F]">
                محصولات تخفیف‌دار اول صفحه یا کلکسیون لوازم خانگی آلِرضا را بررسی کنید.
              </p>
            </div>
          ) : (
            cart.map(({ product, quantity }) => {
              const unitPrice = product.isDiscounted
                ? product.discountedPrice
                : product.price;
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-2xl bg-white border border-[#E6DFD3] p-3.5 shadow-xs"
                >
                  <img
                    src={resolveAssetUrl(product.images[0] || '/images/aleraza_hero_kitchen.jpg')}
                    alt={product.title}
                    className="h-16 w-16 rounded-xl object-cover flex-shrink-0 border border-[#E6DFD3]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#181615] line-clamp-1">
                      {product.title}
                    </h4>
                    <p className="text-xs font-extrabold text-[#C85A32] mt-1">
                      {formatToman(unitPrice)} تومان
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-lg bg-[#F3EFE6] px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateCartQty(product.id, quantity + 1)}
                          className="text-[#181615] hover:text-[#C85A32]"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-xs font-bold px-1">
                          {toPersianDigits(quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQty(product.id, quantity - 1)}
                          className="text-[#181615] hover:text-[#C85A32]"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeFromCart(product.id)}
                        className="text-[#8C837A] hover:text-[#D92D20] transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && !orderPlaced && (
          <div className="border-t border-[#E6DFD3] bg-white p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-[#1F6E58] bg-[#1F6E58]/10 px-3 py-2 rounded-xl font-bold">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                ارسال و نصب تخصصی رایگان آلِرضا
              </span>
              <span>فعال</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6E675F]">مبلغ قابل پرداخت:</span>
              <span className="text-lg font-black text-[#181615]">
                {formatToman(totalAmount)} <span className="text-xs font-normal">تومان</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full rounded-2xl bg-[#C85A32] py-3.5 text-sm font-bold text-white shadow-lg hover:bg-[#B04B25] transition"
            >
              تکمیل سفارش و ثبت نهایی
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
