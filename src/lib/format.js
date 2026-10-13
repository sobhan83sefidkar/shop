// ============================================================
// توابع فرمت‌دهی — قیمت و تاریخ
// ------------------------------------------------------------
// تاریخ‌ها با toLocaleDateString('fa-IR') نمایش داده میشن.
// این متد built-in جاوااسکریپته و به‌صورت خودکار تاریخ رو به
// تقویم شمسی (جلالی) و اعداد فارسی تبدیل می‌کنه — دقیقاً همون
// روشی که توی پنل ادمین هم استفاده کردیم، بدون نیاز به کتابخونه‌ی
// جانبی توی فرانت (برخلاف بک‌اند که برای گروه‌بندی دقیق ماهانه
// از jalaali-js استفاده کردیم).
// ============================================================

/** قیمت رو با جداکننده‌ی هزارگان فارسی + "تومان" نمایش میده. مثلاً: ۱٬۲۵۰٬۰۰۰ تومان */
export function formatPrice(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '—';
  return `${Number(amount).toLocaleString('fa-IR')} تومان`;
}

/** عدد ساده با اعداد فارسی (بدون واحد) — برای تعداد، امتیاز و غیره */
export function formatNumber(n) {
  if (n === null || n === undefined || isNaN(n)) return '۰';
  return Number(n).toLocaleString('fa-IR');
}

/** تاریخ کامل شمسی، مثلاً: ۱۸ مرداد ۱۴۰۵ */
export function formatDate(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** تاریخ کوتاه شمسی، مثلاً: ۱۴۰۵/۵/۱۸ */
export function formatDateShort(date) {
  if (!date) return '';
  return new Date(date).toLocaleDateString('fa-IR');
}

/** درصد تخفیف بین قیمت قبلی و قیمت فعلی */
export function discountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}
