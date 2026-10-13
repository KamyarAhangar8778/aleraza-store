'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/store-data';

export interface CartItem {
  product: Product;
  quantity: number;
}

const CART_STORAGE_KEY = 'aleraza_cart_v1';

/**
 * مدیریت وضعیت سبد خرید، ذخیره‌سازی محلی و عملیات افزودن، حذف و ویرایش تعداد اقلام
 */
export function useStoreCart(showToast: (msg: string) => void) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch {
      return [];
    }
  });

  // ذخیره‌سازی خودکار تغییرات سبد خرید در حافظه محلی مرورگر
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage write errors
    }
  }, [cart]);

  /**
   * افزودن کالا به سبد خرید یا افزایش تعداد در صورت وجود
   */
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, product, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    showToast(`«${product.title}» به سبد خرید اضافه شد.`);
  };

  /**
   * حذف کامل یک کالا از سبد خرید
   */
  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  /**
   * تغییر تعداد یک کالا در سبد خرید
   */
  const updateCartQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  /**
   * خالی کردن کامل سبد خرید
   */
  const clearCart = () => {
    setCart([]);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,
  };
}
