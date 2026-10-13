'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { KeyRound } from 'lucide-react';

interface AdminLoginScreenProps {
  onLogin: (phone: string, pass: string) => Promise<{ ok: boolean; error?: string }>;
  onLoginWithGoogle: () => Promise<{ ok: boolean; error?: string }>;
}

/**
 * صفحه ورود کلاسیک وردپرسی پیشخوان مدیریت آلِرضا
 */
export function AdminLoginScreen({ onLogin, onLoginWithGoogle }: AdminLoginScreenProps) {
  const [loginPhone, setLoginPhone] = useState('09120000000');
  const [loginPass, setLoginPass] = useState('123456');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [googleLoggingIn, setGoogleLoggingIn] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    const res = await onLogin(loginPhone, loginPass);
    setLoggingIn(false);
    if (!res.ok) {
      setLoginError(res.error || 'اطلاعات ورود اشتباه است.');
    }
  };

  const handleGoogleLogin = async () => {
    setLoginError(null);
    setGoogleLoggingIn(true);
    try {
      const res = await onLoginWithGoogle();
      if (!res.ok && res.error) {
        setLoginError(res.error);
      }
    } finally {
      setGoogleLoggingIn(false);
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
            پیشخوان مدیریت آلِرضا
          </h1>
          <p className="text-xs text-[#50575e] mt-1">
            سیستم مدیریت محتوا، محصولات، کاروسل‌ها و کاربران
          </p>
        </div>

        {/* فرم ورود */}
        <form
          onSubmit={handleSubmit}
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
            className="w-full rounded bg-[#2271b1] hover:bg-[#135e96] py-2.5 text-xs font-bold text-white transition cursor-pointer"
          >
            {loggingIn ? 'در حال ورود به پیشخوان...' : 'ورود به پیشخوان وردپرس آلِرضا'}
          </button>

          <div className="pt-2 border-t border-[#dcdcde] space-y-2">
            <button
              type="button"
              onClick={async () => {
                setLoggingIn(true);
                await onLogin('09120000000', '123456');
                setLoggingIn(false);
              }}
              className="w-full flex items-center justify-center gap-1.5 rounded bg-[#f6f7f7] border border-[#2271b1] py-2 text-xs font-bold text-[#2271b1] hover:bg-[#f0f6fc] transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              ورود فوری مدیر پیش‌فرض (۰۹۱۲۰۰۰۰۰۰۰ / ۱۲۳۴۵۶)
            </button>

            <button
              type="button"
              disabled={loggingIn || googleLoggingIn}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-1.5 rounded bg-white border border-[#c3c4c7] py-2 text-xs font-semibold text-[#1d2327] hover:bg-[#f6f7f7] transition cursor-pointer disabled:opacity-60"
            >
              {googleLoggingIn ? 'در حال ارتباط با گوگل...' : 'ورود با حساب گوگل'}
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
