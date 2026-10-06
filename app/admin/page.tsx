'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tags,
  Users,
  UserPlus,
  Images,
  BadgePercent,
  ExternalLink,
  LogOut,
  Search,
  Trash2,
  Edit3,
  Check,
  Upload,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Shield,
  Lock,
  Phone,
  User,
  KeyRound,
  Save,
  ChevronLeft,
  Eye,
  CheckCircle2,
  Layers,
  SlidersHorizontal,
  Home,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { useStore } from '@/components/StoreProvider';
import {
  warmUpBrowserAssetCache,
  IMAGE_CACHE_NAME,
  FONT_CACHE_NAME,
} from '@/components/AssetCacheManager';
import {
  Product,
  Category,
  UserAccount,
  PRESET_APPLIANCE_GALLERY,
  formatToman,
  toPersianDigits,
  calcDiscountPercent,
  parsePriceInput,
  formatNumericInput,
  resolveAssetUrl,
} from '@/lib/store-data';

type WpSection =
  | 'dashboard'
  | 'all-products'
  | 'edit-product'
  | 'quick-pricing'
  | 'categories'
  | 'media-carousels'
  | 'all-users'
  | 'add-user';

export default function WordPressAdminPage() {
  const {
    categories,
    products,
    users,
    currentUser,
    toastMessage,
    loginWithCredentials,
    loginWithGoogle,
    logout,
    saveProduct,
    deleteProduct,
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

  // Login screen state (when not logged in or not admin)
  const [loginPhone, setLoginPhone] = useState('09120000000');
  const [loginPass, setLoginPass] = useState('123456');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Product Editor State (WooCommerce style)
  const createBlankProduct = (): Product => ({
    id: `prod-${Date.now()}`,
    title: '',
    subtitle: '',
    categoryId: categories[0]?.id || 'cat-cooking',
    price: 18500000,
    discountedPrice: 15900000,
    isDiscounted: true,
    images: ['/images/aleraza_hero_kitchen.jpg'],
    maxCarouselImages: 3,
    features: ['گارانتی ۳۶ ماهه طلایی آلِرضا سرویس', 'ارسال و نصب رایگان در سراسر کشور'],
    badge: 'پیشنهاد ویژه',
    stock: 12,
    warranty: '۳۶ ماه ضمانت طلایی آلِرضا',
    createdAt: new Date().toISOString(),
  });

  const [editingProduct, setEditingProduct] = useState<Product>(createBlankProduct);
  const [isNewProductMode, setIsNewProductMode] = useState(true);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newFeatureText, setNewFeatureText] = useState('');

  // Quick Pricing Table State
  const [priceDrafts, setPriceDrafts] = useState<
    Record<
      string,
      { price: number; discountedPrice: number; isDiscounted: boolean; maxCarouselImages: number }
    >
  >({});

  // Category Form State
  const [editingCategory, setEditingCategory] = useState<Category>({
    id: `cat-${Date.now()}`,
    name: '',
    slug: '',
    description: '',
    imageUrl: '/images/hero_appliance_accessories.jpg',
    iconName: 'Sparkles',
    order: categories.length + 1,
    createdAt: new Date().toISOString(),
  });
  const [isEditingExistingCat, setIsEditingExistingCat] = useState(false);

  // User Form State
  const [editingUser, setEditingUser] = useState<UserAccount>({
    id: `user-${Date.now()}`,
    fullName: '',
    phone: '',
    password: '',
    role: 'customer',
    email: '',
    createdAt: new Date().toISOString(),
    createdBy: 'admin',
  });
  const [isEditingExistingUser, setIsEditingExistingUser] = useState(false);

  // Media / Carousel standalone selector
  const [selectedMediaProductId, setSelectedMediaProductId] = useState<string>('');
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
    if (products.length > 0) {
      refreshCacheStats();
    }
  }, [products]);

  useEffect(() => {
    if (!selectedMediaProductId && products.length > 0) {
      setSelectedMediaProductId(products[0].id);
    }
  }, [products, selectedMediaProductId]);

  useEffect(() => {
    const map: Record<
      string,
      { price: number; discountedPrice: number; isDiscounted: boolean; maxCarouselImages: number }
    > = {};
    for (const p of products) {
      map[p.id] = {
        price: p.price,
        discountedPrice: p.discountedPrice,
        isDiscounted: p.isDiscounted,
        maxCarouselImages: p.maxCarouselImages || p.images.length || 1,
      };
    }
    setPriceDrafts(map);
  }, [products]);

  const filteredProductsList = useMemo(() => {
    return products.filter((p) => {
      const matchCat = catFilter === 'all' || p.categoryId === catFilter;
      const matchSearch =
        !searchFilter.trim() ||
        p.title.toLowerCase().includes(searchFilter.trim().toLowerCase()) ||
        p.subtitle.toLowerCase().includes(searchFilter.trim().toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, catFilter, searchFilter]);

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

  // Image Upload helper
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onImageReady: (dataUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 720;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.78);
          onImageReady(dataUrl);
        }
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleWpLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    const res = await loginWithCredentials(loginPhone, loginPass);
    setLoggingIn(false);
    if (!res.ok) {
      setLoginError(res.error || 'اطلاعات ورود اشتباه است.');
    }
  };

  // If not logged in yet, show a classic WordPress wp-login.php style screen
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#f0f0f1] flex flex-col items-center justify-center p-4 text-[#1d2327]">
        <div className="w-full max-w-sm space-y-5">
          {/* WP Style Logo Header */}
          <div className="flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-2xl bg-[#1d2327] text-white flex items-center justify-center text-3xl font-black shadow-md border-2 border-[#2271b1]">
              آ
            </div>
            <h1 className="mt-3 text-xl font-black text-[#1d2327]">
              پیشخوان مدیریت آلِرضا
            </h1>
            <p className="text-xs text-[#50575e] mt-1">
              سیستم مدیریت محتوا، محصولات، کاروسل‌ها و کاربران
            </p>
          </div>

          {/* WP Login Box */}
          <form
            onSubmit={handleWpLogin}
            className="bg-white border border-[#c3c4c7] shadow-xs rounded-md p-6 space-y-4"
          >
            {loginError && (
              <div className="border-r-4 border-[#d63638] bg-[#fcf0f1] p-3 text-xs text-[#1d2327]">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1.5">
                شماره موبایل یا نام کاربری
              </label>
              <input
                type="text"
                dir="ltr"
                required
                value={loginPhone}
                onChange={(e) => setLoginPhone(e.target.value)}
                className="w-full rounded border border-[#8c8f94] px-3 py-2 text-sm font-mono text-left focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1d2327] mb-1.5">
                رمز عبور
              </label>
              <input
                type="password"
                dir="ltr"
                required
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="w-full rounded border border-[#8c8f94] px-3 py-2 text-sm font-mono text-left focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full rounded bg-[#2271b1] hover:bg-[#135e96] py-2.5 text-xs font-bold text-white transition"
            >
              {loggingIn ? 'در حال ورود به پیشخوان...' : 'ورود به پیشخوان وردپرس آلِرضا'}
            </button>

            <div className="pt-2 border-t border-[#dcdcde] space-y-2">
              <button
                type="button"
                onClick={async () => {
                  setLoggingIn(true);
                  await loginWithCredentials('09120000000', '123456');
                  setLoggingIn(false);
                }}
                className="w-full flex items-center justify-center gap-1.5 rounded bg-[#f6f7f7] border border-[#2271b1] py-2 text-xs font-bold text-[#2271b1] hover:bg-[#f0f6fc] transition"
              >
                <KeyRound className="w-3.5 h-3.5" />
                ورود فوری مدیر پیش‌فرض (۰۹۱۲۰۰۰۰۰۰۰ / ۱۲۳۴۵۶)
              </button>

              <button
                type="button"
                onClick={loginWithGoogle}
                className="w-full flex items-center justify-center gap-1.5 rounded bg-white border border-[#c3c4c7] py-2 text-xs font-semibold text-[#1d2327] hover:bg-[#f6f7f7] transition"
              >
                ورود با حساب گوگل
              </button>
            </div>
          </form>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#50575e] hover:text-[#2271b1]"
            >
              ← بازگشت به صفحه اصلی فروشگاه آلِرضا
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discountedCount = products.filter((p) => p.isDiscounted).length;
  const selectedMediaProduct =
    products.find((p) => p.id === selectedMediaProductId) || products[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f1] text-[#1d2327]">
      {/* Floating Toast */}
      {toastMessage && (
        <div className="fixed bottom-5 left-5 z-50 flex items-center gap-2 rounded bg-[#1d2327] border-r-4 border-[#00a32a] px-4 py-3 text-xs font-bold text-white shadow-xl">
          <CheckCircle2 className="w-4 h-4 text-[#00a32a]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* =========================================================
          WORDPRESS TOP ADMIN BAR (#wpadminbar)
         ========================================================= */}
      <header className="sticky top-0 z-40 h-10 bg-[#1d2327] text-[#f0f0f1] px-4 flex items-center justify-between text-xs select-none shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-white">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#2271b1] text-xs font-black">
              آ
            </span>
            <span>سیستم مدیریت آلِرضا</span>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#2c3338] hover:bg-[#2271b1] text-white font-semibold transition"
          >
            <Home className="w-3.5 h-3.5" />
            <span>نمایش سایت (صفحه لندینگ)</span>
            <ExternalLink className="w-3 h-3 opacity-75" />
          </Link>

          <button
            type="button"
            onClick={handleOpenNewProduct}
            className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded hover:bg-[#2c3338] text-[#c3c4c7] hover:text-white transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ افزودن محصول تازه</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsEditingExistingUser(false);
              setEditingUser({
                id: `user-${Date.now()}`,
                fullName: '',
                phone: '',
                password: '',
                role: 'customer',
                email: '',
                createdAt: new Date().toISOString(),
                createdBy: 'admin',
              });
              setActiveSection('add-user');
            }}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1 rounded hover:bg-[#2c3338] text-[#c3c4c7] hover:text-white transition"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ کاربر تازه</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[#c3c4c7]">
            سلام، <strong className="text-white">{currentUser.fullName}</strong>
          </span>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1 rounded bg-[#d63638]/20 hover:bg-[#d63638] px-2.5 py-1 text-[11px] font-bold text-[#ff8082] hover:text-white transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            خروج
          </button>
        </div>
      </header>

      {/* =========================================================
          WORDPRESS BODY: RIGHT SIDEBAR (#adminmenumain) + WORKSPACE
         ========================================================= */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* WordPress Classic Dark Sidebar */}
        <aside className="w-full md:w-60 bg-[#1d2327] text-[#f0f0f1] flex-shrink-0 flex flex-col justify-between border-l border-[#2c3338]">
          <nav className="py-2 space-y-0.5 text-xs">
            {/* Dashboard */}
            <button
              type="button"
              onClick={() => setActiveSection('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 font-bold transition border-r-4 ${
                activeSection === 'dashboard'
                  ? 'bg-[#2271b1] text-white border-white'
                  : 'border-transparent text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6]'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>پیشخوان</span>
            </button>

            {/* WooCommerce / Products Group */}
            <div className="pt-2">
              <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8c8f94]">
                فروشگاه و محصولات
              </div>

              <button
                type="button"
                onClick={() => setActiveSection('all-products')}
                className={`w-full flex items-center justify-between px-4 py-2.5 font-bold transition border-r-4 ${
                  activeSection === 'all-products'
                    ? 'bg-[#2271b1] text-white border-white'
                    : 'border-transparent text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>همه محصولات</span>
                </span>
                <span className="rounded-full bg-[#2c3338] px-2 py-0.5 text-[10px] text-white">
                  {toPersianDigits(products.length)}
                </span>
              </button>

              <button
                type="button"
                onClick={handleOpenNewProduct}
                className={`w-full flex items-center gap-3 pr-9 pl-4 py-2 text-[11px] font-semibold transition border-r-4 ${
                  activeSection === 'edit-product' && isNewProductMode
                    ? 'bg-[#2c3338] text-white border-[#72aee6]'
                    : 'border-transparent text-[#a7aaad] hover:text-white hover:bg-[#2c3338]/50'
                }`}
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>افزودن محصول جدید</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('quick-pricing')}
                className={`w-full flex items-center justify-between pr-9 pl-4 py-2 text-[11px] font-semibold transition border-r-4 ${
                  activeSection === 'quick-pricing'
                    ? 'bg-[#2c3338] text-white border-[#72aee6]'
                    : 'border-transparent text-[#a7aaad] hover:text-white hover:bg-[#2c3338]/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <BadgePercent className="w-3.5 h-3.5 text-[#f0b849]" />
                  <span>تغییر قیمت‌ها و تخفیف اول صفحه</span>
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSection('categories')}
                className={`w-full flex items-center justify-between pr-9 pl-4 py-2 text-[11px] font-semibold transition border-r-4 ${
                  activeSection === 'categories'
                    ? 'bg-[#2c3338] text-white border-[#72aee6]'
                    : 'border-transparent text-[#a7aaad] hover:text-white hover:bg-[#2c3338]/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Tags className="w-3.5 h-3.5" />
                  <span>دسته‌بندی‌ها</span>
                </span>
                <span className="text-[10px] opacity-75">
                  {toPersianDigits(categories.length)}
                </span>
              </button>
            </div>

            {/* Media & Carousels */}
            <div className="pt-2">
              <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8c8f94]">
                رسانه و اسلایدرها
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('media-carousels')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold transition border-r-4 ${
                  activeSection === 'media-carousels'
                    ? 'bg-[#2271b1] text-white border-white'
                    : 'border-transparent text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <Images className="w-4 h-4" />
                <span>مدیریت کاروسل تصاویر</span>
              </button>
            </div>

            {/* Users Management */}
            <div className="pt-2">
              <div className="px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#8c8f94]">
                کاربران و دسترسی‌ها
              </div>
              <button
                type="button"
                onClick={() => setActiveSection('all-users')}
                className={`w-full flex items-center justify-between px-4 py-2.5 font-bold transition border-r-4 ${
                  activeSection === 'all-users'
                    ? 'bg-[#2271b1] text-white border-white'
                    : 'border-transparent text-[#c3c4c7] hover:bg-[#2c3338] hover:text-[#72aee6]'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Users className="w-4 h-4" />
                  <span>همه کاربران</span>
                </span>
                <span className="rounded-full bg-[#2c3338] px-2 py-0.5 text-[10px] text-white">
                  {toPersianDigits(users.length)}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEditingExistingUser(false);
                  setEditingUser({
                    id: `user-${Date.now()}`,
                    fullName: '',
                    phone: '',
                    password: '',
                    role: 'customer',
                    email: '',
                    createdAt: new Date().toISOString(),
                    createdBy: 'admin',
                  });
                  setActiveSection('add-user');
                }}
                className={`w-full flex items-center gap-3 pr-9 pl-4 py-2 text-[11px] font-semibold transition border-r-4 ${
                  activeSection === 'add-user'
                    ? 'bg-[#2c3338] text-white border-[#72aee6]'
                    : 'border-transparent text-[#a7aaad] hover:text-white hover:bg-[#2c3338]/50'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>افزودن کاربر (شماره، نام، رمز)</span>
              </button>
            </div>
          </nav>

          {/* Bottom View Site Card */}
          <div className="p-3 m-3 rounded bg-[#2c3338] text-[11px] text-[#c3c4c7] space-y-2">
            <p className="font-bold text-white">مشاهده تغییرات در سایت</p>
            <p className="leading-relaxed text-[10px]">
              تمامی تغییرات قیمت، کاروسل و دسته‌بندی‌ها به صورت آنی در صفحه لندینگ اعمال می‌شوند.
            </p>
            <Link
              href="/"
              className="flex items-center justify-center gap-1.5 w-full rounded bg-[#2271b1] hover:bg-[#135e96] py-1.5 text-white font-bold transition"
            >
              <Eye className="w-3.5 h-3.5" />
              مشاهده صفحه اصلی آلِرضا
            </Link>
          </div>
        </aside>

        {/* =========================================================
            MAIN WORDPRESS CONTENT AREA (#wpbody-content)
           ========================================================= */}
        <main className="flex-1 p-5 sm:p-8 overflow-y-auto max-w-7xl">
          {/* 1. DASHBOARD HOME */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-[#1d2327]">
                    پیشخوان مدیریت لوازم جانبی و قطعات آلِرضا
                  </h1>
                  <p className="text-xs text-[#50575e] mt-1">
                    به پنل مدیریت اختصاصی خوش آمدید. از منوی سمت راست می‌توانید لوازم جانبی و قطعات، کاروسل تصاویر، قیمت‌ها، دسته‌بندی‌ها و کاربران را مدیریت کنید.
                  </p>
                </div>

                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded bg-[#2271b1] px-4 py-2 text-xs font-bold text-white hover:bg-[#135e96] transition"
                >
                  <ExternalLink className="w-4 h-4" />
                  مشاهده زنده لندینگ پیج آلِرضا
                </Link>
              </div>

              {/* WordPress Welcome Panel */}
              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm p-6">
                <h2 className="text-base font-bold text-[#1d2327]">
                  دسترسی سریع به بخش‌های اصلی فروشگاه آلِرضا
                </h2>
                <p className="text-xs text-[#50575e] mt-1">
                  هر یک از عملیات مورد نظر خود را انتخاب کنید:
                </p>

                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveSection('media-carousels')}
                    className="flex flex-col items-start p-4 rounded border border-[#c3c4c7] hover:border-[#2271b1] hover:bg-[#f0f6fc] text-right transition"
                  >
                    <Images className="w-6 h-6 text-[#2271b1] mb-2" />
                    <span className="text-xs font-bold text-[#1d2327]">
                      تنظیم تعداد و عکس‌های کاروسل
                    </span>
                    <span className="text-[11px] text-[#50575e] mt-1">
                      افزودن، حذف، ویرایش و تعیین تعداد اسلایدهای هر محصول
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('quick-pricing')}
                    className="flex flex-col items-start p-4 rounded border border-[#c3c4c7] hover:border-[#2271b1] hover:bg-[#f0f6fc] text-right transition"
                  >
                    <BadgePercent className="w-6 h-6 text-[#d63638] mb-2" />
                    <span className="text-xs font-bold text-[#1d2327]">
                      ویرایش قیمت‌ها و تخفیف اول صفحه
                    </span>
                    <span className="text-[11px] text-[#50575e] mt-1">
                      تغییر سریع قیمت‌ها و انتخاب محصولات تخفیف‌دار ابتدای سایت
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('categories')}
                    className="flex flex-col items-start p-4 rounded border border-[#c3c4c7] hover:border-[#2271b1] hover:bg-[#f0f6fc] text-right transition"
                  >
                    <Tags className="w-6 h-6 text-[#00a32a] mb-2" />
                    <span className="text-xs font-bold text-[#1d2327]">
                      مدیریت دسته‌بندی محصولات
                    </span>
                    <span className="text-[11px] text-[#50575e] mt-1">
                      ایجاد، ویرایش و حذف دسته‌بندی‌های لوازم خانگی
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSection('add-user')}
                    className="flex flex-col items-start p-4 rounded border border-[#c3c4c7] hover:border-[#2271b1] hover:bg-[#f0f6fc] text-right transition"
                  >
                    <UserPlus className="w-6 h-6 text-[#2271b1] mb-2" />
                    <span className="text-xs font-bold text-[#1d2327]">
                      افزودن کاربر (شماره، نام و رمز)
                    </span>
                    <span className="text-[11px] text-[#50575e] mt-1">
                      تعریف دستی مشتری یا مدیر جدید با شماره و رمز عبور
                    </span>
                  </button>
                </div>
              </div>

              {/* At a Glance (در یک نگاه) Widgets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm">
                  <div className="border-b border-[#c3c4c7] px-4 py-3 font-bold text-xs text-[#1d2327]">
                    در یک نگاه (وضعیت فروشگاه آلِرضا)
                  </div>
                  <div className="p-4 grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3 rounded bg-[#f6f7f7] border border-[#dcdcde]">
                      <span className="text-[#50575e]">کل محصولات ثبت‌شده:</span>
                      <p className="text-lg font-black text-[#2271b1] mt-1">
                        {toPersianDigits(products.length)} کالا
                      </p>
                    </div>
                    <div className="p-3 rounded bg-[#fcf0f1] border border-[#f5c2c7]">
                      <span className="text-[#50575e]">محصولات تخفیف‌دار اول صفحه:</span>
                      <p className="text-lg font-black text-[#d63638] mt-1">
                        {toPersianDigits(discountedCount)} کالا
                      </p>
                    </div>
                    <div className="p-3 rounded bg-[#f6f7f7] border border-[#dcdcde]">
                      <span className="text-[#50575e]">دسته‌بندی‌های فعال:</span>
                      <p className="text-lg font-black text-[#00a32a] mt-1">
                        {toPersianDigits(categories.length)} دسته
                      </p>
                    </div>
                    <div className="p-3 rounded bg-[#f6f7f7] border border-[#dcdcde]">
                      <span className="text-[#50575e]">کاربران ثبت‌شده:</span>
                      <p className="text-lg font-black text-[#1d2327] mt-1">
                        {toPersianDigits(users.length)} کاربر
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recent Discounted Products Widget */}
                <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm">
                  <div className="border-b border-[#c3c4c7] px-4 py-3 flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1d2327]">
                      محصولات در ویترین تخفیف اول صفحه
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveSection('quick-pricing')}
                      className="text-[11px] font-bold text-[#2271b1] hover:underline"
                    >
                      ویرایش همه قیمت‌ها ←
                    </button>
                  </div>
                  <div className="divide-y divide-[#f0f0f1]">
                    {products
                      .filter((p) => p.isDiscounted)
                      .slice(0, 4)
                      .map((p) => (
                        <div
                          key={p.id}
                          className="p-3 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={resolveAssetUrl(p.images[0])}
                              alt={p.title}
                              className="h-9 w-9 rounded object-cover border border-[#c3c4c7]"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-[#1d2327] truncate">{p.title}</p>
                              <p className="text-[11px] text-[#d63638] font-semibold">
                                {formatToman(p.discountedPrice)} تومان (قبل:{' '}
                                {formatToman(p.price)})
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleOpenEditProduct(p)}
                            className="rounded border border-[#2271b1] px-2.5 py-1 text-[11px] font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition flex-shrink-0"
                          >
                            ویرایش
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* WordPress Asset Cache Status Widget (Images & Fonts Caching) */}
              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm">
                <div className="border-b border-[#c3c4c7] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#00a32a]" />
                    <span className="font-bold text-xs text-[#1d2327]">
                      سیستم کش دائمی تصاویر کاروسل و فونت‌ها (Service Worker + HTTP Immutable Cache)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={refreshCacheStats}
                    disabled={cacheStats.warming}
                    className="inline-flex items-center gap-1.5 rounded bg-[#2271b1] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#135e96] transition disabled:opacity-60"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${cacheStats.warming ? 'animate-spin' : ''}`} />
                    {cacheStats.warming ? 'در حال بروزرسانی کش...' : 'بروزرسانی و کش مجدد تصاویر و فونت‌ها'}
                  </button>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-3 rounded bg-[#edfaef] border border-[#00a32a]/30">
                    <span className="text-[#50575e] font-medium">تصاویر کش‌شده در مرورگر:</span>
                    <p className="text-base font-black text-[#00a32a] mt-1">
                      {toPersianDigits(cacheStats.images)} تصویر کاروسل و بنر
                    </p>
                    <p className="text-[11px] text-[#50575e] mt-0.5">
                      ذخیره در CacheStorage (`{IMAGE_CACHE_NAME}`) و حافظه مرورگر
                    </p>
                  </div>
                  <div className="p-3 rounded bg-[#f0f6fc] border border-[#2271b1]/30">
                    <span className="text-[#50575e] font-medium">فونت‌های فارسی کش‌شده:</span>
                    <p className="text-base font-black text-[#2271b1] mt-1">
                      فونت وزیرمتن ({toPersianDigits(cacheStats.fonts)} فایل WOFF2)
                    </p>
                    <p className="text-[11px] text-[#50575e] mt-0.5">
                      کش دائمی یک‌ساله (`max-age=31536000, immutable`)
                    </p>
                  </div>
                  <div className="p-3 rounded bg-[#f6f7f7] border border-[#dcdcde]">
                    <span className="text-[#50575e] font-medium">وضعیت لود اسلایدرهای محصول:</span>
                    <p className="text-base font-black text-[#1d2327] mt-1">
                      فعال (بدون تاخیر و پرش)
                    </p>
                    <p className="text-[11px] text-[#50575e] mt-0.5">
                      پیش‌بارگذاری خودکار تمام اسلایدهای کاروسل در پس‌زمینه
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. ALL PRODUCTS TABLE (WordPress / WooCommerce Products List) */}
          {activeSection === 'all-products' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl font-bold text-[#1d2327]">محصولات</h1>
                <button
                  type="button"
                  onClick={handleOpenNewProduct}
                  className="rounded border border-[#2271b1] bg-[#f6f7f7] px-3 py-1 text-xs font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition"
                >
                  افزودن محصول جدید
                </button>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 border border-[#c3c4c7] rounded-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={catFilter}
                    onChange={(e) => setCatFilter(e.target.value)}
                    className="rounded border border-[#8c8f94] bg-white px-3 py-1.5 text-xs text-[#1d2327]"
                  >
                    <option value="all">همه دسته‌بندی‌ها</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative min-w-[240px]">
                  <Search className="w-3.5 h-3.5 text-[#8c8f94] absolute right-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="جستجو در محصولات..."
                    className="w-full rounded border border-[#8c8f94] pr-8 pl-3 py-1.5 text-xs"
                  />
                </div>
              </div>

              {/* WP List Table */}
              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7] text-[#1d2327] font-bold">
                      <th className="py-3 px-3 w-14">تصویر</th>
                      <th className="py-3 px-3">نام محصول</th>
                      <th className="py-3 px-3">دسته‌بندی</th>
                      <th className="py-3 px-3">قیمت (تومان)</th>
                      <th className="py-3 px-3 text-center">کاروسل عکس‌ها</th>
                      <th className="py-3 px-3 text-center">تخفیف اول صفحه</th>
                      <th className="py-3 px-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    {filteredProductsList.map((prod) => {
                      const cat = categories.find((c) => c.id === prod.categoryId);
                      return (
                        <tr key={prod.id} className="hover:bg-[#f6f7f7] group">
                          <td className="py-3 px-3">
                            <img
                              src={resolveAssetUrl(prod.images[0])}
                              alt={prod.title}
                              className="h-11 w-11 rounded object-cover border border-[#c3c4c7]"
                            />
                          </td>
                          <td className="py-3 px-3">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(prod)}
                              className="font-bold text-[#2271b1] hover:underline text-right"
                            >
                              {prod.title}
                            </button>
                            <div className="mt-1 flex items-center gap-2 text-[11px] text-[#50575e]">
                              <button
                                type="button"
                                onClick={() => handleOpenEditProduct(prod)}
                                className="text-[#2271b1] hover:underline"
                              >
                                ویرایش کامل
                              </button>
                              <span>|</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedMediaProductId(prod.id);
                                  setActiveSection('media-carousels');
                                }}
                                className="text-[#2271b1] hover:underline"
                              >
                                مدیریت عکس‌های کاروسل
                              </button>
                              <span>|</span>
                              <button
                                type="button"
                                onClick={() => deleteProduct(prod.id)}
                                className="text-[#d63638] hover:underline"
                              >
                                حذف
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-[#50575e]">
                            {cat ? cat.name : '—'}
                          </td>
                          <td className="py-3 px-3">
                            {prod.isDiscounted && prod.discountedPrice < prod.price ? (
                              <div>
                                <span className="line-through text-[#8c8f94] text-[11px] block">
                                  {formatToman(prod.price)}
                                </span>
                                <span className="font-bold text-[#d63638]">
                                  {formatToman(prod.discountedPrice)} تومان
                                </span>
                              </div>
                            ) : (
                              <span className="font-bold text-[#1d2327]">
                                {formatToman(prod.price)} تومان
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="inline-flex items-center gap-1 rounded bg-[#f0f6fc] border border-[#c5d9ed] px-2 py-0.5 text-[11px] font-bold text-[#2271b1]">
                              {toPersianDigits(
                                Math.min(prod.images.length, prod.maxCarouselImages || prod.images.length)
                              )}{' '}
                              از {toPersianDigits(prod.images.length)} تصویر
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            {prod.isDiscounted ? (
                              <span className="inline-block rounded bg-[#fcf0f1] border border-[#f5c2c7] px-2 py-0.5 text-[11px] font-bold text-[#d63638]">
                                بله (اول صفحه)
                              </span>
                            ) : (
                              <span className="text-[#8c8f94]">عادی</span>
                            )}
                          </td>
                          <td className="py-3 px-3 text-left">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(prod)}
                              className="rounded bg-[#2271b1] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[#135e96] transition"
                            >
                              ویرایش
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. WORDPRESS / WOOCOMMERCE PRODUCT EDITOR (2-Column Post Editor) */}
          {activeSection === 'edit-product' && (
            <form
              noValidate
              onSubmit={async (e) => {
                e.preventDefault();
                await saveProduct({
                  ...editingProduct,
                  title: editingProduct.title.trim() || 'محصول جدید آلِرضا',
                });
                setIsNewProductMode(false);
              }}
              className="space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold text-[#1d2327]">
                    {isNewProductMode ? 'افزودن محصول جدید' : 'ویرایش محصول'}
                  </h1>
                  <button
                    type="button"
                    onClick={() => setActiveSection('all-products')}
                    className="text-xs font-semibold text-[#2271b1] hover:underline"
                  >
                    ← بازگشت به همه محصولات
                  </button>
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded bg-[#2271b1] hover:bg-[#135e96] px-5 py-2 text-xs font-bold text-white shadow-xs transition"
                >
                  <Save className="w-4 h-4" />
                  {isNewProductMode ? 'انتشار محصول در سایت' : 'بروزرسانی محصول'}
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Right Main Column (8 cols) */}
                <div className="lg:col-span-8 space-y-5">
                  {/* Product Title & Subtitle Box */}
                  <div className="bg-white border border-[#c3c4c7] p-4 rounded-sm space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-[#1d2327] mb-1">
                        نام محصول
                      </label>
                      <input
                        type="text"
                        value={editingProduct.title}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, title: e.target.value })
                        }
                        placeholder="نام محصول را اینجا وارد کنید..."
                        className="w-full rounded border border-[#8c8f94] px-3.5 py-2 text-base font-bold text-[#1d2327] focus:border-[#2271b1] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#1d2327] mb-1">
                        توضیح کوتاه / زیرعنوان فنی
                      </label>
                      <input
                        type="text"
                        value={editingProduct.subtitle}
                        onChange={(e) =>
                          setEditingProduct({ ...editingProduct, subtitle: e.target.value })
                        }
                        placeholder="مثلاً: موتور اینورتر خطی • مصرف انرژی A+++"
                        className="w-full rounded border border-[#8c8f94] px-3 py-2 text-xs text-[#1d2327]"
                      />
                    </div>
                  </div>

                  {/* WooCommerce Product Data Meta Box (Pricing & Discounts - Friction-Free) */}
                  <div className="bg-white border-2 border-[#2271b1]/40 rounded-sm overflow-hidden shadow-xs">
                    <div className="bg-[#f0f6fc] border-b border-[#c5d9ed] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <BadgePercent className="w-4 h-4 text-[#2271b1]" />
                        <span className="text-xs font-bold text-[#1d2327]">
                          اطلاعات محصول — قیمت‌گذاری و وضعیت تخفیف اول صفحه (بدون محدودیت رقم)
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <label className="inline-flex items-center gap-2 cursor-pointer rounded bg-white border border-[#d63638]/40 px-3 py-1.5 shadow-2xs">
                          <input
                            type="checkbox"
                            checked={editingProduct.isDiscounted}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              let nextDiscountedPrice = editingProduct.discountedPrice;
                              if (
                                checked &&
                                editingProduct.price > 0 &&
                                (!nextDiscountedPrice || nextDiscountedPrice >= editingProduct.price)
                              ) {
                                nextDiscountedPrice = Math.round(editingProduct.price * 0.9);
                              }
                              setEditingProduct({
                                ...editingProduct,
                                isDiscounted: checked,
                                discountedPrice: nextDiscountedPrice,
                              });
                            }}
                            className="h-4 w-4 accent-[#d63638]"
                          />
                          <span className="text-xs font-bold text-[#d63638]">
                            نمایش در بخش تخفیف‌های ویژه اول صفحه
                          </span>
                        </label>

                        <button
                          type="button"
                          onClick={async () => {
                            await saveProduct({
                              ...editingProduct,
                              title: editingProduct.title.trim() || 'محصول آلِرضا',
                            });
                            setIsNewProductMode(false);
                          }}
                          className="inline-flex items-center gap-1.5 rounded bg-[#00a32a] hover:bg-[#008a20] px-3.5 py-1.5 text-xs font-bold text-white transition cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          ذخیره فوری قیمت و تخفیف
                        </button>
                      </div>
                    </div>

                    <div className="p-4 space-y-4 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Normal Price */}
                        <div className="p-3.5 rounded border border-[#dcdcde] bg-[#f6f7f7]/60 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-[#1d2327]">
                              قیمت عادی / قبل از تخفیف (تومان)
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingProduct({ ...editingProduct, price: 0 })
                              }
                              className="text-[11px] text-[#2271b1] hover:underline"
                            >
                              پاک کردن کادر
                            </button>
                          </div>

                          <input
                            type="text"
                            inputMode="numeric"
                            dir="ltr"
                            placeholder="مثلاً: 25,000,000 (فارسی یا انگلیسی)"
                            value={formatNumericInput(editingProduct.price)}
                            onChange={(e) => {
                              const val = parsePriceInput(e.target.value);
                              setEditingProduct({
                                ...editingProduct,
                                price: val,
                              });
                            }}
                            className="w-full rounded border border-[#8c8f94] bg-white px-3 py-2.5 font-mono font-bold text-base text-[#1d2327] focus:border-[#2271b1] focus:outline-none"
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] font-bold text-[#1d2327]">
                              معادل: {formatToman(editingProduct.price)} تومان
                            </span>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    price: editingProduct.price + 1000000,
                                  })
                                }
                                className="rounded bg-white border border-[#c3c4c7] px-2 py-0.5 text-[10px] font-bold hover:bg-[#f0f6fc]"
                              >
                                +۱ میلیون
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    price: Math.max(0, editingProduct.price - 1000000),
                                  })
                                }
                                className="rounded bg-white border border-[#c3c4c7] px-2 py-0.5 text-[10px] font-bold hover:bg-[#f0f6fc]"
                              >
                                -۱ میلیون
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setEditingProduct({
                                    ...editingProduct,
                                    price: editingProduct.price + 500000,
                                  })
                                }
                                className="rounded bg-white border border-[#c3c4c7] px-2 py-0.5 text-[10px] font-bold hover:bg-[#f0f6fc]"
                              >
                                +۵۰۰ هزار
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Discounted Price */}
                        <div className="p-3.5 rounded border border-[#f5c2c7] bg-[#fcf0f1]/50 space-y-2">
                          <div className="flex items-center justify-between">
                            <label className="font-bold text-[#d63638]">
                              قیمت فروش ویژه / با تخفیف (تومان)
                            </label>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingProduct({ ...editingProduct, discountedPrice: 0 })
                              }
                              className="text-[11px] text-[#d63638] hover:underline"
                            >
                              پاک کردن کادر
                            </button>
                          </div>

                          <input
                            type="text"
                            inputMode="numeric"
                            dir="ltr"
                            placeholder="مثلاً: 21,500,000 (هر عددی مجاز است)"
                            value={formatNumericInput(editingProduct.discountedPrice)}
                            onChange={(e) => {
                              const val = parsePriceInput(e.target.value);
                              setEditingProduct({
                                ...editingProduct,
                                discountedPrice: val,
                                isDiscounted:
                                  val > 0 && val < editingProduct.price
                                    ? true
                                    : editingProduct.isDiscounted,
                              });
                            }}
                            className="w-full rounded border border-[#d63638] bg-white px-3 py-2.5 font-mono font-bold text-base text-[#d63638] focus:outline-none"
                          />

                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="text-[11px] text-[#d63638] font-bold">
                              معادل: {formatToman(editingProduct.discountedPrice)} تومان (
                              {toPersianDigits(
                                calcDiscountPercent(
                                  editingProduct.price,
                                  editingProduct.discountedPrice
                                )
                              )}
                              ٪ تخفیف)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Discount Percentage Helper Bar */}
                      <div className="p-3 rounded bg-[#f0f6fc] border border-[#c5d9ed] flex flex-wrap items-center justify-between gap-2">
                        <span className="text-[11px] font-bold text-[#1d2327]">
                          اعمال سریع درصد تخفیف روی قیمت عادی:
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {[5, 10, 15, 20, 25, 30, 40, 50].map((pct) => (
                            <button
                              key={pct}
                              type="button"
                              onClick={() => {
                                const base = editingProduct.price || 10000000;
                                const discounted = Math.round((base * (100 - pct)) / 100);
                                setEditingProduct({
                                  ...editingProduct,
                                  price: base,
                                  discountedPrice: discounted,
                                  isDiscounted: true,
                                });
                              }}
                              className="rounded bg-white border border-[#2271b1]/40 px-2.5 py-1 text-[11px] font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition cursor-pointer"
                            >
                              {toPersianDigits(pct)}٪ تخفیف
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() =>
                              setEditingProduct({
                                ...editingProduct,
                                discountedPrice: editingProduct.price,
                                isDiscounted: false,
                              })
                            }
                            className="rounded bg-white border border-[#8c8f94] px-2.5 py-1 text-[11px] font-bold text-[#50575e] hover:bg-[#1d2327] hover:text-white transition cursor-pointer"
                          >
                            حذف تخفیف (قیمت عادی)
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                        <div>
                          <label className="block font-bold text-[#1d2327] mb-1">
                            گارانتی محصول
                          </label>
                          <input
                            type="text"
                            value={editingProduct.warranty}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                warranty: e.target.value,
                              })
                            }
                            className="w-full rounded border border-[#8c8f94] px-3 py-2"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-[#1d2327] mb-1">
                            برچسب روی کارت محصول
                          </label>
                          <input
                            type="text"
                            value={editingProduct.badge}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                badge: e.target.value,
                              })
                            }
                            className="w-full rounded border border-[#8c8f94] px-3 py-2"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CAROUSEL IMAGES META BOX */}
                  <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden">
                    <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#1d2327] flex items-center gap-1.5">
                        <Images className="w-4 h-4 text-[#2271b1]" />
                        گالری کاروسل تصاویر محصول (انتخاب تعداد، افزودن، حذف و ویرایش)
                      </span>

                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1d2327]">
                          تعداد عکس قابل نمایش در کاروسل:
                        </span>
                        <input
                          type="number"
                          min={1}
                          max={20}
                          value={editingProduct.maxCarouselImages}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              maxCarouselImages: Math.max(1, Number(e.target.value)),
                            })
                          }
                          className="w-16 rounded border border-[#2271b1] px-2 py-1 text-center text-xs font-bold text-[#2271b1]"
                        />
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      <div className="space-y-2">
                        {editingProduct.images.map((imgUrl, idx) => {
                          const activeInCarousel = idx < editingProduct.maxCarouselImages;
                          return (
                            <div
                              key={idx}
                              className={`flex flex-wrap sm:flex-nowrap items-center gap-3 p-2.5 rounded border ${
                                activeInCarousel
                                  ? 'bg-[#f6f7f7] border-[#c3c4c7]'
                                  : 'bg-gray-50 border-dashed border-gray-300 opacity-60'
                              }`}
                            >
                              <img
                                src={resolveAssetUrl(imgUrl)}
                                alt=""
                                className="h-12 w-16 rounded object-cover border border-[#c3c4c7] flex-shrink-0"
                              />
                              <div className="flex-1 min-w-[180px]">
                                <div className="flex items-center gap-2 text-[11px] font-bold mb-1">
                                  <span>اسلاید #{toPersianDigits(idx + 1)}</span>
                                  {!activeInCarousel && (
                                    <span className="text-[#d63638]">
                                      (خارج از سقف {toPersianDigits(editingProduct.maxCarouselImages)} عکس)
                                    </span>
                                  )}
                                </div>
                                <input
                                  type="text"
                                  dir="ltr"
                                  value={imgUrl}
                                  onChange={(e) => {
                                    const next = [...editingProduct.images];
                                    next[idx] = e.target.value;
                                    setEditingProduct({ ...editingProduct, images: next });
                                  }}
                                  className="w-full rounded border border-[#8c8f94] bg-white px-2.5 py-1 text-xs font-mono"
                                />
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  disabled={idx === 0}
                                  onClick={() => {
                                    const next = [...editingProduct.images];
                                    [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                                    setEditingProduct({ ...editingProduct, images: next });
                                  }}
                                  className="p-1.5 rounded border border-[#c3c4c7] bg-white hover:bg-[#f0f0f1] disabled:opacity-30"
                                >
                                  <ArrowUp className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  disabled={idx === editingProduct.images.length - 1}
                                  onClick={() => {
                                    const next = [...editingProduct.images];
                                    [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                                    setEditingProduct({ ...editingProduct, images: next });
                                  }}
                                  className="p-1.5 rounded border border-[#c3c4c7] bg-white hover:bg-[#f0f0f1] disabled:opacity-30"
                                >
                                  <ArrowDown className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const next = editingProduct.images.filter((_, i) => i !== idx);
                                    setEditingProduct({
                                      ...editingProduct,
                                      images:
                                        next.length > 0
                                          ? next
                                          : ['/images/aleraza_hero_kitchen.jpg'],
                                    });
                                  }}
                                  className="p-1.5 rounded border border-[#d63638] text-[#d63638] bg-white hover:bg-[#d63638] hover:text-white transition"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Add new carousel photo */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <input
                          type="text"
                          dir="ltr"
                          value={newImageUrl}
                          onChange={(e) => setNewImageUrl(e.target.value)}
                          placeholder="https://... لینک تصویر جدید"
                          className="flex-1 min-w-[200px] rounded border border-[#8c8f94] px-3 py-1.5 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newImageUrl.trim()) return;
                            const next = [...editingProduct.images, newImageUrl.trim()];
                            setEditingProduct({
                              ...editingProduct,
                              images: next,
                              maxCarouselImages: Math.max(
                                editingProduct.maxCarouselImages,
                                next.length
                              ),
                            });
                            setNewImageUrl('');
                          }}
                          className="rounded bg-[#2271b1] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[#135e96]"
                        >
                          + افزودن با لینک
                        </button>

                        <label className="inline-flex items-center gap-1.5 rounded border border-[#2271b1] bg-[#f0f6fc] px-3.5 py-1.5 text-xs font-bold text-[#2271b1] cursor-pointer hover:bg-[#2271b1] hover:text-white transition">
                          <Upload className="w-3.5 h-3.5" />
                          آپلود تصویر از سیستم
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                              handleFileUpload(e, (dataUrl) => {
                                const next = [...editingProduct.images, dataUrl];
                                setEditingProduct({
                                  ...editingProduct,
                                  images: next,
                                  maxCarouselImages: Math.max(
                                    editingProduct.maxCarouselImages,
                                    next.length
                                  ),
                                });
                              })
                            }
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Preset Library */}
                      <div className="pt-2 border-t border-[#f0f0f1]">
                        <p className="text-[11px] font-bold text-[#50575e] mb-2">
                          افزودن سریع از کتابخانه رسانه آلِرضا:
                        </p>
                        <div className="flex items-center gap-2 overflow-x-auto pb-2">
                          {PRESET_APPLIANCE_GALLERY.map((g, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => {
                                const next = [...editingProduct.images, g.url];
                                setEditingProduct({
                                  ...editingProduct,
                                  images: next,
                                  maxCarouselImages: Math.max(
                                    editingProduct.maxCarouselImages,
                                    next.length
                                  ),
                                });
                              }}
                              className="h-14 w-20 rounded border border-[#c3c4c7] overflow-hidden flex-shrink-0 hover:border-[#2271b1]"
                              title={g.label}
                            >
                              <img
                                src={resolveAssetUrl(g.url)}
                                alt={g.label}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Left Sidebar Meta Boxes (4 cols): Publish & Categories & Specs */}
                <div className="lg:col-span-4 space-y-5">
                  {/* Publish Box */}
                  <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden">
                    <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 text-xs font-bold">
                      انتشار
                    </div>
                    <div className="p-4 space-y-3 text-xs text-[#50575e]">
                      <div className="flex justify-between">
                        <span>وضعیت:</span>
                        <strong className="text-[#00a32a]">منتشرشده در سایت</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>تعداد اسلاید فعال:</span>
                        <strong className="text-[#1d2327]">
                          {toPersianDigits(editingProduct.maxCarouselImages)} تصویر
                        </strong>
                      </div>
                      <button
                        type="submit"
                        className="w-full rounded bg-[#2271b1] hover:bg-[#135e96] py-2.5 text-xs font-bold text-white transition"
                      >
                        {isNewProductMode ? 'انتشار محصول' : 'ذخیره و بروزرسانی محصول'}
                      </button>
                    </div>
                  </div>

                  {/* Product Categories Box */}
                  <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden">
                    <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 text-xs font-bold">
                      دسته‌بندی محصول
                    </div>
                    <div className="p-4 space-y-2 max-h-56 overflow-y-auto text-xs">
                      {categories.map((cat) => (
                        <label
                          key={cat.id}
                          className="flex items-center gap-2 cursor-pointer py-1"
                        >
                          <input
                            type="radio"
                            name="wp_prod_cat"
                            checked={editingProduct.categoryId === cat.id}
                            onChange={() =>
                              setEditingProduct({ ...editingProduct, categoryId: cat.id })
                            }
                            className="accent-[#2271b1]"
                          />
                          <span className="font-semibold text-[#1d2327]">{cat.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Features Box */}
                  <div className="bg-white border border-[#c3c4c7] rounded-sm overflow-hidden">
                    <div className="bg-[#f6f7f7] border-b border-[#c3c4c7] px-4 py-2.5 text-xs font-bold">
                      ویژگی‌های فنی محصول
                    </div>
                    <div className="p-4 space-y-3 text-xs">
                      <ul className="space-y-1.5">
                        {editingProduct.features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-center justify-between gap-2 bg-[#f6f7f7] px-2.5 py-1.5 rounded"
                          >
                            <span>{f}</span>
                            <button
                              type="button"
                              onClick={() =>
                                setEditingProduct({
                                  ...editingProduct,
                                  features: editingProduct.features.filter((_, idx) => idx !== i),
                                })
                              }
                              className="text-[#d63638] font-bold"
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
                          className="flex-1 rounded border border-[#8c8f94] px-2.5 py-1.5"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            if (!newFeatureText.trim()) return;
                            setEditingProduct({
                              ...editingProduct,
                              features: [...editingProduct.features, newFeatureText.trim()],
                            });
                            setNewFeatureText('');
                          }}
                          className="rounded border border-[#2271b1] px-3 py-1.5 font-bold text-[#2271b1]"
                        >
                          افزودن
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* 4. QUICK PRICING & FIRST-PAGE DISCOUNTS TABLE */}
          {activeSection === 'quick-pricing' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-[#1d2327]">
                    تغییر سریع قیمت‌ها و محصولات تخفیف‌دار اول صفحه
                  </h1>
                  <p className="text-xs text-[#50575e] mt-1">
                    می‌توانید هر عددی (با کیبورد فارسی یا انگلیسی) وارد کنید یا با یک کلیک درصد تخفیف بدهید.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    for (const prod of products) {
                      const d = priceDrafts[prod.id];
                      if (!d) continue;
                      if (
                        d.price !== prod.price ||
                        d.discountedPrice !== prod.discountedPrice ||
                        d.isDiscounted !== prod.isDiscounted
                      ) {
                        await quickUpdatePrice(
                          prod.id,
                          d.price,
                          d.discountedPrice,
                          d.isDiscounted
                        );
                      }
                      if (d.maxCarouselImages !== prod.maxCarouselImages) {
                        await updateProductCarousel(
                          prod.id,
                          prod.images,
                          d.maxCarouselImages
                        );
                      }
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded bg-[#00a32a] hover:bg-[#008a20] px-4 py-2 text-xs font-bold text-white shadow-xs transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  ذخیره یکجای تمام تغییرات جدول
                </button>
              </div>

              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7] font-bold text-[#1d2327]">
                      <th className="py-3 px-3">محصول</th>
                      <th className="py-3 px-3">قیمت اصلی (تومان)</th>
                      <th className="py-3 px-3">قیمت با تخفیف (تومان)</th>
                      <th className="py-3 px-3 text-center">تخفیف اول صفحه</th>
                      <th className="py-3 px-3 text-center">تعداد عکس کاروسل</th>
                      <th className="py-3 px-3 text-left">ذخیره</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    {products.map((prod) => {
                      const draft = priceDrafts[prod.id] || {
                        price: prod.price,
                        discountedPrice: prod.discountedPrice,
                        isDiscounted: prod.isDiscounted,
                        maxCarouselImages: prod.maxCarouselImages || prod.images.length,
                      };
                      const pct = calcDiscountPercent(draft.price, draft.discountedPrice);
                      return (
                        <tr key={prod.id} className="hover:bg-[#f6f7f7]">
                          <td className="py-3 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={resolveAssetUrl(prod.images[0])}
                                alt=""
                                className="h-10 w-10 rounded object-cover border border-[#c3c4c7]"
                              />
                              <span className="font-bold text-[#1d2327]">{prod.title}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              inputMode="numeric"
                              dir="ltr"
                              placeholder="قیمت اصلی..."
                              value={formatNumericInput(draft.price)}
                              onChange={(e) =>
                                setPriceDrafts({
                                  ...priceDrafts,
                                  [prod.id]: {
                                    ...draft,
                                    price: parsePriceInput(e.target.value),
                                  },
                                })
                              }
                              className="w-40 rounded border border-[#8c8f94] bg-white px-2.5 py-1.5 font-mono font-bold text-xs"
                            />
                            <div className="text-[10px] text-[#50575e] mt-0.5">
                              {formatToman(draft.price)} تومان
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <input
                              type="text"
                              inputMode="numeric"
                              dir="ltr"
                              placeholder="قیمت با تخفیف..."
                              value={formatNumericInput(draft.discountedPrice)}
                              onChange={(e) => {
                                const val = parsePriceInput(e.target.value);
                                setPriceDrafts({
                                  ...priceDrafts,
                                  [prod.id]: {
                                    ...draft,
                                    discountedPrice: val,
                                    isDiscounted:
                                      val > 0 && val < draft.price ? true : draft.isDiscounted,
                                  },
                                });
                              }}
                              className="w-40 rounded border border-[#d63638] bg-white px-2.5 py-1.5 font-mono font-bold text-xs text-[#d63638]"
                            />
                            <div className="flex items-center gap-1 mt-1">
                              <span className="text-[10px] text-[#d63638] font-bold">
                                ({toPersianDigits(pct)}٪-)
                              </span>
                              {[10, 15, 20].map((quickPct) => (
                                <button
                                  key={quickPct}
                                  type="button"
                                  onClick={() => {
                                    const base = draft.price || prod.price;
                                    const nextDisc = Math.round((base * (100 - quickPct)) / 100);
                                    setPriceDrafts({
                                      ...priceDrafts,
                                      [prod.id]: {
                                        ...draft,
                                        price: base,
                                        discountedPrice: nextDisc,
                                        isDiscounted: true,
                                      },
                                    });
                                  }}
                                  className="rounded bg-[#fcf0f1] border border-[#f5c2c7] px-1.5 py-0.5 text-[9px] font-bold text-[#d63638] hover:bg-[#d63638] hover:text-white transition"
                                >
                                  {toPersianDigits(quickPct)}٪
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="checkbox"
                              checked={draft.isDiscounted}
                              onChange={async (e) => {
                                const checked = e.target.checked;
                                let nextDisc = draft.discountedPrice;
                                if (checked && draft.price > 0 && nextDisc >= draft.price) {
                                  nextDisc = Math.round(draft.price * 0.9);
                                }
                                setPriceDrafts({
                                  ...priceDrafts,
                                  [prod.id]: {
                                    ...draft,
                                    isDiscounted: checked,
                                    discountedPrice: nextDisc,
                                  },
                                });
                                await quickUpdatePrice(prod.id, draft.price, nextDisc, checked);
                              }}
                              className="h-4 w-4 accent-[#d63638] cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-3 text-center">
                            <input
                              type="number"
                              min={1}
                              max={20}
                              value={draft.maxCarouselImages}
                              onChange={(e) =>
                                setPriceDrafts({
                                  ...priceDrafts,
                                  [prod.id]: {
                                    ...draft,
                                    maxCarouselImages: Math.max(1, Number(e.target.value)),
                                  },
                                })
                              }
                              className="w-16 rounded border border-[#8c8f94] px-2 py-1.5 text-center font-bold"
                            />
                          </td>
                          <td className="py-3 px-3 text-left">
                            <button
                              type="button"
                              onClick={async () => {
                                await quickUpdatePrice(
                                  prod.id,
                                  draft.price,
                                  draft.discountedPrice,
                                  draft.isDiscounted
                                );
                                if (draft.maxCarouselImages !== prod.maxCarouselImages) {
                                  await updateProductCarousel(
                                    prod.id,
                                    prod.images,
                                    draft.maxCarouselImages
                                  );
                                }
                              }}
                              className="inline-flex items-center gap-1 rounded bg-[#2271b1] hover:bg-[#135e96] px-3 py-1.5 text-xs font-bold text-white transition cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              بروزرسانی
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. WORDPRESS 2-COLUMN CATEGORIES SCREEN */}
          {activeSection === 'categories' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-[#1d2327]">دسته‌بندی‌های لوازم جانبی و قطعات</h1>
                  <p className="text-xs text-[#50575e] mt-0.5">
                    افزودن دسته‌بندی جدید، تعیین و ویرایش تصاویر شاخص، نام و توضیحات دسته‌ها
                  </p>
                </div>
                {isEditingExistingCat && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingExistingCat(false);
                      setEditingCategory({
                        id: `cat-${Date.now()}`,
                        name: '',
                        slug: '',
                        description: '',
                        imageUrl: '/images/hero_appliance_accessories.jpg',
                        iconName: 'Sparkles',
                        order: categories.length + 1,
                        createdAt: new Date().toISOString(),
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded border border-[#2271b1] bg-[#f0f6fc] px-3 py-1.5 text-xs font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    خروج از ویرایش و افزودن دسته جدید
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Right Column: Add / Edit Category Form */}
                <div className="lg:col-span-5 bg-white border border-[#c3c4c7] p-5 rounded-md shadow-xs space-y-4 text-xs">
                  <div className="flex items-center justify-between border-b border-[#f0f0f1] pb-3">
                    <h2 className="text-sm font-bold text-[#1d2327]">
                      {isEditingExistingCat ? 'ویرایش دسته‌بندی موجود' : 'افزودن دسته‌بندی تازه'}
                    </h2>
                    <span className="text-[11px] text-[#6E675F]">
                      شناسه: {editingCategory.id}
                    </span>
                  </div>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!editingCategory.name.trim()) return;
                      await saveCategory({
                        ...editingCategory,
                        imageUrl: editingCategory.imageUrl || '/images/hero_appliance_accessories.jpg',
                        slug:
                          editingCategory.slug.trim() ||
                          editingCategory.name.trim().toLowerCase().replace(/\s+/g, '-'),
                      });
                      setEditingCategory({
                        id: `cat-${Date.now()}`,
                        name: '',
                        slug: '',
                        description: '',
                        imageUrl: '/images/hero_appliance_accessories.jpg',
                        iconName: 'Sparkles',
                        order: categories.length + 2,
                        createdAt: new Date().toISOString(),
                      });
                      setIsEditingExistingCat(false);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block font-bold text-[#1d2327] mb-1">
                        نام دسته‌بندی <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={editingCategory.name}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, name: e.target.value })
                        }
                        placeholder="مثلاً: فیلترها و لوازم جانبی یخچال"
                        className="w-full rounded border border-[#8c8f94] bg-white px-3 py-2 text-xs focus:border-[#2271b1] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1d2327] mb-1">نامک انگلیسی (Slug)</label>
                      <input
                        type="text"
                        dir="ltr"
                        value={editingCategory.slug}
                        onChange={(e) =>
                          setEditingCategory({ ...editingCategory, slug: e.target.value })
                        }
                        placeholder="fridge-filters"
                        className="w-full rounded border border-[#8c8f94] bg-white px-3 py-2 text-xs font-mono focus:border-[#2271b1] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[#1d2327] mb-1">توضیح کوتاه</label>
                      <textarea
                        rows={2}
                        value={editingCategory.description}
                        onChange={(e) =>
                          setEditingCategory({
                            ...editingCategory,
                            description: e.target.value,
                          })
                        }
                        placeholder="شرح کوتاه کالاهای این دسته..."
                        className="w-full rounded border border-[#8c8f94] bg-white px-3 py-2 text-xs focus:border-[#2271b1] focus:outline-none"
                      />
                    </div>

                    {/* Image Assignment Box */}
                    <div className="rounded-lg border border-[#c5d9ed] bg-[#f0f6fc] p-3.5 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block font-bold text-[#1d2327] text-xs">
                          تصویر شاخص دسته‌بندی
                        </label>
                        {editingCategory.imageUrl && (
                          <button
                            type="button"
                            onClick={() => setEditingCategory({ ...editingCategory, imageUrl: '' })}
                            className="text-[11px] text-[#d63638] hover:underline"
                          >
                            حذف تصویر
                          </button>
                        )}
                      </div>

                      {/* Image Preview */}
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-24 rounded-lg bg-white border border-[#c3c4c7] overflow-hidden flex items-center justify-center shrink-0">
                          {editingCategory.imageUrl ? (
                            <img
                              src={resolveAssetUrl(editingCategory.imageUrl)}
                              alt="پیش‌نمایش تصویر دسته"
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-[10px] text-[#8c8f94] text-center px-1">
                              بدون تصویر
                            </span>
                          )}
                        </div>
                        <div className="flex-1 space-y-1.5">
                          <input
                            type="text"
                            dir="ltr"
                            value={editingCategory.imageUrl || ''}
                            onChange={(e) =>
                              setEditingCategory({ ...editingCategory, imageUrl: e.target.value })
                            }
                            placeholder="آدرس اینترنتی تصویر..."
                            className="w-full rounded border border-[#8c8f94] bg-white px-2.5 py-1.5 text-[11px] font-mono"
                          />
                          <label className="inline-flex items-center gap-1.5 rounded border border-[#2271b1] bg-white px-2.5 py-1 text-[11px] font-bold text-[#2271b1] cursor-pointer hover:bg-[#2271b1] hover:text-white transition">
                            <Upload className="w-3.5 h-3.5" />
                            <span>آپلود عکس دسته از دستگاه</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                handleFileUpload(e, (dataUrl) => {
                                  setEditingCategory({ ...editingCategory, imageUrl: dataUrl });
                                })
                              }
                              className="hidden"
                            />
                          </label>
                        </div>
                      </div>

                      {/* Quick Preset Selector for Category Image */}
                      <div className="pt-2 border-t border-[#c5d9ed]">
                        <p className="text-[11px] font-bold text-[#50575e] mb-1.5">
                          یا انتخاب سریع از گالری لوازم جانبی آلِرضا:
                        </p>
                        <div className="grid grid-cols-4 gap-1.5">
                          {PRESET_APPLIANCE_GALLERY.slice(0, 8).map((preset, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                setEditingCategory({ ...editingCategory, imageUrl: preset.url })
                              }
                              title={preset.label}
                              className={`group relative aspect-square rounded border overflow-hidden transition ${
                                editingCategory.imageUrl === preset.url
                                  ? 'border-2 border-[#2271b1] ring-2 ring-[#2271b1]/30'
                                  : 'border-[#c3c4c7] hover:border-[#2271b1]'
                              }`}
                            >
                              <img
                                src={resolveAssetUrl(preset.url)}
                                alt={preset.label}
                                className="h-full w-full object-cover"
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-[#f0f0f1]">
                      <button
                        type="submit"
                        className="flex-1 rounded bg-[#2271b1] hover:bg-[#135e96] py-2.5 font-bold text-white transition text-center shadow-xs"
                      >
                        {isEditingExistingCat
                          ? 'ذخیره تغییرات دسته‌بندی'
                          : 'افزودن دسته‌بندی تازه'}
                      </button>
                      {isEditingExistingCat && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsEditingExistingCat(false);
                            setEditingCategory({
                              id: `cat-${Date.now()}`,
                              name: '',
                              slug: '',
                              description: '',
                              imageUrl: '/images/hero_appliance_accessories.jpg',
                              iconName: 'Sparkles',
                              order: categories.length + 1,
                              createdAt: new Date().toISOString(),
                            });
                          }}
                          className="rounded border border-[#8c8f94] px-4 py-2.5 font-bold text-[#50575e] hover:bg-[#f6f7f7]"
                        >
                          انصراف
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Left Column: Categories Table */}
                <div className="lg:col-span-7 bg-white border border-[#c3c4c7] shadow-xs rounded-md overflow-hidden">
                  <div className="p-3.5 bg-[#f6f7f7] border-b border-[#c3c4c7] flex items-center justify-between">
                    <span className="font-bold text-xs text-[#1d2327]">
                      لیست دسته‌بندی‌های ثبت‌شده ({toPersianDigits(categories.length)} دسته)
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-[#c3c4c7] bg-[#f9f9f9] text-[#50575e] font-bold">
                          <th className="py-2.5 px-3">تصویر</th>
                          <th className="py-2.5 px-3">نام دسته‌بندی</th>
                          <th className="py-2.5 px-3">توضیح</th>
                          <th className="py-2.5 px-3 text-center">کالاها</th>
                          <th className="py-2.5 px-3 text-left">عملیات</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0f0f1]">
                        {categories.map((cat) => {
                          const count = products.filter((p) => p.categoryId === cat.id).length;
                          const isBeingEdited = isEditingExistingCat && editingCategory.id === cat.id;
                          return (
                            <tr
                              key={cat.id}
                              className={`transition ${
                                isBeingEdited ? 'bg-[#f0f6fc]' : 'hover:bg-[#f9f9f9]'
                              }`}
                            >
                              <td className="py-2.5 px-3">
                                <div className="h-10 w-14 rounded bg-gray-100 border border-[#c3c4c7] overflow-hidden">
                                  <img
                                    src={resolveAssetUrl(cat.imageUrl || '/images/hero_appliance_accessories.jpg')}
                                    alt={cat.name}
                                    className="h-full w-full object-cover"
                                  />
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="font-bold text-[#2271b1] text-xs">
                                  {cat.name}
                                </div>
                                <div className="font-mono text-[10px] text-[#8c8f94] mt-0.5">
                                  {cat.slug}
                                </div>
                              </td>
                              <td className="py-2.5 px-3 text-[#50575e] max-w-[180px] truncate">
                                {cat.description || '—'}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span className="inline-block rounded-full bg-[#f0f0f1] px-2 py-0.5 font-bold text-[11px] text-[#1d2327]">
                                  {toPersianDigits(count)}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-left space-x-2 space-x-reverse whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCategory({
                                      ...cat,
                                      imageUrl: cat.imageUrl || '/images/hero_appliance_accessories.jpg',
                                    });
                                    setIsEditingExistingCat(true);
                                  }}
                                  className="rounded bg-[#2271b1]/10 px-2 py-1 text-[#2271b1] font-bold hover:bg-[#2271b1] hover:text-white transition"
                                >
                                  ویرایش
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (confirm(`آیا از حذف دسته‌بندی «${cat.name}» اطمینان دارید؟`)) {
                                      deleteCategory(cat.id);
                                    }
                                  }}
                                  className="rounded bg-[#d63638]/10 px-2 py-1 text-[#d63638] font-bold hover:bg-[#d63638] hover:text-white transition"
                                >
                                  حذف
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 6. STANDALONE MEDIA & PRODUCT CAROUSEL MANAGER */}
          {activeSection === 'media-carousels' && selectedMediaProduct && (
            <div className="space-y-5">
              <div>
                <h1 className="text-xl font-bold text-[#1d2327]">
                  مدیریت کاروسل تصاویر محصولات (انتخاب تعداد، افزودن، حذف و ویرایش)
                </h1>
                <p className="text-xs text-[#50575e] mt-1">
                  محصول مورد نظر را انتخاب کنید، تعداد عکس‌های کاروسل آن را تعیین نمایید و عکس‌ها را اضافه، حذف یا ویرایش کنید.
                </p>
              </div>

              <div className="bg-white border border-[#c3c4c7] p-5 rounded-sm space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#f0f0f1] pb-4">
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-[#1d2327]">
                      انتخاب محصول:
                    </label>
                    <select
                      value={selectedMediaProduct.id}
                      onChange={(e) => setSelectedMediaProductId(e.target.value)}
                      className="rounded border border-[#8c8f94] px-3 py-2 text-xs font-bold text-[#1d2327]"
                    >
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2 bg-[#f0f6fc] border border-[#c5d9ed] px-3.5 py-2 rounded">
                    <span className="text-xs font-bold text-[#1d2327]">
                      تعداد عکس‌های قابل نمایش در کاروسل این محصول:
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={20}
                      value={selectedMediaProduct.maxCarouselImages}
                      onChange={(e) =>
                        updateProductCarousel(
                          selectedMediaProduct.id,
                          selectedMediaProduct.images,
                          Math.max(1, Number(e.target.value))
                        )
                      }
                      className="w-16 rounded border border-[#2271b1] bg-white px-2 py-1 text-center text-sm font-black text-[#2271b1]"
                    />
                  </div>
                </div>

                {/* Carousel Images List */}
                <div className="space-y-2.5">
                  {selectedMediaProduct.images.map((imgUrl, idx) => {
                    const isVisible = idx < selectedMediaProduct.maxCarouselImages;
                    return (
                      <div
                        key={idx}
                        className={`flex flex-wrap sm:flex-nowrap items-center gap-3 p-3 rounded border ${
                          isVisible
                            ? 'bg-[#f6f7f7] border-[#c3c4c7]'
                            : 'bg-gray-50 border-dashed border-gray-300 opacity-60'
                        }`}
                      >
                        <img
                          src={resolveAssetUrl(imgUrl)}
                          alt=""
                          className="h-14 w-20 rounded object-cover border border-[#c3c4c7]"
                        />
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-2 text-xs font-bold mb-1">
                            <span>تصویر شماره {toPersianDigits(idx + 1)}</span>
                            {!isVisible && (
                              <span className="text-[11px] text-[#d63638]">
                                (خارج از سقف تعداد انتخابی کاروسل)
                              </span>
                            )}
                          </div>
                          <input
                            type="text"
                            dir="ltr"
                            value={imgUrl}
                            onChange={(e) => {
                              const next = [...selectedMediaProduct.images];
                              next[idx] = e.target.value;
                              updateProductCarousel(
                                selectedMediaProduct.id,
                                next,
                                selectedMediaProduct.maxCarouselImages
                              );
                            }}
                            className="w-full rounded border border-[#8c8f94] bg-white px-2.5 py-1.5 text-xs font-mono"
                          />
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => {
                              const next = [...selectedMediaProduct.images];
                              [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
                              updateProductCarousel(
                                selectedMediaProduct.id,
                                next,
                                selectedMediaProduct.maxCarouselImages
                              );
                            }}
                            className="p-2 rounded border border-[#c3c4c7] bg-white hover:bg-[#f0f0f1] disabled:opacity-30"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            disabled={idx === selectedMediaProduct.images.length - 1}
                            onClick={() => {
                              const next = [...selectedMediaProduct.images];
                              [next[idx + 1], next[idx]] = [next[idx], next[idx + 1]];
                              updateProductCarousel(
                                selectedMediaProduct.id,
                                next,
                                selectedMediaProduct.maxCarouselImages
                              );
                            }}
                            className="p-2 rounded border border-[#c3c4c7] bg-white hover:bg-[#f0f0f1] disabled:opacity-30"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const next = selectedMediaProduct.images.filter(
                                (_, i) => i !== idx
                              );
                              updateProductCarousel(
                                selectedMediaProduct.id,
                                next,
                                selectedMediaProduct.maxCarouselImages
                              );
                            }}
                            className="p-2 rounded border border-[#d63638] text-[#d63638] bg-white hover:bg-[#d63638] hover:text-white transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add New Image to Selected Product Carousel */}
                <div className="flex flex-wrap gap-2 pt-3 border-t border-[#f0f0f1]">
                  <input
                    type="text"
                    dir="ltr"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="https://... وارد کردن لینک عکس جدید برای کاروسل"
                    className="flex-1 min-w-[220px] rounded border border-[#8c8f94] px-3 py-2 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!newImageUrl.trim()) return;
                      const next = [...selectedMediaProduct.images, newImageUrl.trim()];
                      updateProductCarousel(
                        selectedMediaProduct.id,
                        next,
                        Math.max(selectedMediaProduct.maxCarouselImages, next.length)
                      );
                      setNewImageUrl('');
                    }}
                    className="rounded bg-[#2271b1] px-4 py-2 text-xs font-bold text-white hover:bg-[#135e96]"
                  >
                    + افزودن لینک به کاروسل
                  </button>

                  <label className="inline-flex items-center gap-1.5 rounded border border-[#2271b1] bg-[#f0f6fc] px-4 py-2 text-xs font-bold text-[#2271b1] cursor-pointer hover:bg-[#2271b1] hover:text-white transition">
                    <Upload className="w-4 h-4" />
                    آپلود عکس از کامپیوتر / موبایل
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleFileUpload(e, (dataUrl) => {
                          const next = [...selectedMediaProduct.images, dataUrl];
                          updateProductCarousel(
                            selectedMediaProduct.id,
                            next,
                            Math.max(selectedMediaProduct.maxCarouselImages, next.length)
                          );
                        })
                      }
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preset Gallery */}
                <div className="pt-2">
                  <p className="text-xs font-bold text-[#50575e] mb-2">
                    یا انتخاب با یک کلیک از گالری استودیویی آلِرضا:
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {PRESET_APPLIANCE_GALLERY.map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          const next = [...selectedMediaProduct.images, item.url];
                          updateProductCarousel(
                            selectedMediaProduct.id,
                            next,
                            Math.max(selectedMediaProduct.maxCarouselImages, next.length)
                          );
                        }}
                        className="group relative aspect-video rounded border border-[#c3c4c7] overflow-hidden hover:border-[#2271b1]"
                      >
                        <img
                          src={resolveAssetUrl(item.url)}
                          alt={item.label}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center text-[10px] font-bold text-white transition">
                          + افزودن به کاروسل
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 7. ALL USERS LIST (WordPress Users Table) */}
          {activeSection === 'all-users' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-[#1d2327]">کاربران</h1>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingExistingUser(false);
                    setEditingUser({
                      id: `user-${Date.now()}`,
                      fullName: '',
                      phone: '',
                      password: '',
                      role: 'customer',
                      email: '',
                      createdAt: new Date().toISOString(),
                      createdBy: 'admin',
                    });
                    setActiveSection('add-user');
                  }}
                  className="rounded border border-[#2271b1] bg-[#f6f7f7] px-3 py-1 text-xs font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition"
                >
                  افزودن کاربر جدید
                </button>
              </div>

              <div className="bg-white border border-[#c3c4c7] shadow-xs rounded-sm overflow-x-auto">
                <table className="w-full text-right border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#c3c4c7] bg-[#f6f7f7] font-bold">
                      <th className="py-3 px-3">نام و نام خانوادگی</th>
                      <th className="py-3 px-3">شماره موبایل (نام کاربری)</th>
                      <th className="py-3 px-3">رمز عبور</th>
                      <th className="py-3 px-3">نقش کاربری</th>
                      <th className="py-3 px-3 text-left">عملیات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f0f0f1]">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-[#f6f7f7]">
                        <td className="py-3 px-3 font-bold text-[#2271b1]">{u.fullName}</td>
                        <td className="py-3 px-3 font-mono" dir="ltr">
                          {u.phone}
                        </td>
                        <td className="py-3 px-3 font-mono text-[#d63638]" dir="ltr">
                          {u.password}
                        </td>
                        <td className="py-3 px-3">
                          {u.role === 'admin' ? (
                            <span className="rounded bg-[#f0f6fc] border border-[#c5d9ed] px-2 py-0.5 font-bold text-[#2271b1]">
                              مدیر کل
                            </span>
                          ) : (
                            <span className="text-[#50575e]">مشتری</span>
                          )}
                        </td>
                        <td className="py-3 px-3 text-left space-x-2 space-x-reverse">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingUser(u);
                              setIsEditingExistingUser(true);
                              setActiveSection('add-user');
                            }}
                            className="text-[#2271b1] font-bold hover:underline"
                          >
                            ویرایش
                          </button>
                          <button
                            type="button"
                            onClick={() => adminDeleteUser(u.id)}
                            className="text-[#d63638] font-bold hover:underline"
                          >
                            حذف
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 8. ADD / EDIT USER (WordPress User New Form) */}
          {activeSection === 'add-user' && (
            <div className="max-w-xl space-y-4">
              <div>
                <h1 className="text-xl font-bold text-[#1d2327]">
                  {isEditingExistingUser
                    ? 'ویرایش کاربر'
                    : 'افزودن کاربر تازه (با نام، شماره موبایل و رمز عبور)'}
                </h1>
                <p className="text-xs text-[#50575e] mt-1">
                  کاربر جدیدی بسازید و آن را به سایت آلِرضا اضافه کنید. کاربر می‌تواند با همین شماره و رمز وارد سایت شود.
                </p>
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (
                    !editingUser.fullName.trim() ||
                    !editingUser.phone.trim() ||
                    !editingUser.password.trim()
                  ) {
                    return;
                  }
                  await adminSaveUser(editingUser);
                  setActiveSection('all-users');
                }}
                className="bg-white border border-[#c3c4c7] p-6 rounded-sm space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">
                    نام و نام خانوادگی (ضروری)
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.fullName}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, fullName: e.target.value })
                    }
                    placeholder="مثلاً: رضا محمدی"
                    className="w-full rounded border border-[#8c8f94] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">
                    شماره موبایل (ضروری — جهت ورود به سایت)
                  </label>
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={editingUser.phone}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                    placeholder="09123456789"
                    className="w-full rounded border border-[#8c8f94] px-3 py-2 font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">
                    رمز عبور (ضروری)
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={editingUser.password}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, password: e.target.value })
                    }
                    placeholder="مثلاً: 123456"
                    className="w-full rounded border border-[#8c8f94] px-3 py-2 font-mono text-left"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#1d2327] mb-1">نقش کاربری</label>
                  <select
                    value={editingUser.role}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        role: e.target.value as 'admin' | 'customer',
                      })
                    }
                    className="w-full rounded border border-[#8c8f94] px-3 py-2 font-bold"
                  >
                    <option value="customer">مشتری</option>
                    <option value="admin">مدیر کل (دسترسی به پیشخوان)</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="rounded bg-[#2271b1] hover:bg-[#135e96] px-5 py-2.5 font-bold text-white transition"
                  >
                    {isEditingExistingUser ? 'بروزرسانی کاربر' : 'افزودن کاربر تازه'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSection('all-users')}
                    className="rounded border border-[#8c8f94] px-4 py-2.5 font-bold"
                  >
                    بازگشت به لیست کاربران
                  </button>
                </div>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
