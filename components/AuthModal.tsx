'use client';

import React, { useState } from 'react';
import {
  X,
  Phone,
  Lock,
  User,
  ShieldCheck,
  KeyRound,
  LogIn,
  UserPlus,
  Sparkles,
} from 'lucide-react';
import { useStore } from './StoreProvider';
import { toPersianDigits } from '@/lib/store-data';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessAdmin?: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccessAdmin }: AuthModalProps) {
  const { loginWithCredentials, registerCustomer, loginWithGoogle, users } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        const res = await loginWithCredentials(phone, password);
        if (!res.ok) {
          setError(res.error || 'خطا در ورود');
        } else {
          onClose();
        }
      } else {
        const res = await registerCustomer(fullName, phone, password);
        if (!res.ok) {
          setError(res.error || 'خطا در ثبت‌نام');
        } else {
          onClose();
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickAdminLogin = async () => {
    setError(null);
    setSubmitting(true);
    const adminAcc = users.find((u) => u.role === 'admin') || {
      phone: '09120000000',
      password: '123456',
    };
    const res = await loginWithCredentials(adminAcc.phone, adminAcc.password);
    setSubmitting(false);
    if (res.ok) {
      onClose();
      if (onSuccessAdmin) onSuccessAdmin();
    } else {
      setError(res.error || 'خطا در ورود مدیر');
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setSubmitting(true);
    const res = await loginWithGoogle();
    setSubmitting(false);
    if (res.ok) {
      onClose();
    } else if (res.error) {
      setError(res.error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FAF7F2] border border-[#E6DFD3] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#181615] px-6 py-5 text-[#FAF7F2] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#E59872] tracking-wide">
              حساب کاربری و مدیریت فروشگاه
            </span>
            <h2 className="text-xl font-extrabold mt-0.5">
              ورود به خانواده بزرگ آلِرضا
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Switch Tabs */}
        <div className="grid grid-cols-2 gap-2 p-4 pb-0">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
              mode === 'login'
                ? 'bg-[#C85A32] text-white shadow-sm'
                : 'bg-[#EDE7DC] text-[#6E675F] hover:text-[#181615]'
            }`}
          >
            <LogIn className="w-4 h-4" />
            ورود با شماره و رمز
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition ${
              mode === 'register'
                ? 'bg-[#C85A32] text-white shadow-sm'
                : 'bg-[#EDE7DC] text-[#6E675F] hover:text-[#181615]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            ثبت‌نام سریع (نام، شماره، رمز)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-[#D92D20]/10 border border-[#D92D20]/30 p-3 text-xs font-medium text-[#D92D20]">
              {error}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-[#181615] mb-1.5">
                نام و نام خانوادگی
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8C837A] absolute right-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثلاً: علی رضایی"
                  className="w-full rounded-xl bg-white border border-[#DCD4C6] pr-10 pl-4 py-2.5 text-sm text-[#181615] focus:border-[#C85A32] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#181615] mb-1.5">
              شماره موبایل
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#8C837A] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                required
                dir="ltr"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="09120000000"
                className="w-full rounded-xl bg-white border border-[#DCD4C6] pr-10 pl-4 py-2.5 text-sm text-left font-mono text-[#181615] focus:border-[#C85A32] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#181615] mb-1.5">
              رمز عبور
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C837A] absolute right-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                dir="ltr"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full rounded-xl bg-white border border-[#DCD4C6] pr-10 pl-4 py-2.5 text-sm text-left font-mono text-[#181615] focus:border-[#C85A32] focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-[#181615] py-3 text-sm font-bold text-white shadow-md hover:bg-[#C85A32] transition disabled:opacity-50"
          >
            {submitting
              ? 'در حال بررسی...'
              : mode === 'login'
              ? 'ورود به حساب کاربری'
              : 'ثبت‌نام و ورود به آلِرضا'}
          </button>

          {/* Divider */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E6DFD3]" />
            <span className="flex-shrink mx-3 text-[11px] text-[#8C837A]">
              یا دسترسی سریع مدیریت
            </span>
            <div className="flex-grow border-t border-[#E6DFD3]" />
          </div>

          {/* Quick Admin Demo Login + Google Auth */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="w-full flex items-center justify-between rounded-xl bg-[#1F6E58]/10 border border-[#1F6E58]/30 px-4 py-2.5 text-xs font-bold text-[#1F6E58] hover:bg-[#1F6E58] hover:text-white transition"
            >
              <span className="inline-flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                ورود مستقیم به عنوان مدیر سایت (پنل مدیریت)
              </span>
              <span className="font-mono text-[11px] opacity-85" dir="ltr">
                {toPersianDigits('09120000000')} / {toPersianDigits('123456')}
              </span>
            </button>

            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-white border border-[#DCD4C6] py-2.5 text-xs font-bold text-[#181615] hover:bg-[#F3EFE6] transition"
            >
              <Sparkles className="w-4 h-4 text-[#C85A32]" />
              ورود با حساب گوگل (مدیران و مشتریان)
            </button>
          </div>

          <div className="rounded-xl bg-[#F3EFE6] p-3 text-[11px] text-[#6E675F] leading-relaxed flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#C85A32] flex-shrink-0 mt-0.5" />
            <span>
              در پنل مدیریت نیز می‌توانید کاربران جدید را با{' '}
              <strong className="text-[#181615]">نام، شماره موبایل و رمز عبور دلخواه</strong> اضافه
              کنید تا با همان مشخصات وارد سایت شوند.
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
