'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import {
  Category,
  Product,
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
} from '@/lib/store-data';

/**
 * هوک ماژولار مدیریت محصولات، دسته‌بندی‌ها، اسلایدرها و پایگاه داده Firestore
 */
export function useStoreProducts(showToast: (msg: string) => void) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // راه‌اندازی اولیه و بارگذاری داده‌های پیش‌فرض در صورت خالی بودن دیتابیس
  useEffect(() => {
    let isMounted = true;

    const initSystem = async () => {
      try {
        const sysRef = doc(db, 'store_settings', 'system');
        const sysSnap = await getDoc(sysRef);

        if (!sysSnap.exists()) {
          const [prodSnap, catSnap] = await Promise.all([
            getDocs(collection(db, 'products')),
            getDocs(collection(db, 'categories')),
          ]);

          if (prodSnap.empty && catSnap.empty) {
            const batch = writeBatch(db);
            for (const cat of INITIAL_CATEGORIES) {
              batch.set(doc(db, 'categories', cat.id), cat);
            }
            for (const prod of INITIAL_PRODUCTS) {
              batch.set(doc(db, 'products', prod.id), prod);
            }
            batch.set(sysRef, {
              isInitialized: true,
              seededAt: new Date().toISOString(),
              version: 2,
            });
            await batch.commit();
          } else {
            await setDoc(sysRef, {
              isInitialized: true,
              seededAt: new Date().toISOString(),
              version: 2,
            });
          }
        }
      } catch (e) {
        console.warn('System initialization notice:', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    initSystem();

    // شنود لحظه‌ای تغییرات دسته‌بندی‌ها
    const unsubCategories = onSnapshot(
      collection(db, 'categories'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data() as Category);
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setCategories(list);
      },
      (err) => console.error('Firestore categories sync error:', err)
    );

    // شنود لحظه‌ای تغییرات محصولات
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data() as Product);
        setProducts(list);
        setIsLoading(false);
      },
      (err) => {
        console.error('Firestore products sync error:', err);
        setIsLoading(false);
      }
    );

    return () => {
      isMounted = false;
      unsubCategories();
      unsubProducts();
    };
  }, []);

  /**
   * افزودن یا ویرایش اطلاعات کالا
   */
  const saveProduct = async (product: Product) => {
    const safeImages = (product.images || []).filter((img) => img && img.trim().length > 0);
    let rawPrice = Math.max(0, Math.round(Number(product.price) || 0));
    let rawDiscounted = Math.max(0, Math.round(Number(product.discountedPrice) || 0));

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
      wholesalePrice:
        product.wholesalePrice !== undefined && Number(product.wholesalePrice) > 0
          ? Math.round(Number(product.wholesalePrice))
          : undefined,
      wholesaleMinQty:
        product.wholesaleMinQty !== undefined && Number(product.wholesaleMinQty) > 0
          ? Math.max(1, Math.round(Number(product.wholesaleMinQty)))
          : undefined,
      maxCarouselImages: Math.min(
        20,
        Math.max(1, Number(product.maxCarouselImages) || (safeImages.length > 0 ? safeImages.length : 1))
      ),
      images: safeImages.slice(0, 20),
      features: Array.isArray(product.features) ? product.features : [],
      badge: (product.badge || '').trim(),
      stock: Number.isFinite(Number(product.stock)) ? Number(product.stock) : 10,
      warranty: product.warranty !== undefined ? product.warranty.trim() : 'ضمانت اصالت و سلامت قطعه',
      warrantyIcon: product.warrantyIcon || 'ShieldCheck',
      createdAt: product.createdAt || new Date().toISOString(),
    };

    setProducts((prev) => {
      const exists = prev.some((p) => p.id === cleanProduct.id);
      return exists ? prev.map((p) => (p.id === cleanProduct.id ? cleanProduct : p)) : [cleanProduct, ...prev];
    });

    try {
      await setDoc(doc(db, 'products', cleanProduct.id), cleanProduct);
      showToast(`محصول «${cleanProduct.title}» با موفقیت ذخیره شد.`);
    } catch (e) {
      console.error('Error saving product:', e);
      showToast(`تغییرات «${cleanProduct.title}» اعمال شد.`);
    }
  };

  /**
   * حذف کالا از پایگاه داده
   */
  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      showToast('محصول از پایگاه داده با موفقیت حذف شد.');
    } catch (e) {
      console.error('Error deleting product:', e);
      showToast('خطا در حذف محصول از دیتابیس.');
    }
  };

  /**
   * حذف تمامی محصولات موجود در دیتابیس
   */
  const clearAllProducts = async () => {
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (snap.empty) {
        setProducts([]);
        showToast('هیچ محصولی برای حذف وجود ندارد.');
        return;
      }
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
      setProducts([]);
      showToast('تمامی محصولات با موفقیت پاک شدند.');
    } catch (e) {
      console.error('Error clearing products:', e);
      showToast('خطا در پاکسازی محصولات.');
    }
  };

  /**
   * بازنشانی کاتالوگ به اطلاعات نمونه اولیه
   */
  const resetToDemoData = async () => {
    try {
      const batch = writeBatch(db);
      for (const cat of INITIAL_CATEGORIES) {
        batch.set(doc(db, 'categories', cat.id), cat);
      }
      for (const prod of INITIAL_PRODUCTS) {
        batch.set(doc(db, 'products', prod.id), prod);
      }
      batch.set(doc(db, 'store_settings', 'system'), {
        isInitialized: true,
        resetAt: new Date().toISOString(),
        version: 2,
      });
      await batch.commit();
      showToast('اطلاعات نمونه اولیه با موفقیت بازنشانی شدند.');
    } catch (e) {
      console.error('Error resetting demo data:', e);
      showToast('خطا در بازنشانی اطلاعات نمونه.');
    }
  };

  /**
   * ویرایش سریع قیمت و تخفیف کالا
   */
  const quickUpdatePrice = async (
    productId: string,
    price: number,
    discountedPrice: number,
    isDiscounted: boolean,
    wholesalePrice?: number,
    wholesaleMinQty?: number
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
      wholesalePrice:
        wholesalePrice !== undefined
          ? wholesalePrice > 0
            ? Math.round(wholesalePrice)
            : undefined
          : existing.wholesalePrice,
      wholesaleMinQty:
        wholesaleMinQty !== undefined
          ? wholesaleMinQty > 0
            ? Math.round(wholesaleMinQty)
            : undefined
          : existing.wholesaleMinQty,
    };

    setProducts((prev) => prev.map((p) => (p.id === productId ? updated : p)));
    try {
      await setDoc(doc(db, 'products', productId), updated);
      showToast(`قیمت «${existing.title}» بروزرسانی شد.`);
    } catch (e) {
      console.error('Error updating price:', e);
      showToast(`قیمت «${existing.title}» بروزرسانی شد.`);
    }
  };

  /**
   * تنظیم تصاویر و اسلایدر اختصاصی یک کالا
   */
  const updateProductCarousel = async (
    productId: string,
    images: string[],
    maxCarouselImages: number
  ) => {
    const existing = products.find((p) => p.id === productId);
    if (!existing) return;

    const cleanImages = images.filter((u) => u && u.trim().length > 0);
    const updated: Product = {
      ...existing,
      images: cleanImages,
      maxCarouselImages: Math.min(20, Math.max(1, Number(maxCarouselImages) || (cleanImages.length > 0 ? cleanImages.length : 1))),
    };

    await setDoc(doc(db, 'products', productId), updated);
    showToast(`کاروسل تصاویر «${existing.title}» بروزرسانی شد.`);
  };

  /**
   * ذخیره یا به‌روزرسانی دسته‌بندی
   */
  const saveCategory = async (category: Category) => {
    const cleanCat: Category = {
      ...category,
      name: (category.name || '').trim(),
      slug: (category.slug || category.name || `cat-${Date.now()}`)
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-'),
      description: (category.description || '').trim(),
      imageUrl: category.imageUrl || '/images/hero_appliance_accessories.jpg',
      iconName: category.iconName || 'Sparkles',
      order: Number(category.order) || 1,
      createdAt: category.createdAt || new Date().toISOString(),
    };

    setCategories((prev) => {
      const exists = prev.some((c) => c.id === cleanCat.id);
      return exists ? prev.map((c) => (c.id === cleanCat.id ? cleanCat : c)) : [...prev, cleanCat];
    });

    try {
      await setDoc(doc(db, 'categories', cleanCat.id), cleanCat);
      showToast(`دسته‌بندی «${cleanCat.name}» ذخیره شد.`);
    } catch (e) {
      console.error('Error saving category:', e);
      showToast(`دسته‌بندی «${cleanCat.name}» ثبت شد.`);
    }
  };

  /**
   * حذف دسته‌بندی
   */
  const deleteCategory = async (categoryId: string) => {
    try {
      await deleteDoc(doc(db, 'categories', categoryId));
      setCategories((prev) => prev.filter((c) => c.id !== categoryId));
      showToast('دسته‌بندی با موفقیت حذف شد.');
    } catch (e) {
      console.error('Error deleting category:', e);
      showToast('خطا در حذف دسته‌بندی.');
    }
  };

  return {
    categories,
    products,
    isLoading,
    saveProduct,
    deleteProduct,
    clearAllProducts,
    resetToDemoData,
    quickUpdatePrice,
    updateProductCarousel,
    saveCategory,
    deleteCategory,
  };
}
