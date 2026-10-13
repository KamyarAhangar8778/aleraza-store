import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import { StoreProvider } from '@/components/StoreProvider';
import { AssetCacheManager } from '@/components/AssetCacheManager';

const vazirmatn = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: 'آلِرضا | مرجع تخصصی لوازم جانبی و قطعات اورجینال لوازم خانگی',
  description:
    'فروشگاه تخصصی و لندینگ پیج لوازم جانبی لوازم خانگی آلِرضا — عرضه فیلترهای تصفیه آب و هوای یخچال، فیلتر هپا و قطعات جاروبرقی، لوازم جانبی باریستا و اسپرسوساز، پایه‌های لرزش‌گیر لباسشویی و ظروف نسوز سرخ‌کن با ضمانت اصالت و پنل مدیریت وردپرس.',
  openGraph: {
    title: 'آلِرضا | مرجع تخصصی لوازم جانبی و قطعات اورجینال لوازم خانگی',
    description:
      'فروشگاه تخصصی و لندینگ پیج لوازم جانبی لوازم خانگی آلِرضا — عرضه فیلترهای تصفیه آب و هوای یخچال، فیلتر هپا و قطعات جاروبرقی، لوازم جانبی باریستا و اسپرسوساز، پایه‌های لرزش‌گیر لباسشویی و ظروف نسوز سرخ‌کن با ضمانت اصالت و پنل مدیریت وردپرس.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'آلِرضا | مرجع تخصصی لوازم جانبی و قطعات اورجینال لوازم خانگی',
    description:
      'فروشگاه تخصصی و لندینگ پیج لوازم جانبی لوازم خانگی آلِرضا — عرضه فیلترهای تصفیه آب و هوای یخچال، فیلتر هپا و قطعات جاروبرقی، لوازم جانبی باریستا و اسپرسوساز، پایه‌های لرزش‌گیر لباسشویی و ظروف نسوز سرخ‌کن با ضمانت اصالت و پنل مدیریت وردپرس.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={vazirmatn.className}>
      <body suppressHydrationWarning className="bg-[#FAF7F2] text-[#181615] antialiased">
        <StoreProvider>
          <AssetCacheManager />
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
