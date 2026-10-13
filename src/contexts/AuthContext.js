'use client';
// ============================================================
// احراز هویت — ورود با کد یک‌بارمصرف (OTP)
// ------------------------------------------------------------
// این Context فقط از endpoint هایی استفاده می‌کنه که از قبل توی
// بک‌اند وجود دارن (همون‌هایی که پنل ادمین هم برای لاگین استفاده
// می‌کنه: /auth/send-otp ، /auth/verify-otp ، /auth/me).
// یعنی هیچ تغییری توی بک‌اند لازم نیست.
//
// 📌 درباره‌ی SMS.ir: ارسال واقعی پیامک، مسئولیت بک‌انده (داخل
// روت /auth/send-otp). اینجا فقط UI جریان ورود رو می‌سازیم. تا
// وقتی توکن SMS.ir رو وصل نکردید، هر رفتار تستی که بک‌اند فعلاً
// برای OTP داره (مثلاً چاپ کد توی کنسول یا یه کد ثابت) همینجوری
// از همین صفحه کار می‌کنه — وقتی SMS.ir رو وصل کردیم، این فرانت
// کوچیک‌ترین تغییری لازم نداره، چون فقط از endpoint موجود استفاده
// می‌کنه.
// ============================================================

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, getToken, setToken } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) { setLoading(false); return; }

    api.getMe()
      .then(data => setUser(data.user))
      .catch(() => setToken(null)) // توکن نامعتبر/منقضی‌شده
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback((token, userData) => {
    setToken(token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth باید داخل AuthProvider استفاده بشه');
  return ctx;
}
