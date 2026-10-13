'use client';

import { useState, useEffect, useRef } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { signInWithPopup, signOut as fbSignOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from '@/lib/firebase';
import { UserAccount, INITIAL_USERS, normalizePhone } from '@/lib/store-data';

const SESSION_STORAGE_KEY = 'aleraza_active_user_v1';

/**
 * هوک ماژولار مدیریت احراز هویت، کاربران، نشست کاربر جاری و همگام‌سازی فایربیس
 */
export function useStoreAuth(showToast: (msg: string) => void) {
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const savedUser = localStorage.getItem(SESSION_STORAGE_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const isGooglePendingRef = useRef(false);

  // شنود و همگام‌سازی پایگاه داده کاربران از Firestore
  useEffect(() => {
    const unsubUsers = onSnapshot(
      collection(db, 'users_directory'),
      async (snapshot) => {
        if (snapshot.empty) {
          try {
            const batch = writeBatch(db);
            for (const usr of INITIAL_USERS) {
              batch.set(doc(db, 'users_directory', usr.id), usr);
            }
            await batch.commit();
          } catch {
            // ignore seed errors
          }
          setUsers(INITIAL_USERS);
        } else {
          const list = snapshot.docs.map((d) => d.data() as UserAccount);
          setUsers(list);
          setCurrentUser((prev) => {
            if (!prev) return null;
            const updated = list.find((u) => u.id === prev.id);
            return updated || prev;
          });
        }
      },
      (error) => {
        console.error('Firestore users error:', error);
      }
    );

    // همگام‌سازی وضعیت احراز هویت گوگل
    const unsubAuth = onAuthStateChanged(auth, (fbUser) => {
      if (fbUser && fbUser.email) {
        const isOwner = fbUser.email.toLowerCase() === 'kavehahangar8778@gmail.com';
        const googleAccount: UserAccount = {
          id: `google-${fbUser.uid}`,
          fullName: fbUser.displayName || 'مدیر آلِرضا',
          phone: fbUser.phoneNumber || '09120000000',
          password: 'google-oauth-user',
          role: isOwner ? 'admin' : 'customer',
          email: fbUser.email,
          createdAt: new Date().toISOString(),
          createdBy: 'google',
        };
        setCurrentUser(googleAccount);
        if (typeof window !== 'undefined') {
          localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(googleAccount));
        }
      }
    });

    return () => {
      unsubUsers();
      unsubAuth();
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
  const loginWithGoogle = async (): Promise<{ ok: boolean; error?: string }> => {
    if (isGooglePendingRef.current) {
      return { ok: false, error: 'درخواست ورود در حال پردازش است...' };
    }
    isGooglePendingRef.current = true;
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const fbUser = res.user;
      const newUser: UserAccount = {
        id: `google-${fbUser.uid}`,
        fullName: fbUser.displayName || 'مدیر آلِرضا',
        phone: fbUser.phoneNumber || '09120000000',
        password: 'google-oauth-user',
        role: 'admin',
        email: fbUser.email || '',
        createdAt: new Date().toISOString(),
        createdBy: 'google',
      };
      await setDoc(doc(db, 'users_directory', newUser.id), newUser);
      setCurrentUser(newUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newUser));
      }
      showToast(`${newUser.fullName} عزیز، با حساب گوگل وارد شدید.`);
      return { ok: true };
    } catch (e: unknown) {
      const err = e as { code?: string; message?: string };
      const code = err?.code || '';
      let errorMsg = 'ورود با گوگل انجام نشد. می‌توانید با شماره موبایل و رمز عبور وارد شوید.';
      if (code === 'auth/popup-blocked') {
        errorMsg = 'مرورگر پنجره پاپ‌آپ گوگل را مسدود کرد. لطفاً پاپ‌آپ را در نوار آدرس مجاز کنید یا با شماره و رمز وارد شوید.';
        console.warn('Google sign in: popup blocked by browser/iframe.');
      } else if (code === 'auth/cancelled-popup-request') {
        errorMsg = 'درخواست ورود پاپ‌آپ لغو شد.';
        console.warn('Google sign in: popup request cancelled.');
      } else if (code === 'auth/popup-closed-by-user') {
        errorMsg = 'پنجره ورود توسط کاربر بسته شد.';
        console.warn('Google sign in: popup closed by user.');
      } else {
        console.warn('Google sign in notice:', err?.message || err);
      }
      return {
        ok: false,
        error: errorMsg,
      };
    } finally {
      isGooglePendingRef.current = false;
    }
  };

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
    const cleanUser: UserAccount = {
      ...userAccount,
      phone: normalizePhone(userAccount.phone),
      password: normalizePhone(userAccount.password),
      fullName: userAccount.fullName.trim(),
      email: userAccount.email || '',
      createdBy: userAccount.createdBy || 'admin',
    };
    await setDoc(doc(db, 'users_directory', cleanUser.id), cleanUser);
    showToast(`اطلاعات کاربر «${cleanUser.fullName}» ذخیره شد.`);
  };

  /**
   * حذف کاربر توسط ادمین
   */
  const adminDeleteUser = async (userId: string) => {
    await deleteDoc(doc(db, 'users_directory', userId));
    showToast('کاربر مورد نظر حذف شد.');
  };

  return {
    users,
    currentUser,
    loginWithCredentials,
    registerCustomer,
    loginWithGoogle,
    logout,
    adminSaveUser,
    adminDeleteUser,
  };
}
