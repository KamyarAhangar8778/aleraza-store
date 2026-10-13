'use client';

import React from 'react';
import Link from 'next/link';
import { ExternalLink, User } from 'lucide-react';
import { UserAccount } from '@/lib/store-data';

interface AdminHeaderProps {
  currentUser: UserAccount;
}

/**
 * نوار ابزار بالای پیشخوان مدیریت (استایل نوار ادمین وردپرس)
 */
export function AdminHeader({ currentUser }: AdminHeaderProps) {
  return (
    <header className="h-12 bg-[#1d2327] text-white px-4 flex items-center justify-between border-b border-[#0c0d0e] shrink-0 text-xs">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold">
          <div className="h-7 w-7 rounded bg-[#2271b1] text-white flex items-center justify-center font-black text-sm">
            آ
          </div>
          <span className="hidden sm:inline">پیشخوان مدیریت وردپرس آلِرضا</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="inline-flex items-center gap-1 text-[#c3c4c7] hover:text-[#72aee6] transition bg-[#2c3338] px-2.5 py-1 rounded text-[11px]"
        >
          <ExternalLink className="w-3 h-3" />
          <span>مشاهده فروشگاه در تب جدید</span>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-[#c3c4c7]">
          <User className="w-3.5 h-3.5 text-[#72aee6]" />
          <span>سلام، <strong className="text-white">{currentUser.fullName}</strong></span>
        </div>
        <span className="bg-[#2271b1] text-white text-[10px] px-2 py-0.5 rounded font-bold">
          {currentUser.role === 'admin' ? 'مدیر کل' : 'کاربر'}
        </span>
      </div>
    </header>
  );
}
