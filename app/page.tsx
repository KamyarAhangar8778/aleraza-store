'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useStore } from '@/components/StoreProvider';
import { Product, calcDiscountPercent } from '@/lib/store-data';
import { AuthModal } from '@/components/AuthModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CartDrawer } from '@/components/CartDrawer';
import { StoreHeader } from '@/components/store/StoreHeader';
import { MobileBottomNav } from '@/components/store/MobileBottomNav';
import { StoreHero } from '@/components/store/StoreHero';
import { SpecialOffersSection } from '@/components/store/SpecialOffersSection';
import { StoreCategories } from '@/components/store/StoreCategories';
import { FeaturedProductsSection } from '@/components/store/FeaturedProductsSection';
import { StorePillarsSection } from '@/components/store/StorePillarsSection';
import { StoreFooter } from '@/components/store/StoreFooter';

/**
 * صفحه اصلی فروشگاه لوازم خانگی و قطعات آلِرضا
 * این کامپوننت به صورت کامپوزیت ماژولار از بخش‌های مجزا و سبک تشکیل شده است.
 */
export default function AlerazaLandingPage() {
  const {
    categories,
    products,
    currentUser,
    cart,
    logout,
    toastMessage,
    isLoading,
  } = useStore();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'discount' | 'price-asc' | 'price-desc'>('default');

  // استیت‌های مدال‌های مشتری (ورود، سبد خرید، مشاهده سریع کالا)
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // کالاهای تخفیف‌دار جهت نمایش در ویترین بالای صفحه
  const discountedProducts = useMemo(
    () => products.filter((p) => p.isDiscounted),
    [products]
  );

  // کالاهای فیلترشده بر اساس دسته‌بندی، جستجو و مرتب‌سازی
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (selectedCategoryId !== 'all') {
      list = list.filter((p) => p.categoryId === selectedCategoryId);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'discount') {
      list.sort(
        (a, b) =>
          calcDiscountPercent(b.price, b.discountedPrice) -
          calcDiscountPercent(a.price, a.discountedPrice)
      );
    } else if (sortBy === 'price-asc') {
      list.sort(
        (a, b) =>
          (a.isDiscounted ? a.discountedPrice : a.price) -
          (b.isDiscounted ? b.discountedPrice : b.price)
      );
    } else if (sortBy === 'price-desc') {
      list.sort(
        (a, b) =>
          (b.isDiscounted ? b.discountedPrice : b.price) -
          (a.isDiscounted ? a.discountedPrice : a.price)
      );
    }
    return list;
  }, [products, selectedCategoryId, searchQuery, sortBy]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#181615]">
      {/* پیام تست یا توست شناور در پایین صفحه */}
      {toastMessage && (
        <div className="fixed bottom-20 sm:bottom-6 left-4 sm:left-6 z-50 flex items-center gap-2.5 rounded-2xl bg-[#181615] px-4 sm:px-5 py-3 sm:py-3.5 text-xs font-bold text-[#FAF7F2] shadow-2xl border border-[#C85A32]/40">
          <CheckCircle2 className="w-4 h-4 text-[#C85A32]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* هدر یکپارچه فروشگاه */}
      <StoreHeader
        currentUser={currentUser}
        totalCartCount={totalCartCount}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        onLogout={logout}
      />

      <main className="flex-1 pb-20 sm:pb-0">
        {/* ۱. بنر هیروی شاخص */}
        <StoreHero />

        {/* ۲. ویترین محصولات تخفیف‌دار اول صفحه */}
        <SpecialOffersSection
          discountedProducts={discountedProducts}
          categories={categories}
          onSelectProduct={(p) => setSelectedProductDetail(p)}
        />

        {/* ۳. انتخاب دسته‌بندی‌های کالا */}
        <StoreCategories
          categories={categories}
          products={products}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(id) => setSelectedCategoryId(id)}
        />

        {/* ۴. کاتالوگ و گرید اصلی محصولات با قابلیت جستجو */}
        <FeaturedProductsSection
          products={products}
          filteredProducts={filteredProducts}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          searchQuery={searchQuery}
          sortBy={sortBy}
          isLoading={isLoading}
          currentUser={currentUser}
          onSearchChange={(q) => setSearchQuery(q)}
          onSortChange={(s) => setSortBy(s)}
          onResetFilters={() => {
            setSelectedCategoryId('all');
            setSearchQuery('');
          }}
          onSelectProduct={(p) => setSelectedProductDetail(p)}
        />

        {/* ۵. ستون‌های گارانتی و اعتمادسازی */}
        <StorePillarsSection />
      </main>

      {/* فوتر فروشگاه */}
      <StoreFooter onOpenAuth={() => setIsAuthOpen(true)} />

      {/* نوار ناوبری ثابت در پایین صفحه برای موبایل */}
      <MobileBottomNav
        currentUser={currentUser}
        totalCartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* مدال‌ها و کشوهای کاربری */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ProductDetailModal
        product={selectedProductDetail}
        category={
          selectedProductDetail
            ? categories.find((c) => c.id === selectedProductDetail.categoryId)
            : undefined
        }
        onClose={() => setSelectedProductDetail(null)}
      />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
