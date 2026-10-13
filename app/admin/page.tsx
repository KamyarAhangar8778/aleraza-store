'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/components/StoreProvider';
import {
  warmUpBrowserAssetCache,
  IMAGE_CACHE_NAME,
  FONT_CACHE_NAME,
} from '@/components/AssetCacheManager';
import {
  Product,
  PRESET_APPLIANCE_GALLERY,
} from '@/lib/store-data';
import { AdminLoginScreen } from '@/components/admin/AdminLoginScreen';
import { AdminSidebar, WpSection } from '@/components/admin/AdminSidebar';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { DashboardSection } from '@/components/admin/sections/DashboardSection';
import { ProductsSection } from '@/components/admin/sections/ProductsSection';
import { ProductFormSection } from '@/components/admin/sections/ProductFormSection';
import { QuickPricingSection } from '@/components/admin/sections/QuickPricingSection';
import { CategoriesSection } from '@/components/admin/sections/CategoriesSection';
import { CarouselsSection } from '@/components/admin/sections/CarouselsSection';
import { UsersSection } from '@/components/admin/sections/UsersSection';

/**
 * صفحه اصلی پیشخوان مدیریت فروشگاه آلِرضا (WordPress Admin Orchestrator)
 * کلیه بخش‌ها به کامپوننت‌های ماژولار زیر ۳۰۰ سطر تفکیک شده‌اند.
 */
