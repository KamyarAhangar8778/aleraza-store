# معماری فنی سامانه (Technical Architecture)

سامانه فروشگاه آنلاین قطعات و لوازم خانگی **آلِرضا** یک برنامه وب فول‌استک مدرن بر بستر **Next.js 15 (App Router)**، **TypeScript**، **Tailwind CSS v4** و **Google Firebase (Firestore & Auth)** است.

---

## ۱. مدل معماری و جریان داده (Architecture & Data Flow)

معماری سیستم از الگوی **Facade Composite State** پیروی می‌کند:

```
┌─────────────────────────────────────────────────────────────┐
│                       Next.js App Router                    │
├──────────────────────────────┬──────────────────────────────┤
│  Storefront (/app/page.tsx)  │   Admin Panel (/app/admin)   │
│  - StoreHeader               │   - AdminSidebar             │
│  - StoreHero                 │   - AdminHeader              │
│  - SpecialOffersSection      │   - DashboardSection         │
│  - StoreCategories           │   - ProductsSection          │
│  - FeaturedProductsSection   │   - ProductFormSection       │
│  - StorePillarsSection       │   - QuickPricingSection      │
│  - StoreFooter               │   - CategoriesSection        │
│  - Customer Modals           │   - CarouselsSection         │
│                              │   - UsersSection             │
└───────────────┬──────────────┴──────────────┬───────────────┘
                │                             │
                ▼                             ▼
┌─────────────────────────────────────────────────────────────┐
│               StoreProvider & useStore() Hook               │
├──────────────────────────────┬──────────────────────────────┤
│       useStoreAuth.ts        │      useStoreProducts.ts     │
│  - User authentication       │  - Products sync & CRUD      │
│  - Session management        │  - Categories sync & CRUD    │
│  - Phone credentials & OAuth │  - Quick pricing & Carousels │
├──────────────────────────────┴──────────────────────────────┤
│                      useStoreCart.ts                        │
│  - Cart items & quantities                                  │
│  - LocalStorage persistence                                 │
└──────────────────────────────┬──────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                   Firebase Cloud Services                   │
│  - Firestore Collections: products, categories, users, etc. │
│  - Firebase Auth: Google OAuth & Session Persistence        │
└─────────────────────────────────────────────────────────────┘
```

---

## ۲. لایه‌های برنامه (System Layers)

### الف. لایه ارائه (Presentation Layer)
- **`app/page.tsx` (Storefront Orchestrator):** هماهنگ‌کننده بخش‌های ویترین فروشگاه برای خریداران بدون درگیر شدن با جزئیات پیاده‌سازی.
- **`app/admin/page.tsx` (Admin Orchestrator):** هماهنگ‌کننده پیشخوان مدیریت وردپرسی بر اساس متغیر `activeSection`.
- **`components/store/`:** کامپوننت‌های اتمیک و سکشن‌های صفحه اصلی، شامل هدر، هیرو، ویترین تخفیف‌ها، کاتالوگ و فوتر.
- **`components/admin/sections/`:** صفحات مستقل مدیریت محصولات، دسته‌بندی‌ها، اسلایدرها، کاربران و قیمت‌گذاری سریع.

### ب. لایه استیت و بیزنس لاجیک (State & Business Logic Layer)
برای جلوگیری از تولید فایل‌های هیولایی (God Objects)، منطق سیستم به ۳ هوک ماژولار شکسته شده است:
1. **`hooks/useStoreAuth.ts`:**
   - مدیریت اطلاعات کاربر جاری (`currentUser`) و نشست محلی.
   - ورود با شماره موبایل و رمز عبور (پشتیبانی از اعداد فارسی).
   - ورود با حساب گوگل از طریق `signInWithPopup`.
   - شنود لحظه‌ای کالکشن `users_directory` در فایربیس.
2. **`hooks/useStoreProducts.ts`:**
   - شنود بلادرنگ کالکشن‌های `products` و `categories`.
   - عملیات خوش‌بینانه (Optimistic Updates) در رابط کاربری قبل از پاسخ سرور.
   - توابع بازنشانی اطلاعات نمونه دمو (`resetToDemoData`).
   - ذخیره تغییرات قیمت و اسلایدرها.
3. **`hooks/useStoreCart.ts`:**
   - نگهداری اقلام انتخابی کاربر در سبد خرید.
   - همگام‌سازی خودکار با `localStorage`.
   - محاسبات قیمت کل، تخفیف‌ها و تعداد اقلام.

### ج. لایه کش و عملکرد (Performance & Caching Layer)
- **`public/sw-cache.js`:** سرویس‌ورکر اختصاصی جهت کش دائمی فونت‌های فارسی (Vazirmatn WOFF2) و تصاویر با استراتژی Cache-First.
- **`components/AssetCacheManager.tsx`:** ابزار پیش‌گرمایش حافظه پنهان مرورگر (`warmUpBrowserAssetCache`) جهت لود آنی تصاویر کاروسل.
- **`lib/image-utils.ts`:** تابع `compressImageFile` برای فشرده‌سازی در سمت کلاینت با بوم Canvas قبل از ارسال تصویر به دیتابیس.

---

## ۳. مدل‌های داده (Data Schemas)

### محصول (`Product`)
- `id`: شناسه یکتا
- `title`: نام فارسی محصول
- `subtitle`: توضیح فنی و ویژگی‌های برجسته
- `categoryId`: شناسه دسته‌بندی مرتبط
- `price`: قیمت عادی به تومان
- `discountedPrice`: قیمت پس از اعمال تخفیف
- `isDiscounted`: وضعیت نمایش در جشنواره و ویترین اول صفحه
- `images`: آرایه‌ای از آدرس تصاویر کاروسل
- `maxCarouselImages`: حداکثر تعداد اسلایدهای فعال در کاروسل
- `features`: لیست مشخصات فنی
- `stock`: موجودی انبار

### دسته‌بندی (`Category`)
- `id`: شناسه یکتا
- `name`: نام دسته‌بندی
- `slug`: نامک انگلیسی مناسب URL
- `description`: شرح مختصر
- `imageUrl`: تصویر شاخص دسته
- `order`: اولویت چیدمان در فروشگاه

### کاربر (`UserAccount`)
- `id`: شناسه یکتا
- `fullName`: نام و نام خانوادگی
- `phone`: شماره تلفن همراه (نام کاربری ورود)
- `password`: رمز عبور
- `role`: نقش کاربر (`admin` یا `customer`)
- `email`: ایمیل (در صورت ورود با گوگل)
