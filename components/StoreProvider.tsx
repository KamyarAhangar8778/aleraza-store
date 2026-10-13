'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Category, Product, UserAccount } from '@/lib/store-data';
import { CartItem, useStoreCart } from '@/hooks/useStoreCart';
import { useStoreAuth } from '@/hooks/useStoreAuth';
import { useStoreProducts } from '@/hooks/useStoreProducts';

export type { CartItem };

export interface StoreContextType {
  categories: Category[];
  products: Product[];
  users: UserAccount[];
  currentUser: UserAccount | null;
  cart: CartItem[];
  isLoading: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  // Auth
  loginWithCredentials: (phone: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  registerCustomer: (fullName: string, phone: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  adminSaveUser: (user: UserAccount) => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;
  // Products & Categories
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  clearAllProducts: () => Promise<void>;
  resetToDemoData: () => Promise<void>;
  quickUpdatePrice: (
    productId: string,
    price: number,
    discountedPrice: number,
    isDiscounted: boolean
  ) => Promise<void>;
  updateProductCarousel: (
    productId: string,
    images: string[],
    maxCarouselImages: number
  ) => Promise<void>;
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  // Cart
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

/**
 * کانتکست یکپارچه فروشگاه که به صورت کامپوزیت از هوک‌های ماژولار زیرساختی استفاده می‌کند
 */
export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  // ترکیب هوک‌های تخصصی
  const authState = useStoreAuth(showToast);
  const productsState = useStoreProducts(showToast);
  const cartState = useStoreCart(showToast);

  return (
    <StoreContext.Provider
      value={{
        ...authState,
        ...productsState,
        ...cartState,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