export default function WordPressAdminPage() {
  const {
    categories,
    products,
    users,
    currentUser,
    loginWithCredentials,
    loginWithGoogle,
    logout,
    saveProduct,
    deleteProduct,
    clearAllProducts,
    resetToDemoData,
    quickUpdatePrice,
    updateProductCarousel,
    saveCategory,
    deleteCategory,
    adminSaveUser,
    adminDeleteUser,
  } = useStore();

  const [activeSection, setActiveSection] = useState<WpSection>('dashboard');
  const [searchFilter, setSearchFilter] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  // استیت فرم محصول جدید یا در حال ویرایش
  const createBlankProduct = (): Product => ({
    id: `prod-${Date.now()}`,
    title: '',
    subtitle: '',
    categoryId: categories[0]?.id || 'cat-cooking',
    price: 18500000,
    discountedPrice: 15900000,
    isDiscounted: true,
    images: [],
    maxCarouselImages: 3,
    features: ['گارانتی ۳۶ ماهه طلایی آلِرضا سرویس', 'ارسال و نصب رایگان در سراسر کشور'],
    badge: 'پیشنهاد ویژه',
    stock: 12,
    warranty: '۳۶ ماه ضمانت طلایی آلِرضا',
    createdAt: new Date().toISOString(),
  });

  const [editingProduct, setEditingProduct] = useState<Product>(createBlankProduct);
  const [isNewProductMode, setIsNewProductMode] = useState(true);
  const [selectedMediaProductId, setSelectedMediaProductId] = useState<string>('');

  // آمار کش تصاویر و فونت‌ها در Service Worker مرورگر
  const [cacheStats, setCacheStats] = useState({ images: 0, fonts: 0, warming: false });

  const refreshCacheStats = async () => {
    if (typeof window === 'undefined' || !('caches' in window)) return;
    setCacheStats((prev) => ({ ...prev, warming: true }));
    const allUrls = Array.from(
      new Set([
        '/images/aleraza_hero_kitchen.jpg',
        ...products.flatMap((p) => p.images || []),
        ...PRESET_APPLIANCE_GALLERY.map((g) => g.url),
      ].filter((u) => u && !u.startsWith('data:')))
    );
    await warmUpBrowserAssetCache(allUrls);
    try {
      const imgCache = await window.caches.open(IMAGE_CACHE_NAME);
      const fontCache = await window.caches.open(FONT_CACHE_NAME);
      const imgKeys = await imgCache.keys();
      const fontKeys = await fontCache.keys();
      setCacheStats({
        images: imgKeys.length || allUrls.length,
        fonts: Math.max(fontKeys.length, 1),
        warming: false,
      });
    } catch {
      setCacheStats({ images: allUrls.length, fonts: 1, warming: false });
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined' || products.length === 0) return;
    const allUrls = Array.from(
      new Set([
        '/images/aleraza_hero_kitchen.jpg',
        ...products.flatMap((p) => p.images || []),
        ...PRESET_APPLIANCE_GALLERY.map((g) => g.url),
      ].filter((u) => u && !u.startsWith('data:')))
    );
    warmUpBrowserAssetCache(allUrls).then(() => {
      if ('caches' in window) {
        Promise.all([
          window.caches.open(IMAGE_CACHE_NAME).then((c) => c.keys()),
          window.caches.open(FONT_CACHE_NAME).then((c) => c.keys()),
        ]).then(([imgKeys, fontKeys]) => {
          setCacheStats({
            images: imgKeys.length || allUrls.length,
            fonts: Math.max(fontKeys.length, 1),
            warming: false,
          });
        }).catch(() => {});
      }
    }).catch(() => {});
  }, [products]);

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct({
      ...prod,
      images: [...prod.images],
      features: [...(prod.features || [])],
    });
    setIsNewProductMode(false);
    setActiveSection('edit-product');
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(createBlankProduct());
    setIsNewProductMode(true);
    setActiveSection('edit-product');
  };

  // اگر کاربر هنوز وارد نشده باشد، صفحه ورود نمایش داده می‌شود
  if (!currentUser) {
    return (
      <AdminLoginScreen
        onLogin={loginWithCredentials}
        onLoginWithGoogle={loginWithGoogle}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f0f1] text-[#1d2327] flex flex-col font-sans">
      {/* نوار ابزار بالای پیشخوان */}
      <AdminHeader currentUser={currentUser} />

      <div className="flex-1 flex flex-col md:flex-row">
        {/* سایدبار منوی مدیریت */}
        <AdminSidebar
          activeSection={activeSection}
          isNewProductMode={isNewProductMode}
          onSelectSection={(sec) => setActiveSection(sec)}
          onOpenNewProduct={handleOpenNewProduct}
          onLogout={logout}
        />

        {/* محتوای پویای بخش‌های مدیریت */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {activeSection === 'dashboard' && (
            <DashboardSection
              products={products}
              categories={categories}
              users={users}
              cacheStats={cacheStats}
              onRefreshCache={refreshCacheStats}
              onSelectSection={(sec) => setActiveSection(sec)}
              onEditProduct={handleOpenEditProduct}
            />
          )}

          {activeSection === 'all-products' && (
            <ProductsSection
              products={products}
              categories={categories}
              catFilter={catFilter}
              searchFilter={searchFilter}
              onCatFilterChange={(c) => setCatFilter(c)}
              onSearchFilterChange={(s) => setSearchFilter(s)}
              onOpenNewProduct={handleOpenNewProduct}
              onOpenEditProduct={handleOpenEditProduct}
              onOpenMediaProduct={(prodId) => {
                setSelectedMediaProductId(prodId);
                setActiveSection('media-carousels');
              }}
              onDeleteProduct={deleteProduct}
              onClearAllProducts={clearAllProducts}
              onResetDemoData={resetToDemoData}
            />
          )}

          {activeSection === 'edit-product' && (
            <ProductFormSection
              editingProduct={editingProduct}
              isNewProductMode={isNewProductMode}
              categories={categories}
              onChangeProduct={(updated) => setEditingProduct(updated)}
              onSaveProduct={async (prod) => {
                await saveProduct(prod);
                setIsNewProductMode(false);
              }}
              onCancel={() => setActiveSection('all-products')}
            />
          )}

          {activeSection === 'quick-pricing' && (
            <QuickPricingSection
              products={products}
              onQuickUpdatePrice={quickUpdatePrice}
              onUpdateProductCarousel={updateProductCarousel}
            />
          )}

          {activeSection === 'categories' && (
            <CategoriesSection
              categories={categories}
              products={products}
              onSaveCategory={saveCategory}
              onDeleteCategory={deleteCategory}
            />
          )}

          {activeSection === 'media-carousels' && (
            <CarouselsSection
              products={products}
              selectedMediaProductId={selectedMediaProductId}
              onSelectMediaProduct={(id) => setSelectedMediaProductId(id)}
              onUpdateProductCarousel={updateProductCarousel}
            />
          )}

          {(activeSection === 'all-users' || activeSection === 'add-user') && (
            <UsersSection
              users={users}
              activeSubSection={activeSection}
              onSelectSubSection={(sub) => setActiveSection(sub)}
              onAdminSaveUser={adminSaveUser}
              onAdminDeleteUser={adminDeleteUser}
            />
          )}
        </main>
      </div>
    </div>
  );
}
