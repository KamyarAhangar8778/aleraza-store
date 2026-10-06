export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  imageUrl?: string;
  order: number;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  categoryId: string;
  price: number; // Original price in Toman
  discountedPrice: number; // Final selling price in Toman
  isDiscounted: boolean; // Appears in top discounted showcase
  images: string[]; // Array of carousel image URLs
  maxCarouselImages: number; // Number of carousel images enabled to display
  features: string[];
  badge: string;
  stock: number;
  warranty: string;
  createdAt: string;
}

export interface UserAccount {
  id: string;
  fullName: string;
  phone: string;
  password: string;
  role: 'admin' | 'customer';
  email?: string;
  createdAt: string;
  createdBy?: string;
}

export const PRESET_APPLIANCE_GALLERY: { label: string; url: string }[] = [
  {
    label: 'کلکسیون لوازم جانبی و قطعات لوازم خانگی آلِرضا',
    url: '/images/hero_appliance_accessories.jpg',
  },
  {
    label: 'فیلتر تصفیه آب و هوای یخچال سایدبای‌ساید',
    url: '/images/fridge_water_filter.jpg',
  },
  {
    label: 'پکیج فیلتر هپا، پارویی توربو و لوله جاروبرقی',
    url: '/images/vacuum_hepa_kit.jpg',
  },
  {
    label: 'ست اکسسوری اسپرسوساز (پورتافیلتر، تمپر، لولر و پیچر)',
    url: '/images/espresso_barista_kit.jpg',
  },
  {
    label: 'پایه لرزش‌گیر و فیلتر ضد رسوب ماشین لباسشویی',
    url: '/images/washer_care_stand.jpg',
  },
  {
    label: 'پک قالب سیلیکونی و توری استیل سرخ‌کن بدون روغن',
    url: '/images/airfryer_accessory_pack.jpg',
  },
  {
    label: 'قطعات و اتصالات اسپرسوساز نیمه‌صنعتی',
    url: '/images/espresso_maker_pro.jpg',
  },
  {
    label: 'سری همزن، خمیرزن و کاسه استیل همزن حرفه‌ای',
    url: '/images/stand_mixer_copper.jpg',
  },
  {
    label: 'تجهیزات جانبی و نگهداری ماشین لباسشویی',
    url: '/images/smart_washer_titanium.jpg',
  },
  {
    label: 'لوازم جانبی جاروبرقی شارژی و ایستاده',
    url: '/images/cordless_vacuum_pro.jpg',
  },
  {
    label: 'سبد و اکسسوری پخت هواپز و سرخ‌کن',
    url: '/images/smart_air_fryer.jpg',
  },
  {
    label: 'نمای آشپزخانه و تجهیزات جانبی آلِرضا',
    url: '/images/aleraza_hero_kitchen.jpg',
  },
];

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-acc-filters',
    name: 'فیلتر آب و لوازم جانبی یخچال',
    slug: 'fridge-filters-accessories',
    description: 'فیلترهای تصفیه آب سایدبای‌ساید، فیلتر کربن بوگیر آنتی‌باکتریال، شلنگ و اتصالات نصب یخچال',
    iconName: 'Refrigerator',
    imageUrl: '/images/fridge_water_filter.jpg',
    order: 1,
    createdAt: '2026-10-06T08:00:00.000Z',
  },
  {
    id: 'cat-acc-vacuum',
    name: 'لوازم جانبی و فیلتر جاروبرقی',
    slug: 'vacuum-cleaner-accessories',
    description: 'فیلتر هپا HEPA-14 قابل شستشو، پارویی توربو، کیسه نانو، خرطومی کنفی و لوله تلسکوپی استیل',
    iconName: 'Zap',
    imageUrl: '/images/vacuum_hepa_kit.jpg',
    order: 2,
    createdAt: '2026-10-06T08:01:00.000Z',
  },
  {
    id: 'cat-acc-coffee',
    name: 'اکسسوری اسپرسوساز و باریستا',
    slug: 'espresso-barista-accessories',
    description: 'پورتافیلتر نیکد ۵۱ و ۵۸ میلی‌متری، تمپر و لولر استیل، پیچر شیر، بسکت قهوه و پودر رسوب‌زدا',
    iconName: 'Coffee',
    imageUrl: '/images/espresso_barista_kit.jpg',
    order: 3,
    createdAt: '2026-10-06T08:02:00.000Z',
  },
  {
    id: 'cat-acc-washer',
    name: 'لوازم جانبی لباسشویی و ظرفشویی',
    slug: 'washer-dishwasher-accessories',
    description: 'پایه لرزش‌گیر و ضربه‌گیر تیتانیومی، فیلتر مغناطیسی ضد رسوب، قرص جرم‌گیر دیگ و شلنگ تخلیه',
    iconName: 'Sparkles',
    imageUrl: '/images/washer_care_stand.jpg',
    order: 4,
    createdAt: '2026-10-06T08:03:00.000Z',
  },
  {
    id: 'cat-acc-cooking',
    name: 'جانبی سرخ‌کن، فر و همزن',
    slug: 'airfryer-mixer-accessories',
    description: 'قالب سیلیکونی نسوز هواپز، توری استیل دوطبقه، سری‌های همزن و خمیرزن و اسپری روغن پیرکس',
    iconName: 'Flame',
    imageUrl: '/images/airfryer_accessory_pack.jpg',
    order: 5,
    createdAt: '2026-10-06T08:04:00.000Z',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'acc-fridge-filter-pack',
    title: 'پک ۲ عددی فیلتر تصفیه آب و فیلتر بوگیر نانو یخچال ساید آلِرضا مدل AquaPure Pro',
    subtitle: 'کربن فعال پوسته نارگیل • حذف ۹۹.۹٪ کلر، رسوب و بوی نامطبوع • سازگار با انواع سایدبای‌ساید',
    categoryId: 'cat-acc-filters',
    price: 1850000,
    discountedPrice: 1390000,
    isDiscounted: true,
    images: [
      '/images/fridge_water_filter.jpg',
      '/images/hero_appliance_accessories.jpg',
      '/images/aleraza_hero_kitchen.jpg',
    ],
    maxCarouselImages: 3,
    features: [
      'دارای استاندارد بهداشت آب آشامیدنی NSF/ANSI 42 & 53',
      'شامل ۱ عدد فیلتر تصفیه آب داخلی/خارجی + ۱ عدد فیلتر هوای آنتی‌باکتریال یخچال',
      'طول عمر مفید ۶ ماه یا تصفیه ۱۵۰۰ گالن آب گوارا بدون افت فشار',
      'نصب سریع چرخشی و فیتینگ بدون نیاز به ابزار تخصصی',
    ],
    badge: 'تخفیف ویژه اول صفحه',
    stock: 35,
    warranty: 'ضمانت اصالت و سلامت فیزیکی آلِرضا',
    createdAt: '2026-10-06T08:05:00.000Z',
  },
  {
    id: 'acc-espresso-barista-kit',
    title: 'ست حرفه‌ای لوازم جانبی اسپرسوساز و باریستا آلِرضا مدل Barista Kit 58mm',
    subtitle: 'پورتافیلتر نیکد دسته گردو • تمپر کالیبره استیل • لولر توزیع‌کننده قهوه و پیچر مدرج',
    categoryId: 'cat-acc-coffee',
    price: 3450000,
    discountedPrice: 2690000,
    isDiscounted: true,
    images: [
      '/images/espresso_barista_kit.jpg',
      '/images/espresso_maker_pro.jpg',
      '/images/hero_appliance_accessories.jpg',
    ],
    maxCarouselImages: 3,
    features: [
      'پورتافیلتر بدون کف (Bottomless) استیل ۳۰۴ نگیر با دسته چوب گردوی طبیعی',
      'تمپر فنردار کالیبره‌شده و لولر تنظیم‌شونده جهت عصاره‌گیری با کرمای ضخیم',
      'پیچر استیل ضدزنگ ۳۵۰ میلی‌لیتری مخصوص لاته آرت به همراه فرچه نظافت هدگروپ',
      'موجود در سایزهای استاندارد ۵۱ و ۵۸ میلی‌متری برای انواع اسپرسوساز خانگی و نیمه‌صنعتی',
    ],
    badge: 'پرفروش‌ترین اکسسوری',
    stock: 18,
    warranty: '۲۴ ماه ضمانت ضدزنگ بودن بدنه استیل',
    createdAt: '2026-10-06T08:06:00.000Z',
  },
  {
    id: 'acc-vacuum-hepa-set',
    title: 'پکیج کامل لوازم جانبی جاروبرقی آلِرضا (فیلتر هپا HEPA-14، پارویی توربو و لوله تلسکوپی)',
    subtitle: 'فیلتر ضدحساسیت قابل شستشو • برس توربو مخصوص فرش و موی حیوانات • لوله استیل کروم',
    categoryId: 'cat-acc-vacuum',
    price: 2100000,
    discountedPrice: 1580000,
    isDiscounted: true,
    images: [
      '/images/vacuum_hepa_kit.jpg',
      '/images/cordless_vacuum_pro.jpg',
      '/images/hero_appliance_accessories.jpg',
    ],
    maxCarouselImages: 3,
    features: [
      'فیلتر هپا ۱۳ و ۱۴ چندلایه با جذب ۹۹.۹۷٪ گردوغبار ریز و عوامل آلرژی‌زا',
      'پارویی توربو چرخشی با چرخ‌های ژله‌ای نرم بدون خط و خش روی پارکت و سرامیک',
      'لوله تلسکوپی استیل قابل تنظیم ارتفاع + نازل گوشه‌گیر و برس مبل‌شویی',
      'سازگار با دهانه استاندارد ۳۲ و ۳۵ میلی‌متری انواع جاروبرقی‌های موجود در بازار',
    ],
    badge: 'پیشنهاد شگفت‌انگیز',
    stock: 28,
    warranty: '۱۲ ماه ضمانت تعویض آلِرضا',
    createdAt: '2026-10-06T08:07:00.000Z',
  },
  {
    id: 'acc-airfryer-pack',
    title: 'پک ۶ تکه لوازم جانبی سرخ‌کن بدون روغن و هواپز آلِرضا مدل AirChef Deluxe',
    subtitle: 'کاسه سیلیکونی نسوز شیاردار • توری استیل دوطبقه و سیخ جوجه • اسپری روغن پیرکس مدرج',
    categoryId: 'cat-acc-cooking',
    price: 1250000,
    discountedPrice: 890000,
    isDiscounted: true,
    images: [
      '/images/airfryer_accessory_pack.jpg',
      '/images/smart_air_fryer.jpg',
      '/images/hero_appliance_accessories.jpg',
    ],
    maxCarouselImages: 3,
    features: [
      'ظرف سیلیکونی Food-Grade بدون BPA مقاوم تا دمای ۲۴۰ درجه سانتی‌گراد',
      'جلوگیری کامل از کثیف شدن و خط افتادن سبد اصلی سرخ‌کن بدون روغن',
      'توری استیل ضدزنگ دوطبقه همراه با ۴ سیخ کباب برای دوبرابر کردن فضای پخت',
      'همراه با اسپری روغن مه‌پاش شیشه‌ای، انبر سیلیکونی و دستکش نسوز آشپزخانه',
    ],
    badge: 'تخفیف جشنواره',
    stock: 42,
    warranty: 'ضمانت سلامت و اصالت سیلیکون بهداشتی',
    createdAt: '2026-10-06T08:08:00.000Z',
  },
  {
    id: 'acc-washer-shock-kit',
    title: 'کیت محافظ و لوازم جانبی ماشین لباسشویی و ظرفشویی آلِرضا مدل SilentGuard',
    subtitle: '۴ عدد پایه لرزش‌گیر و صداگیر تیتانیومی + فیلتر مغناطیسی ضد رسوب ورودی آب',
    categoryId: 'cat-acc-washer',
    price: 980000,
    discountedPrice: 740000,
    isDiscounted: true,
    images: [
      '/images/washer_care_stand.jpg',
      '/images/smart_washer_titanium.jpg',
      '/images/hero_appliance_accessories.jpg',
    ],
    maxCarouselImages: 3,
    features: [
      'حذف تا ۹۴٪ لرزش، صدای چرخش خشک‌کن و حرکت کردن ماشین لباسشویی روی سرامیک',
      'فیلتر ضد رسوب و سختی‌گیر ورودی آب جهت محافظت از المنت، پمپ و شیر برقی',
      'تحمل وزن تا ۱۵۰ کیلوگرم مناسب برای انواع لباسشویی، ظرفشویی و یخچال',
      'کفی مکشی ضدلغزش و مقاوم در برابر رطوبت و مواد شوینده',
    ],
    badge: 'فروش ویژه اول صفحه',
    stock: 50,
    warranty: '۲۴ ماه ضمانت تعویض آلِرضا',
    createdAt: '2026-10-06T08:09:00.000Z',
  },
  {
    id: 'acc-mixer-attachments',
    title: 'ست ۳ عددی سری‌های استیل همزن، خمیرزن و کاسه یدک غذاساز آلِرضا مدل ChefMix',
    subtitle: 'سری بالونی تمام استیل ۳۰۴ • قلاب خمیرزن تفلون تقویت‌شده • شفت فلزی ضدسایش',
    categoryId: 'cat-acc-cooking',
    price: 2400000,
    discountedPrice: 2400000,
    isDiscounted: false,
    images: [
      '/images/stand_mixer_copper.jpg',
      '/images/hero_appliance_accessories.jpg',
      '/images/aleraza_hero_kitchen.jpg',
    ],
    maxCarouselImages: 3,
    features: [
      'ساخته‌شده از استیل ضدزنگ تقویت‌شده مناسب برای همزن‌های کاسه‌دار ۵ تا ۷ لیتری',
      'شامل سری همزن بالونی ۱۲ پره، پدال لیسک‌دار خامه‌زن و قلاب خمیرگیر سنگین',
      'قابل شستشو در ماشین ظرفشویی بدون تغییر رنگ یا زنگ‌زدگی',
      'طراحی مهندسی جهت ترکیب کامل مواد از کف و دیواره‌های کاسه',
    ],
    badge: 'قطعه اورجینال',
    stock: 15,
    warranty: '۱۸ ماه ضمانت آلِرضا سرویس',
    createdAt: '2026-10-06T08:10:00.000Z',
  },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin-default',
    fullName: 'مدیر کل آلِرضا',
    phone: '09120000000',
    password: '123456',
    role: 'admin',
    email: 'kavehahangar8778@gmail.com',
    createdAt: '2026-09-28T09:00:00.000Z',
    createdBy: 'system',
  },
  {
    id: 'user-customer-sample',
    fullName: 'سارا محمدی',
    phone: '09121112233',
    password: '123456',
    role: 'customer',
    email: '',
    createdAt: '2026-09-28T09:30:00.000Z',
    createdBy: 'admin',
  },
];

