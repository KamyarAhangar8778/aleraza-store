'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  User,
  Sparkles,
  ShieldCheck,
  Truck,
  Headphones,
  Award,
  Search,
  LogOut,
  BadgePercent,
  PhoneCall,
  MapPin,
  CheckCircle2,
  LayoutDashboard,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '@/components/StoreProvider';
import { Product, toPersianDigits, calcDiscountPercent, resolveAssetUrl } from '@/lib/store-data';
import { ProductCard } from '@/components/ProductCard';
import { AuthModal } from '@/components/AuthModal';
import { ProductDetailModal } from '@/components/ProductDetailModal';
import { CartDrawer } from '@/components/CartDrawer';

export default function AlerazaLandingPage() {
  const {
    categories,
    products,
    currentUser,
    cart,
    logout,
    toastMessage,
  } = useStore();

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'default' | 'discount' | 'price-asc' | 'price-desc'>(
    'default'
  );

  // Customer Modals state (Auth, Product Lightbox, Cart)
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Discounted products featured right at the top of the page
  const discountedProducts = useMemo(
    () => products.filter((p) => p.isDiscounted),
    [products]
  );

  // Filtered products for main catalog
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
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 rounded-2xl bg-[#181615] px-5 py-3.5 text-xs font-bold text-[#FAF7F2] shadow-2xl border border-[#C85A32]/40">
          <CheckCircle2 className="w-4 h-4 text-[#C85A32]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Slim WordPress Top Admin Bar (#wpadminbar) when Admin is logged in */}
      {currentUser?.role === 'admin' && (
        <div className="bg-[#1d2327] text-[#f0f0f1] px-4 h-9 flex items-center justify-between text-xs border-b border-black">
          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 font-bold text-white hover:text-[#72aee6] transition"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#72aee6]" />
              <span>پیشخوان مدیریت آلِرضا (WordPress Panel)</span>
            </Link>
            <Link
              href="/admin"
              className="hidden sm:inline-block text-[#c3c4c7] hover:text-white transition"
            >
              + افزودن محصول / تغییر قیمت‌ها / مدیریت کاروسل
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#c3c4c7] hidden sm:inline">
              مدیر فعال: <strong className="text-white">{currentUser.fullName}</strong>
            </span>
            <Link
              href="/admin"
              className="rounded bg-[#2271b1] px-2.5 py-0.5 text-[11px] font-bold text-white hover:bg-[#135e96] transition"
            >
              ورود به پیشخوان ←
            </Link>
          </div>
        </div>
      )}

      {/* Top Storefront Announcement Strip */}
      <div className="bg-[#181615] text-[#FAF7F2] px-4 py-2 text-xs border-b border-white/10">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-md bg-[#D92D20] px-2 py-0.5 text-[11px] font-bold text-white">
              <Sparkles className="w-3 h-3" />
              جشنواره لوازم جانبی و قطعات اورجینال
            </span>
            <span className="text-[#E6DFD3]">
              تخفیف‌های ویژه لوازم جانبی و فیلترهای لوازم خانگی آلِرضا با ضمانت اصالت فیزیکی و ارسال سریع
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-[11px] text-[#B8AFA6]">
            <span className="inline-flex items-center gap-1">
              <PhoneCall className="w-3.5 h-3.5 text-[#C85A32]" />
              مشاوره خرید: ۰۲۱-۸۸۹۹۴۴۰۰
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#E6DFD3]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#181615] text-[#FAF7F2] shadow-md border border-[#C85A32]/40">
              <span className="text-2xl font-black text-[#C85A32]">آ</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black tracking-tight text-[#181615]">
                  آلِرضا
                </h1>
                <span className="rounded-md bg-[#C85A32]/15 px-2 py-0.5 text-[10px] font-extrabold text-[#C85A32]">
                  ALERAZA ACCESSORIES
                </span>
              </div>
              <p className="text-[11px] text-[#6E675F] hidden sm:block">
                مرجع تخصصی لوازم جانبی، فیلترها و قطعات اورجینال لوازم خانگی
              </p>
            </div>
          </div>

          {/* Center Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-bold text-[#4A453F]">
            <a
              href="#top-discounts"
              className="inline-flex items-center gap-1.5 text-[#D92D20] hover:opacity-80 transition"
            >
              <BadgePercent className="w-4 h-4" />
              پیشنهادهای تخفیف‌دار اول صفحه
            </a>
            <a
              href="#categories-section"
              className="hover:text-[#C85A32] transition"
            >
              دسته‌بندی لوازم جانبی
            </a>
            <a
              href="#all-products"
              className="hover:text-[#C85A32] transition"
            >
              کاتالوگ لوازم جانبی و قطعات
            </a>
            <a
              href="#why-aleraza"
              className="hover:text-[#C85A32] transition"
            >
              ضمانت اصالت آلِرضا
            </a>
          </nav>

          {/* Actions: Standalone Admin Route Link, Login/User, Cart */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#1d2327] px-3.5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-[#2271b1] transition"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>پیشخوان مدیریت</span>
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-1.5 rounded-xl bg-white border border-[#DCD4C6] px-3 py-2">
                <div className="text-right">
                  <p className="text-xs font-extrabold text-[#181615] leading-none">
                    {currentUser.fullName}
                  </p>
                  <p className="text-[10px] text-[#1F6E58] font-bold mt-0.5">
                    {currentUser.role === 'admin' ? 'مدیر سیستم' : 'مشتری آلِرضا'}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  title="خروج از حساب"
                  className="mr-1 rounded-lg p-1.5 text-[#8C837A] hover:bg-[#D92D20]/10 hover:text-[#D92D20] transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white border border-[#DCD4C6] px-3.5 py-2.5 text-xs font-bold text-[#181615] hover:border-[#C85A32] transition"
              >
                <User className="w-4 h-4 text-[#C85A32]" />
                <span>ورود / ثبت‌نام</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative inline-flex items-center gap-1.5 rounded-xl bg-[#C85A32] px-3.5 py-2.5 text-xs font-bold text-white hover:bg-[#B04B25] transition"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">سبد خرید</span>
              {totalCartCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#181615] px-1.5 text-[11px] font-extrabold text-white">
                  {toPersianDigits(totalCartCount)}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* =========================================================
            SECTION 1: HERO SHOWCASE BANNER
           ========================================================= */}
        <section
          id="hero-banner"
          className="relative pt-6 pb-8 bg-gradient-to-b from-[#F3EFE6] via-[#FAF7F2] to-[#FAF7F2]"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Clean Customer Hero Showcase */}
            <div className="relative rounded-3xl bg-[#181615] text-[#FAF7F2] overflow-hidden border border-[#C85A32]/30 shadow-xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
                <div className="lg:col-span-7 p-6 sm:p-10 space-y-5 z-10">
                  <div className="inline-flex items-center gap-2 rounded-full bg-[#D92D20] px-3.5 py-1 text-xs font-extrabold text-white shadow">
                    <Sparkles className="w-3.5 h-3.5" />
                    تخفیف‌های ویژه لوازم جانبی و قطعات
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black leading-tight tracking-tight">
                    لوازم جانبی و قطعات <span className="text-[#E59872]">آلِرضا</span>؛ ضامن کارایی و طول عمر لوازم خانگی شما
                  </h2>

                  <p className="text-xs sm:text-sm text-[#DCD4C6] leading-relaxed max-w-2xl">
                    عرضه تخصصی فیلترهای تصفیه آب سایدبای‌ساید، فیلترهای هپا و پارویی توربو جاروبرقی، پورتافیلتر و تمپر باریستا، پایه‌های ضد لرزش ماشین لباسشویی و ظروف سیلیکونی نسوز سرخ‌کن با ضمانت اصالت.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-3">
                    <a
                      href="#categories-section"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#C85A32] px-5 py-3 text-xs font-bold text-white shadow hover:bg-[#B04B25] transition"
                    >
                      <span>مشاهده دسته‌بندی‌های لوازم جانبی</span>
                      <ArrowLeft className="w-4 h-4" />
                    </a>
                    <a
                      href="#discounted-grid"
                      className="inline-flex items-center gap-2 rounded-xl bg-white/10 border border-white/15 px-5 py-3 text-xs font-bold text-white hover:bg-white/20 transition"
                    >
                      <BadgePercent className="w-4 h-4" />
                      پیشنهادهای تخفیف‌دار اول صفحه
                    </a>
                  </div>
                </div>

                <div className="lg:col-span-5 relative h-64 lg:h-full min-h-[280px]">
                  <img
                    src={resolveAssetUrl('/images/hero_appliance_accessories.jpg')}
                    alt="لوازم جانبی و قطعات اورجینال لوازم خانگی آلِرضا"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#181615] via-[#181615]/40 to-transparent lg:block hidden" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181615] via-transparent to-transparent lg:hidden block" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 2 (DIRECTLY UNDER HERO): PRODUCT CATEGORIES
           ========================================================= */}
        <section id="categories-section" className="py-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E6DFD3] pb-3">
            <div>
              <span className="text-xs font-extrabold text-[#C85A32]">
                دسته‌بندی تخصصی لوازم جانبی و قطعات
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#181615] mt-0.5">
                انتخاب دسته‌بندی لوازم جانبی آلِرضا
              </h2>
            </div>
            <span className="text-xs font-semibold text-[#6E675F]">
              برای فیلتر کردن محصولات، روی هر دسته کلیک کنید
            </span>
          </div>

          {/* Interactive Category Cards Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategoryId('all')}
              className={`flex flex-col items-start justify-between rounded-2xl p-4 border text-right transition cursor-pointer ${
                selectedCategoryId === 'all'
                  ? 'bg-[#181615] text-[#FAF7F2] border-[#181615] shadow-md'
                  : 'bg-white text-[#181615] border-[#E6DFD3] hover:border-[#C85A32] hover:shadow-xs'
              }`}
            >
              <span className="text-xs font-extrabold text-[#C85A32]">همه دسته‌ها</span>
              <div className="mt-3">
                <p className="text-sm font-black">تمام قطعات و لوازم</p>
                <p className="text-[11px] opacity-75 mt-0.5">
                  {toPersianDigits(products.length)} کالا
                </p>
              </div>
            </button>

            {categories.map((cat) => {
              const count = products.filter((p) => p.categoryId === cat.id).length;
              const active = selectedCategoryId === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`flex flex-col items-start justify-between rounded-2xl p-4 border text-right transition cursor-pointer ${
                    active
                      ? 'bg-[#C85A32] text-white border-[#C85A32] shadow-md'
                      : 'bg-white text-[#181615] border-[#E6DFD3] hover:border-[#C85A32] hover:shadow-xs'
                  }`}
                >
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      active
                        ? 'bg-white/20 text-white'
                        : 'bg-[#F3EFE6] text-[#C85A32]'
                    }`}
                  >
                    {toPersianDigits(count)} کالا
                  </span>
                  <div className="mt-3">
                    <p className="text-sm font-extrabold line-clamp-1">{cat.name}</p>
                    <p
                      className={`text-[11px] line-clamp-1 mt-0.5 ${
                        active ? 'text-white/85' : 'text-[#6E675F]'
                      }`}
                    >
                      {cat.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            SECTION 3: DISCOUNTED PRODUCTS SHOWCASE (TOP DISCOUNTS)
           ========================================================= */}
        <section
          id="discounted-grid"
          className="py-10 bg-gradient-to-b from-[#F3EFE6]/60 via-[#FAF7F2] to-[#FAF7F2] border-y border-[#E6DFD3]"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#E6DFD3] pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#D92D20] mb-1">
                  <Sparkles className="w-4 h-4" />
                  پیشنهادهای شگفت‌انگیز اول صفحه
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#181615]">
                  لوازم جانبی تخفیف‌دار ویژه آلِرضا ({toPersianDigits(discountedProducts.length)} کالا)
                </h3>
              </div>
              <span className="text-xs text-[#6E675F]">
                تخفیف‌های ویژه با زمان و تعداد محدود
              </span>
            </div>

            {discountedProducts.length === 0 ? (
              <div className="rounded-2xl bg-white border border-[#E6DFD3] p-8 text-center">
                <p className="text-sm font-bold text-[#6E675F]">
                  در حال حاضر محصولی در لیست تخفیف ویژه قرار ندارد.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {discountedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    category={categories.find((c) => c.id === product.categoryId)}
                    isFeaturedDiscount={true}
                    onSelectProduct={(p) => setSelectedProductDetail(p)}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* =========================================================
            SECTION 4: FULL PRODUCT CATALOG & SEARCH/SORT TOOLBAR
           ========================================================= */}
        <section id="all-products-section" className="py-12 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="text-xs font-extrabold text-[#C85A32]">
                کاتالوگ کامل
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#181615] mt-1">
                {selectedCategoryId === 'all'
                  ? 'تمامی لوازم جانبی و قطعات لوازم خانگی'
                  : categories.find((c) => c.id === selectedCategoryId)?.name || 'محصولات دسته‌بندی'}
              </h2>
            </div>
            <span className="text-xs text-[#6E675F]">
              نمایش {toPersianDigits(filteredProducts.length)} از {toPersianDigits(products.length)} کالا
            </span>
          </div>

          {/* Search & Sort Toolbar */}
          <div
            id="all-products"
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white border border-[#E6DFD3] p-4 shadow-xs"
          >
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-[#8C837A] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجوی نام قطعه، فیلتر، مدل یا برند..."
                className="w-full rounded-xl bg-[#FAF7F2] border border-[#DCD4C6] pr-10 pl-4 py-2.5 text-xs text-[#181615] focus:border-[#C85A32] focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[#6E675F] font-bold">مرتب‌سازی:</span>
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as 'default' | 'discount' | 'price-asc' | 'price-desc'
                  )
                }
                className="rounded-xl bg-[#FAF7F2] border border-[#DCD4C6] px-3 py-2 text-xs font-bold text-[#181615] focus:outline-none cursor-pointer"
              >
                <option value="default">پیش‌فرض (جدیدترین‌ها)</option>
                <option value="discount">بیشترین درصد تخفیف</option>
                <option value="price-asc">ارزان‌ترین قیمت</option>
                <option value="price-desc">گران‌ترین قیمت</option>
              </select>
            </div>
          </div>

          {/* Filtered Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="rounded-3xl bg-white border border-[#E6DFD3] p-12 text-center space-y-3">
              <p className="text-base font-extrabold text-[#181615]">
                محصولی مطابق با فیلتر انتخابی یافت نشد
              </p>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategoryId('all');
                  setSearchQuery('');
                }}
                className="rounded-xl bg-[#C85A32] px-4 py-2 text-xs font-bold text-white"
              >
                نمایش همه محصولات آلِرضا
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  category={categories.find((c) => c.id === product.categoryId)}
                  onSelectProduct={(p) => setSelectedProductDetail(p)}
                />
              ))}
            </div>
          )}
        </section>

        {/* =========================================================
            SECTION 3: WHY ALERAZA (TRUST & GUARANTEE PILLARS)
           ========================================================= */}
        <section
          id="why-aleraza"
          className="py-14 bg-[#F3EFE6] border-t border-[#E6DFD3]"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-extrabold text-[#C85A32]">
                تعهد کیفیت و اصالت
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#181615] mt-1">
                چرا خانواده‌های ایرانی لوازم خانگی آلِرضا را انتخاب می‌کنند؟
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="rounded-2xl bg-white border border-[#E6DFD3] p-6 space-y-2.5">
                <div className="h-11 w-11 rounded-xl bg-[#C85A32]/15 text-[#C85A32] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-[#181615]">
                  ۳۶ ماه ضمانت طلایی آلِرضا سرویس
                </h3>
                <p className="text-xs text-[#6E675F] leading-relaxed">
                  تمامی کالاها با برگه گارانتی معتبر شرکتی و تضمین تأمین قطعات اورجینال عرضه می‌شوند.
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-[#E6DFD3] p-6 space-y-2.5">
                <div className="h-11 w-11 rounded-xl bg-[#1F6E58]/15 text-[#1F6E58] flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-[#181615]">
                  ارسال ایمن و نصب تخصصی رایگان
                </h3>
                <p className="text-xs text-[#6E675F] leading-relaxed">
                  حمل اختصاصی با بیمه کامل سلامت فیزیکی کالا و نصب توسط تکنسین‌های مجاز در سراسر کشور.
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-[#E6DFD3] p-6 space-y-2.5">
                <div className="h-11 w-11 rounded-xl bg-[#C85A32]/15 text-[#C85A32] flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-[#181615]">
                  تضمین اصالت ۱۰۰٪ کالا
                </h3>
                <p className="text-xs text-[#6E675F] leading-relaxed">
                  ارائه کد رهگیری و شناسه اصالت کالا برای تمام لوازم برقی آشپزخانه و شستشو.
                </p>
              </div>

              <div className="rounded-2xl bg-white border border-[#E6DFD3] p-6 space-y-2.5">
                <div className="h-11 w-11 rounded-xl bg-[#1F6E58]/15 text-[#1F6E58] flex items-center justify-center">
                  <Headphones className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-extrabold text-[#181615]">
                  مشاوره تخصصی پیش از خرید
                </h3>
                <p className="text-xs text-[#6E675F] leading-relaxed">
                  کارشناسان فروش آلِرضا آماده راهنمایی برای انتخاب بهترین ست جهیزیه و لوازم آشپزخانه هستند.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#181615] text-[#FAF7F2] py-12 border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C85A32] text-white font-black text-lg">
                آ
              </div>
              <span className="text-xl font-black">فروشگاه لوازم خانگی آلِرضا</span>
            </div>
            <p className="text-xs text-[#B8AFA6] leading-relaxed max-w-md">
              مرجع تخصصی لوازم جانبی آلِرضا، عرضه‌کننده مستقیم فیلترهای تصفیه آب و هوای سایدبای‌ساید، فیلتر هپا و قطعات جاروبرقی، تجهیزات باریستا و اسپرسوساز، پایه‌های ضد لرزش و ملزومات مصرفی لوازم خانگی با ضمانت اصالت فیزیکی.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#DCD4C6]">
              <span className="inline-flex items-center gap-1.5">
                <PhoneCall className="w-4 h-4 text-[#C85A32]" />
                ۰۲۱-۸۸۹۹۴۴۰۰
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#C85A32]" />
                تهران، بلوار آفریقا، گالری مرکزی آلِرضا
              </span>
            </div>
          </div>

          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-sm font-extrabold text-[#E59872]">بخش‌های فروشگاه</h4>
            <ul className="space-y-2 text-xs text-[#DCD4C6]">
              <li>
                <a href="#top-discounts" className="hover:text-white transition">
                  • جشنواره تخفیف‌های ویژه اول صفحه
                </a>
              </li>
              <li>
                <a href="#categories-section" className="hover:text-white transition">
                  • دسته‌بندی‌های لوازم خانگی آلِرضا
                </a>
              </li>
              <li>
                <a href="#all-products" className="hover:text-white transition">
                  • کاتالوگ کامل محصولات
                </a>
              </li>
              <li>
                <Link href="/admin" className="text-[#72aee6] hover:underline font-bold">
                  • ورود به پیشخوان مدیریت سایت (WordPress Admin)
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h4 className="text-sm font-extrabold text-[#E59872]">حساب کاربری و مدیریت</h4>
            <p className="text-xs text-[#B8AFA6] leading-relaxed">
              ورود سریع مشتریان با شماره موبایل و رمز عبور یا دسترسی به پیشخوان مجزای مدیریت.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="w-full rounded-xl bg-[#C85A32] py-2.5 text-xs font-bold text-white hover:bg-[#B04B25] transition"
              >
                ورود / ثبت‌نام مشتریان
              </button>
              <Link
                href="/admin"
                className="w-full text-center rounded-xl bg-white/10 border border-white/15 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                ورود به پنل مدیریت مجزا (/admin)
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Customer Modals & Drawers */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

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
