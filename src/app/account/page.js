'use client';
import { useAuth } from '@/contexts/AuthContext';

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <div className="bg-panel border border-line rounded-card p-6">
      <h1 className="text-lg font-bold text-ink mb-6">پروفایل من</h1>
      <div className="space-y-4">
        <Field label="نام و نام خانوادگی" value={user?.name || '—'} />
        <Field label="شماره موبایل" value={user?.phone} dir="ltr" />
      </div>
      <p className="text-xs text-ash-dark mt-6">
        ویرایش اطلاعات پروفایل فعلاً پشتیبانی نمیشه. برای تغییر اطلاعات با پشتیبانی تماس بگیرید.
      </p>
    </div>
  );
}

function Field({ label, value, dir }) {
  return (
    <div>
      <p className="text-xs text-ash mb-1">{label}</p>
      <p className="text-ink" dir={dir}>{value}</p>
    </div>
  );
}
