'use client';
// ============================================================
// صفحه‌ی ورود — کد یک‌بارمصرف پیامکی
// ------------------------------------------------------------
// این صفحه فقط از endpoint های موجود بک‌اند استفاده می‌کنه
// (/auth/send-otp و /auth/verify-otp، همون‌هایی که پنل ادمین هم
// استفاده می‌کنه) — پس با وصل شدن SMS.ir به بک‌اند، اینجا هیچ
// تغییری لازم نداره؛ فقط پیامک واقعی به‌جای هر مکانیزم تستی فعلی
// ارسال میشه.
// ============================================================

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef(null);

  const startResendTimer = () => {
    setResendTimer(60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setResendTimer(t => {
        if (t <= 1) { clearInterval(timerRef.current); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.sendOTP(phone);
      setStep('otp');
      startResendTimer();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api.verifyOTP(phone, code);
      login(data.token, data.user);
      router.push('/account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-16">
      <h1 className="text-xl font-bold text-ink text-center mb-2">ورود به تک‌نبولا</h1>
      <p className="text-sm text-ash text-center mb-8">
        {step === 'phone' ? 'شماره موبایل خودتون رو وارد کنید' : `کد ارسال‌شده به ${phone} رو وارد کنید`}
      </p>

      {error && <div className="bg-ember/10 text-ember text-sm px-4 py-3 rounded-btn mb-4">{error}</div>}

      {step === 'phone' ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          <input
            type="tel"
            dir="ltr"
            required
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="09123456789"
            pattern="09[0-9]{9}"
            className="w-full bg-panel border border-line rounded-btn px-4 py-3 text-ink text-center tracking-wider focus:border-grape transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-grape hover:bg-grape/80 text-white font-bold py-3 rounded-btn transition disabled:opacity-50"
          >
            {loading ? 'در حال ارسال...' : 'دریافت کد ورود'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            dir="ltr"
            required
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            placeholder="کد 5 رقمی"
            className="w-full bg-panel border border-line rounded-btn px-4 py-3 text-ink text-center text-xl tracking-[0.5em] focus:border-grape transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-grape hover:bg-grape/80 text-white font-bold py-3 rounded-btn transition disabled:opacity-50"
          >
            {loading ? 'در حال بررسی...' : 'تایید و ورود'}
          </button>
          <div className="text-center">
            {resendTimer > 0 ? (
              <span className="text-xs text-ash-dark">ارسال مجدد کد تا {resendTimer.toLocaleString('fa-IR')} ثانیه دیگر</span>
            ) : (
              <button type="button" onClick={handleSendOTP} className="text-xs text-grape-light hover:underline">
                ارسال مجدد کد
              </button>
            )}
          </div>
          <button type="button" onClick={() => setStep('phone')} className="w-full text-xs text-ash hover:text-ink transition">
            ← ویرایش شماره موبایل
          </button>
        </form>
      )}
    </div>
  );
}
