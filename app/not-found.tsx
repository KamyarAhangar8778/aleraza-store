import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold">404 - صفحه مورد نظر یافت نشد</h1>
      <Link href="/" className="mt-4 text-[#C85A32] hover:underline">
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