export function formatToman(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(Math.max(0, Math.round(amount)));
}

export function toPersianDigits(val: number | string): string {
  const str = String(val);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/\d/g, (d) => persianDigits[Number(d)]);
}

export function normalizePhone(input: string): string {
  const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  const arabic = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  let out = input.trim();
  for (let i = 0; i < 10; i++) {
    out = out.replace(new RegExp(persian[i], 'g'), String(i));
    out = out.replace(new RegExp(arabic[i], 'g'), String(i));
  }
  return out.replace(/\s+/g, '');
}

export function calcDiscountPercent(price: number, discountedPrice: number): number {
  if (!price || price <= 0 || !discountedPrice || discountedPrice <= 0 || discountedPrice >= price) {
    return 0;
  }
  return Math.round(((price - discountedPrice) / price) * 100);
}

/**
 * Parses any user price input (Persian, Arabic, or English digits, with commas, spaces, etc.)
 * into a clean non-negative integer without HTML5 step/number validation issues.
 */
export function parsePriceInput(raw: string | number): number {
  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? Math.max(0, Math.round(raw)) : 0;
  }
  const normalized = normalizePhone(String(raw));
  const digitsOnly = normalized.replace(/[^0-9]/g, '');
  if (!digitsOnly) return 0;
  const parsed = parseInt(digitsOnly, 10);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
}

/**
 * Formats a numeric price with thousand separators for easy reading inside text inputs.
 */
export function formatNumericInput(val: number | undefined | null): string {
  if (val === undefined || val === null || !Number.isFinite(val) || val <= 0) {
    return '';
  }
  return Math.round(val).toLocaleString('en-US');
}

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function resolveAssetUrl(url: string): string {
  if (!url) return '';
  if (BASE_PATH && url.startsWith('/') && !url.startsWith(`${BASE_PATH}/`)) {
    return `${BASE_PATH}${url}`;
  }
  return url;
}
