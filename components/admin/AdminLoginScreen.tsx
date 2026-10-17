'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LogIn } from 'lucide-react';

interface AdminLoginScreenProps {
  onLogin: (phone: string, pass: string) => Promise<{ ok: boolean; error?: string }>;
}

/**
 * صفحه ورود پیشخوان مدیریت قطعات لوازم خانگی آل رضا
 */
export function AdminLoginScreen({ onLogin }: AdminLoginScreenProps) {
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    const res = await onLogin(loginPhone, loginPass);
    setLoggingIn(false);
    if (!res.ok) {
      setLoginError(res.error || 'شماره موبایل یا رمز عبور اشتباه است.');
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f0f1] flex flex-col items-center justify-center p-4 text-[#1d2327]">
      <div className="w-full max-w-sm space-y-5">
        {/* لوگوی پیشخوان */}
        <div className="flex flex-col items-center text-center">
          <div className="h-16 w-16 rounded-2xl bg-[#1d2327] text-white flex items-center justify-center text-3xl font-black shadow-md border-2 border-[#2271b1]">
            آ
          </div>
          <h1 className="mt-3 text-xl font-black text-[#1d2327]">
            پیشخوان مدیریت قطعات لوازم خانگی آل رضا
          </h1>
          <p className="text-xs text-[#50575e] mt-1">
            سیستم مدیریت محتوا، محصولات، قیمت‌گذاری و کاربران
          </p>
        </div>

        {/* فرم ورود */}
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#c3c4c7] shadow-xs rounded-md p-6 space-y-4"
        >
          {loginError && (
            <div className="border-r-4 border-[#d63638] bg-[#fcf0f1] p-3 text-xs text-[#d63638] font-bold">
              {loginError}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#1d2327] mb-1.5">
              شماره موبایل یا نام کاربری مدیر
            </label>
            <input
              type="text"
              dir="ltr"
              required
              placeholder="09044508763"
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
              placeholder="••••••••"
              value={loginPass}
              onChange={(e) => setLoginPass(e.target.value)}
              className="w-full rounded border border-[#8c8f94] px-3 py-2 text-sm font-mono text-left focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loggingIn}
            className="w-full flex items-center justify-center gap-2 rounded bg-[#2271b1] hover:bg-[#135e96] py-2.5 text-xs font-bold text-white transition cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{loggingIn ? 'در حال ورود به پیشخوان...' : 'ورود به پیشخوان مدیریت'}</span>
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#50575e] hover:text-[#2271b1]"
          >
            ← بازگشت به صفحه اصلی فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}
