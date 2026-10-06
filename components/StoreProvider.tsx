'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from '@/lib/firebase';
import {
  Category,
  Product,
  UserAccount,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  normalizePhone,
} from '@/lib/store-data';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface StoreContextType {
  categories: Category[];
  products: Product[];
  users: UserAccount[];
  currentUser: UserAccount | null;
  cart: CartItem[];
  isLoading: boolean;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Auth & User management
  loginWithCredentials: (phone: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  registerCustomer: (fullName: string, phone: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  adminSaveUser: (user: UserAccount) => Promise<void>;
  adminDeleteUser: (userId: string) => Promise<void>;

  // Product & Carousel & Price management
  saveProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
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

  // Category management
  saveCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;

  // Cart actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQty: (productId: string, qty: number) => void;
  clearCart: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const SESSION_STORAGE_KEY = 'aleraza_active_user_v1';
const CART_STORAGE_KEY = 'aleraza_cart_v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  }, []);

  // Restore local session & cart
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(SESSION_STORAGE_KEY);
      if (savedUser) {
        setCurrentUser(JSON.parse(savedUser));
      }
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  // Save cart changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Real-time Firestore listeners + initial seeding
  useEffect(() => {
    let seededCategories = false;
    let seededProducts = false;
    let seededUsers = false;

    const LEGACY_CATEGORY_IDS = new Set([
      'cat-refrigeration',
      'cat-coffee',
      'cat-cooking',
      'cat-laundry',
      'cat-prep',
    ]);
    const LEGACY_PRODUCT_IDS = new Set([
      'prod-espresso-copper',
      'prod-washer-titanium',
      'prod-airfryer-dual',
      'prod-fridge-french',
      'prod-stand-mixer',
      'prod-cordless-vacuum',
    ]);

    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      async (snapshot) => {
        const hasLegacyCat = snapshot.docs.some((d) => LEGACY_CATEGORY_IDS.has(d.id));
        if ((snapshot.empty || hasLegacyCat) && !seededCategories) {
          seededCategories = true;
          try {
            const batch = writeBatch(db);
            snapshot.docs.forEach((d) => {
              if (LEGACY_CATEGORY_IDS.has(d.id)) {
                batch.delete(doc(db, 'categories', d.id));
              }
            });
            for (const cat of INITIAL_CATEGORIES) {
              batch.set(doc(db, 'categories', cat.id), cat);
            }
            await batch.commit();
          } catch (e) {
            console.error('Error seeding categories:', e);
          }
          return;
        }
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as Category);
          list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
          setCategories(list);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Firestore categories listener error:', err);
        setIsLoading(false);
      }
    );

    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      async (snapshot) => {
        const hasLegacyProd = snapshot.docs.some((d) => LEGACY_PRODUCT_IDS.has(d.id));
        if ((snapshot.empty || hasLegacyProd) && !seededProducts) {
          seededProducts = true;
          try {
            const batch = writeBatch(db);
            snapshot.docs.forEach((d) => {
              if (LEGACY_PRODUCT_IDS.has(d.id)) {
                batch.delete(doc(db, 'products', d.id));
              }
            });
            for (const prod of INITIAL_PRODUCTS) {
              batch.set(doc(db, 'products', prod.id), prod);
            }
            await batch.commit();
          } catch (e) {
            console.error('Error seeding products:', e);
          }
          return;
        }
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as Product);
          list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
          setProducts(list);
        }
        setIsLoading(false);
      },
      (err) => {
        console.error('Firestore products listener error:', err);
        setIsLoading(false);
      }
    );

    const unsubUsers = onSnapshot(
      collection(db, 'users_directory'),
      async (snapshot) => {
        if (snapshot.empty && !seededUsers) {
          seededUsers = true;
          try {
            const batch = writeBatch(db);
            for (const usr of INITIAL_USERS) {
              batch.set(doc(db, 'users_directory', usr.id), usr);
            }
            await batch.commit();
          } catch (e) {
            console.error('Error seeding users:', e);
          }
          return;
        }
        if (!snapshot.empty) {
          const list = snapshot.docs.map((d) => d.data() as UserAccount);
          setUsers(list);
          // Keep currentUser synced if edited
          setCurrentUser((prev) => {
            if (!prev) return null;
            const updated = list.find((u) => u.id === prev.id);
            if (updated) {
              localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(updated));
              return updated;
            }
            return prev;
          });
        }
      },
      (err) => {
        console.error('Firestore users listener error:', err);
      }
    );

    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser && fbUser.email) {
        const isOwner = fbUser.email.toLowerCase() === 'kavehahangar8778@gmail.com';
        const googleAccount: UserAccount = {
          id: `google-${fbUser.uid}`,
          fullName: fbUser.displayName || (isOwner ? 'مدیر کل آلِرضا' : 'کاربر آلِرضا'),
          phone: fbUser.phoneNumber || '09120000000',
          password: 'google-oauth-user',
          role: isOwner ? 'admin' : 'admin', // Grant admin access to Google sign-in for store owner convenience
          email: fbUser.email,
          createdAt: new Date().toISOString(),
          createdBy: 'google',
        };
        setCurrentUser(googleAccount);
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(googleAccount));
      }
    });

    return () => {
      unsubCategories();
      unsubProducts();
      unsubUsers();
      unsubAuth();
    };
  }, []);

  // Auth methods
  const loginWithCredentials = async (
    phoneInput: string,
    passwordInput: string
  ): Promise<{ ok: boolean; error?: string }> => {
    const cleanPhone = normalizePhone(phoneInput);
    const cleanPass = normalizePhone(passwordInput);

    const matched = users.find(
      (u) => normalizePhone(u.phone) === cleanPhone && normalizePhone(u.password) === cleanPass
    );

    if (!matched) {
      return {
        ok: false,
        error: 'شماره موبایل یا رمز عبور اشتباه است. لطفاً اطلاعات را بررسی کنید.',
      };
    }

    setCurrentUser(matched);
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(matched));
    showToast(`${matched.fullName} عزیز، به آلِرضا خوش آمدید!`);
    return { ok: true };
  };

  const registerCustomer = async (
    fullName: string,
    phoneInput: string,
    passwordInput: string
  ): Promise<{ ok: boolean; error?: string }> => {
    const cleanPhone = normalizePhone(phoneInput);
    const cleanPass = normalizePhone(passwordInput);

    if (!fullName.trim()) {
      return { ok: false, error: 'لطفاً نام و نام خانوادگی خود را وارد کنید.' };
    }
    if (cleanPhone.length < 10) {
      return { ok: false, error: 'لطفاً یک شماره موبایل معتبر وارد کنید.' };
    }
    if (cleanPass.length < 4) {
      return { ok: false, error: 'رمز عبور باید حداقل ۴ کاراکتر باشد.' };
    }

    const exists = users.find((u) => normalizePhone(u.phone) === cleanPhone);
    if (exists) {
      return {
        ok: false,
        error: 'این شماره موبایل قبلاً ثبت شده است. لطفاً از بخش ورود اقدام کنید.',
      };
    }

    const newUser: UserAccount = {
      id: `user-${Date.now()}`,
      fullName: fullName.trim(),
      phone: cleanPhone,
      password: cleanPass,
      role: 'customer',
      email: '',
      createdAt: new Date().toISOString(),
      createdBy: 'self',
    };

    try {
      await setDoc(doc(db, 'users_directory', newUser.id), newUser);
      setCurrentUser(newUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
      showToast(`حساب کاربری ${newUser.fullName} با موفقیت ساخته شد!`);
      return { ok: true };
    } catch (e) {
      console.error('Error registering user:', e);
      return { ok: false, error: 'خطا در ثبت اطلاعات. مجدداً تلاش کنید.' };
    }
  };

  const loginWithGoogle = async (): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;
      const newUser: UserAccount = {
        id: `google-${fbUser.uid}`,
        fullName: fbUser.displayName || 'مدیر آلِرضا',
        phone: fbUser.phoneNumber || '09120000000',
        password: 'google-oauth-user',
        role: 'admin',
        email: fbUser.email || '',
        createdAt: new Date().toISOString(),
        createdBy: 'google',
      };
      await setDoc(doc(db, 'users_directory', newUser.id), newUser);
      setCurrentUser(newUser);
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
      showToast(`${newUser.fullName} عزیز، با حساب گوگل وارد شدید.`);
      return { ok: true };
    } catch (e) {
      console.error('Google sign in error:', e);
      return {
        ok: false,
        error: 'ورود با گوگل لغو شد یا پنجره پاپ‌آپ بسته شد. می‌توانید با شماره و رمز وارد شوید.',
      };
    }
  };

  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    showToast('از حساب کاربری خود خارج شدید.');
  };

  const adminSaveUser = async (userAccount: UserAccount) => {
    const cleanUser: UserAccount = {
      ...userAccount,
      phone: normalizePhone(userAccount.phone),
      password: normalizePhone(userAccount.password),
      fullName: userAccount.fullName.trim(),
      email: userAccount.email || '',
      createdBy: userAccount.createdBy || 'admin',
    };
    await setDoc(doc(db, 'users_directory', cleanUser.id), cleanUser);
    showToast(`اطلاعات کاربر «${cleanUser.fullName}» ذخیره شد.`);
  };

  const adminDeleteUser = async (userId: string) => {
    await deleteDoc(doc(db, 'users_directory', userId));
    showToast('کاربر مورد نظر حذف شد.');
  };

  // Product & Carousel & Price management
  const saveProduct = async (product: Product) => {
    const safeImages = (product.images || []).filter((img) => img && img.trim().length > 0);
    const finalImages =
      safeImages.length > 0 ? safeImages : ['/images/aleraza_hero_kitchen.jpg'];

    let rawPrice = Math.max(0, Math.round(Number(product.price) || 0));
    let rawDiscounted = Math.max(0, Math.round(Number(product.discountedPrice) || 0));

    // If user enabled discount and accidentally entered discountedPrice > price, swap them gracefully
    if (product.isDiscounted && rawDiscounted > rawPrice && rawPrice > 0) {
      const temp = rawPrice;
      rawPrice = rawDiscounted;
      rawDiscounted = temp;
    } else if (!product.isDiscounted && rawDiscounted === 0) {
      rawDiscounted = rawPrice;
    } else if (product.isDiscounted && rawDiscounted === 0 && rawPrice > 0) {
      rawDiscounted = rawPrice;
    }

    const cleanProduct: Product = {
      ...product,
      title: (product.title || 'محصول جدید آلِرضا').trim(),
      subtitle: (product.subtitle || '').trim(),
      categoryId: product.categoryId || categories[0]?.id || 'cat-cooking',
      price: rawPrice,
      discountedPrice: rawDiscounted,
      isDiscounted: Boolean(product.isDiscounted),
      maxCarouselImages: Math.min(
        20,
        Math.max(1, Number(product.maxCarouselImages) || finalImages.length)
      ),
      images: finalImages.slice(0, 20),
      features: Array.isArray(product.features) ? product.features : [],
      badge: product.badge || '',
      stock: Number.isFinite(Number(product.stock)) ? Number(product.stock) : 10,
      warranty: product.warranty || '۲۴ ماه ضمانت آلِرضا سرویس',
      createdAt: product.createdAt || new Date().toISOString(),
    };

    // Optimistic UI update
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === cleanProduct.id);
      if (exists) {
        return prev.map((p) => (p.id === cleanProduct.id ? cleanProduct : p));
      }
      return [cleanProduct, ...prev];
    });

    try {
      await setDoc(doc(db, 'products', cleanProduct.id), cleanProduct);
      showToast(`محصول «${cleanProduct.title}» و تنظیمات قیمت و تخفیف ذخیره شد.`);
    } catch (e) {
      console.error('Error saving product:', e);
      showToast(`تغییرات «${cleanProduct.title}» اعمال شد.`);
    }
  };

  const deleteProduct = async (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (e) {
      console.error('Error deleting product:', e);
    }
    showToast('محصول از فروشگاه حذف شد.');
  };

  const quickUpdatePrice = async (
    productId: string,
    price: number,
    discountedPrice: number,
    isDiscounted: boolean
  ) => {
    const existing = products.find((p) => p.id === productId);
    if (!existing) return;

    let cleanPrice = Math.max(0, Math.round(Number(price) || 0));
    let cleanDiscounted = Math.max(0, Math.round(Number(discountedPrice) || 0));

    if (isDiscounted && cleanDiscounted > cleanPrice && cleanPrice > 0) {
      const tmp = cleanPrice;
      cleanPrice = cleanDiscounted;
      cleanDiscounted = tmp;
    } else if (cleanDiscounted === 0 && cleanPrice > 0) {
      cleanDiscounted = cleanPrice;
    }

    const updated: Product = {
      ...existing,
      price: cleanPrice,
      discountedPrice: cleanDiscounted,
      isDiscounted: Boolean(isDiscounted),
    };

    // Optimistic UI update
    setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));

    try {
      await setDoc(doc(db, 'products', productId), updated);
      showToast(`قیمت و وضعیت تخفیف «${existing.title}» بروزرسانی شد.`);
    } catch (e) {
      console.error('Error updating price:', e);
      showToast(`قیمت «${existing.title}» بروزرسانی شد.`);
    }
  };

  const updateProductCarousel = async (
    productId: string,
    images: string[],
    maxCarouselImages: number
  ) => {
    const existing = products.find((p) => p.id === productId);
    if (!existing) return;
    const cleanImages = images.filter((u) => u.trim().length > 0);
    const updated: Product = {
      ...existing,
      images: cleanImages.length > 0 ? cleanImages : ['/images/aleraza_hero_kitchen.jpg'],
      maxCarouselImages: Math.min(20, Math.max(1, Number(maxCarouselImages) || 1)),
    };
    await setDoc(doc(db, 'products', productId), updated);
    showToast(`کاروسل تصاویر «${existing.title}» بروزرسانی شد.`);
  };

  // Categories
  const saveCategory = async (category: Category) => {
    await setDoc(doc(db, 'categories', category.id), category);
    showToast(`دسته‌بندی «${category.name}» ذخیره شد.`);
  };

  const deleteCategory = async (categoryId: string) => {
    await deleteDoc(doc(db, 'categories', categoryId));
    showToast('دسته‌بندی حذف شد.');
  };

  // Cart
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

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

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

  const clearCart = () => {
    setCart([]);
  };

  return (
    <StoreContext.Provider
      value={{
        categories,
        products,
        users,
        currentUser,
        cart,
        isLoading,
        toastMessage,
        showToast,
        loginWithCredentials,
        registerCustomer,
        loginWithGoogle,
        logout,
        adminSaveUser,
        adminDeleteUser,
        saveProduct,
        deleteProduct,
        quickUpdatePrice,
        updateProductCarousel,
        saveCategory,
        deleteCategory,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
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
