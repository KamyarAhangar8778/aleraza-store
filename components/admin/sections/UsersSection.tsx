'use client';

import React, { useState } from 'react';
import {
  UserAccount,
  MASTER_ADMIN,
  MASTER_ADMIN_PHONE,
  normalizePhone,
} from '@/lib/store-data';

interface UsersSectionProps {
  users: UserAccount[];
  activeSubSection: 'all-users' | 'add-user';
  onSelectSubSection: (sec: 'all-users' | 'add-user') => void;
  onAdminSaveUser: (user: UserAccount) => Promise<void>;
  onAdminDeleteUser: (userId: string) => Promise<void>;
}

/**
 * بخش مدیریت کاربران و افزودن کاربر جدید در پیشخوان مدیریت
 */
export function UsersSection({
  users,
  activeSubSection,
  onSelectSubSection,
  onAdminSaveUser,
  onAdminDeleteUser,
}: UsersSectionProps) {
  const [editingUser, setEditingUser] = useState<UserAccount>(() => ({
    id: 'user-new',
    fullName: '',
    phone: '',
    password: '',
    role: 'customer',
    email: '',
    createdAt: new Date().toISOString(),
    createdBy: 'admin',
  }));
  const [isEditingExistingUser, setIsEditingExistingUser] = useState(false);
  const [confirmDeleteUserId, setConfirmDeleteUserId] = useState<string | null>(null);

  const handleOpenAddUser = () => {
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
    onSelectSubSection('add-user');
  };

  const handleOpenEditUser = (user: UserAccount) => {
    setEditingUser(user);
    setIsEditingExistingUser(true);
    onSelectSubSection('add-user');
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !editingUser.fullName.trim() ||
      !editingUser.phone.trim() ||
      !editingUser.password.trim()
    ) {
      return;
    }
    await onAdminSaveUser(editingUser);
    onSelectSubSection('all-users');
  };

  if (activeSubSection === 'add-user') {
    return (
      <div className="max-w-xl space-y-4">
        <div>
          <h1 className="text-xl font-bold text-[#1d2327]">
            {isEditingExistingUser
              ? 'ویرایش کاربر'
              : 'افزودن کاربر تازه (با نام، شماره موبایل و رمز عبور)'}
          </h1>
          <p className="text-xs text-[#50575e] mt-1 leading-relaxed">
            مشتریان و همکارانی که در اینجا ثبت می‌کنید، می‌توانند با شماره موبایل و رمز عبور وارد سایت شوند و قیمت‌های همکاری و عمده اختصاصی برای آن‌ها فعال می‌گردد (ثبت‌نام عمومی در سایت بسته است).
          </p>
        </div>

        <form
          onSubmit={handleSubmitUser}
          className="bg-white border border-[#c3c4c7] p-6 rounded-sm space-y-4 text-xs shadow-xs"
        >
          <div>
            <label className="block font-bold text-[#1d2327] mb-1">
              نام و نام خانوادگی (ضروری)
            </label>
            <input
              type="text"
              required
              value={editingUser.fullName}
              onChange={(e) => setEditingUser({ ...editingUser, fullName: e.target.value })}
              placeholder="مثلاً: رضا محمدی"
              className="w-full rounded border border-[#8c8f94] px-3 py-2 text-xs"
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
              onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
              placeholder="09123456789"
              className="w-full rounded border border-[#8c8f94] px-3 py-2 font-mono text-left text-xs"
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
              onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
              placeholder="مثلاً: 123456"
              className="w-full rounded border border-[#8c8f94] px-3 py-2 font-mono text-left text-xs"
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
              className="w-full rounded border border-[#8c8f94] px-3 py-2 font-bold text-xs"
            >
              <option value="customer">مشتری</option>
              <option value="admin">مدیر کل (دسترسی به پیشخوان)</option>
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              className="rounded bg-[#2271b1] hover:bg-[#135e96] px-5 py-2.5 font-bold text-white transition cursor-pointer"
            >
              {isEditingExistingUser ? 'بروزرسانی کاربر' : 'افزودن کاربر تازه'}
            </button>
            <button
              type="button"
              onClick={() => onSelectSubSection('all-users')}
              className="rounded border border-[#8c8f94] px-4 py-2.5 font-bold text-[#50575e] hover:bg-[#f6f7f7] cursor-pointer"
            >
              بازگشت به لیست کاربران
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-[#1d2327]">کاربران</h1>
        <button
          type="button"
          onClick={handleOpenAddUser}
          className="rounded border border-[#2271b1] bg-[#f6f7f7] px-3 py-1 text-xs font-bold text-[#2271b1] hover:bg-[#2271b1] hover:text-white transition cursor-pointer"
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
                <td className="py-3 px-3 text-left space-x-2 space-x-reverse whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => handleOpenEditUser(u)}
                    className="text-[#2271b1] font-bold hover:underline cursor-pointer"
                  >
                    ویرایش
                  </button>
                  {u.id === MASTER_ADMIN.id ||
                  normalizePhone(u.phone) === normalizePhone(MASTER_ADMIN_PHONE) ? (
                    <span className="text-[10px] text-[#50575e] bg-[#f0f0f1] px-2 py-0.5 rounded font-bold border border-[#dcdcde]">
                      مدیر کل (غیرقابل حذف)
                    </span>
                  ) : confirmDeleteUserId === u.id ? (
                    <span className="inline-flex items-center gap-1 bg-[#fcf0f1] px-1.5 py-0.5 rounded border border-[#f5c2c7]">
                      <span className="text-[10px] font-bold text-[#d63638]">حذف شود؟</span>
                      <button
                        type="button"
                        onClick={async () => {
                          await onAdminDeleteUser(u.id);
                          setConfirmDeleteUserId(null);
                        }}
                        className="text-[#d63638] font-bold underline text-[10px] cursor-pointer"
                      >
                        بله
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmDeleteUserId(null)}
                        className="text-[#50575e] text-[10px] cursor-pointer"
                      >
                        خیر
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteUserId(u.id)}
                      className="text-[#d63638] font-bold hover:underline cursor-pointer"
                    >
                      حذف
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
