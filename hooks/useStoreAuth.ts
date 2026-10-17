'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { signOut as fbSignOut } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import {
  UserAccount,
  MASTER_ADMIN,
  MASTER_ADMIN_PHONE,
  normalizePhone,
} from '@/lib/store-data';

const SESSION_STORAGE_KEY = 'aleraza_active_user_v1';
const OBSOLETE_USER_IDS = ['user-admin-default', 'user-customer-sample'];
const OBSOLETE_USER_PHONES = ['09120000000', '09121112233'];

/**
 * هوک ماژولار مدیریت احراز هویت، کاربران، نشست کاربر جاری و همگام‌سازی فایربیس
 */
export function useStoreAuth(showToast: (msg: string) => void) {
  const [users, setUsers] = useState<UserAccount[]>([MASTER_ADMIN]);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedUser = localStorage.getItem(SESSION_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // شنود و همگام‌سازی پایگاه داده کاربران از Firestore و پاکسازی کاربرهای تستی قدیمی
  useEffect(() => {
    const unsubUsers = onSnapshot(
      collection(db, 'users_directory'),
      async (snapshot) => {
        const rawList = snapshot.docs.map((d) => {
          const data = d.data() as UserAccount;
          return {
            ...data,
            id: d.id,
          };
        });

        // ۱. پاکسازی همیشگی کاربرهای دیفالت نمونه از دیتابیس (سارا محمدی و ادمین تستی قدیمی)
        for (const docSnap of snapshot.docs) {
          const data = docSnap.data() as UserAccount;
          const cleanP = normalizePhone(data.phone || '');
          if (
            OBSOLETE_USER_IDS.includes(docSnap.id) ||
            OBSOLETE_USER_PHONES.includes(cleanP)
          ) {
            deleteDoc(doc(db, 'users_directory', docSnap.id)).catch(() => {});
          }
        }

        // ۲. اطمینان از وجود همیشگی مدیر کل اصلی (کاوه آهنگر) در دیتابیس
        const hasMasterAdmin = rawList.some(
          (u) =>
            normalizePhone(u.phone) === normalizePhone(MASTER_ADMIN_PHONE) ||
            u.id === MASTER_ADMIN.id
        );
        if (!hasMasterAdmin) {
          setDoc(doc(db, 'users_directory', MASTER_ADMIN.id), MASTER_ADMIN).catch(() => {});
        }

        // ۳. ساخت لیست نهایی کاربران فیلترشده
        const filtered = rawList.filter(
          (u) =>
            !OBSOLETE_USER_IDS.includes(u.id) &&
            !OBSOLETE_USER_PHONES.includes(normalizePhone(u.phone || ''))
        );

        if (!filtered.some((u) => normalizePhone(u.phone) === normalizePhone(MASTER_ADMIN_PHONE))) {
          filtered.unshift(MASTER_ADMIN);
        }

        setUsers(filtered);
        setCurrentUser((prev) => {
          if (!prev) return null;
          const updated = filtered.find((u) => u.id === prev.id);
          return updated || prev;
        });
      },
      (error) => {
        console.error('Firestore users error:', error);
      }
    );

    return () => {
      unsubUsers();
    };
  }, []);

  /**
   * ورود با شماره موبایل و رمز عبور (پشتیبانی از اعداد فارسی و انگلیسی)
   */
  const loginWithCredentials = async (
    phoneInput: string,
    passwordInput: string
  ): Promise<{ ok: boolean; error?: string }> => {
    const cleanPhone = normalizePhone(phoneInput);
    const cleanPass = normalizePhone(passwordInput);

    const matched = users.find(
      (u) => normalizePhone(u.phone) === cleanPhone && normalizePhone(u.password) === cleanPass
    );

    if (matched) {
      setCurrentUser(matched);
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(matched));
      }
      showToast(`خوش آمدید، ${matched.fullName}`);
      return { ok: true };
    }

    return { ok: false, error: 'شماره موبایل یا رمز عبور اشتباه است.' };
  };

  /**
   * ثبت نام مشتری جدید و ذخیره در فایربیس
   */
  const registerCustomer = async (
    fullName: string,
    phoneInput: string,
    passwordInput: string
  ): Promise<{ ok: boolean; error?: string }> => {
    const cleanPhone = normalizePhone(phoneInput);
    const cleanPass = normalizePhone(passwordInput);

    if (!fullName.trim() || cleanPhone.length < 10 || cleanPass.length < 4) {
      return { ok: false, error: 'لطفاً نام، شماره موبایل معتبر و رمز حداقل ۴ رقمی وارد کنید.' };
    }

    const exists = users.find((u) => normalizePhone(u.phone) === cleanPhone);
    if (exists) {
      return { ok: false, error: 'این شماره تماس قبلاً در سیستم ثبت شده است.' };
    }

    const newUser: UserAccount = {
      id: `usr-${Date.now()}`,
      fullName: fullName.trim(),
      phone: cleanPhone,
      password: cleanPass,
      role: 'customer',
      email: '',
      createdAt: new Date().toISOString(),
      createdBy: 'self',
    };

    try {
      await setDoc(doc(db, 'users_directory', newUser.id), newUser);
      setCurrentUser(newUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
      }
      showToast(`حساب کاربری ${newUser.fullName} با موفقیت ساخته شد!`);
      return { ok: true };
    } catch (e) {
      console.error('Error registering user:', e);
      return { ok: false, error: 'خطا در ثبت اطلاعات. مجدداً تلاش کنید.' };
    }
  };

  /**
   * ورود با حساب گوگل و ثبت خودکار در فهرست کاربران
   */
  /**
   * خروج از حساب کاربری
   */
  const logout = async () => {
    try {
      await fbSignOut(auth);
    } catch {
      // ignore
    }
    setCurrentUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    showToast('از حساب کاربری خود خارج شدید.');
  };

  /**
   * ذخیره یا به‌روزرسانی اطلاعات کاربر توسط ادمین
   */
  const adminSaveUser = async (userAccount: UserAccount) => {
    const isMaster =
      userAccount.id === MASTER_ADMIN.id ||
      normalizePhone(userAccount.phone) === normalizePhone(MASTER_ADMIN_PHONE);

    const docId = isMaster
      ? MASTER_ADMIN.id
      : userAccount.id && userAccount.id !== 'user-new'
      ? userAccount.id
      : `usr-${Date.now()}`;

    const cleanUser: UserAccount = {
      ...userAccount,
      id: docId,
      phone: normalizePhone(userAccount.phone),
      password: normalizePhone(userAccount.password),
      fullName: userAccount.fullName.trim(),
      role: isMaster ? 'admin' : userAccount.role,
      email: userAccount.email || '',
      createdBy: userAccount.createdBy || 'admin',
    };
    await setDoc(doc(db, 'users_directory', cleanUser.id), cleanUser);
    showToast(`اطلاعات کاربر «${cleanUser.fullName}» ذخیره شد.`);
  };

  /**
   * حذف کاربر توسط ادمین (با حفاظت کامل از مدیر کل اصلی)
   */
  const adminDeleteUser = async (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (
      userId === MASTER_ADMIN.id ||
      (target && normalizePhone(target.phone) === normalizePhone(MASTER_ADMIN_PHONE))
    ) {
      showToast('مدیر کل اصلی (کاوه آهنگر) غیرقابل حذف است.');
      return;
    }

    // حذف بلادرنگ از استیت محلی جهت جلوگیری از تأخیر UI
    setUsers((prev) => prev.filter((u) => u.id !== userId));

    try {
      await deleteDoc(doc(db, 'users_directory', userId));
      showToast('کاربر مورد نظر با موفقیت حذف شد.');
    } catch (e) {
      console.error('Error deleting user:', e);
      showToast('خطا در حذف کاربر از پایگاه داده.');
    }
  };

  return {
    users,
    currentUser,
    loginWithCredentials,
    registerCustomer,
    logout,
    adminSaveUser,
    adminDeleteUser,
  };
}
