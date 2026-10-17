'use client';

import React, { useState } from 'react';
import {
  X,
  Phone,
  Lock,
  LogIn,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from './StoreProvider';
import { toPersianDigits } from '@/lib/store-data';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessAdmin?: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { loginWithCredentials } = useStore();
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
      const res = await loginWithCredentials(phone, password);
      if (!res.ok) {
        setError(res.error || 'شماره موبایل یا رمز عبور نامعتبر است.');
      } else {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-3xl bg-[#FAF7F2] border border-[#E6DFD3] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#181615] px-6 py-5 text-[#FAF7F2] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-[#E59872] tracking-wide">
              ورود اعضا و همکاران
            </span>
            <h2 className="text-xl font-extrabold mt-0.5">
              ورود به حساب مشتریان آلِرضا
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Info notice about admin-created accounts */}
        <div className="p-5 pb-0">
          <div className="rounded-xl bg-[#F3EFE6] border border-[#E6DFD3] p-3.5 text-xs text-[#504C46] leading-relaxed flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
            <span>
              حساب کاربری مشتریان گرامی مستقیماً توسط مدیریت فروشگاه ثبت و فعال می‌شود. با ورود به حساب کاربری،{' '}
              <strong className="text-[#181615]">قیمت همکاری و عمده</strong> کالاها برای شما نمایش داده خواهد شد.
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-[#D92D20]/10 border border-[#D92D20]/30 p-3 text-xs font-bold text-[#D92D20]">
              {error}
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
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#181615] py-3 text-sm font-bold text-white shadow-md hover:bg-[#C85A32] transition disabled:opacity-50 cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>{submitting ? 'در حال بررسی اطلاعات...' : 'ورود به حساب کاربری مشتری'}</span>
          </button>


        </form>
      </div>
    </div>
  );
}
