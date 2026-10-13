// ============================================================
// API CLIENT — سمت فروشگاه (نه پنل ادمین)
// ------------------------------------------------------------
// همون الگوی request() پنل ادمین، با این تفاوت که توکن از
// localStorage با کلید 'technubela_token' خونده میشه (مخصوص
// کاربر مهمان/مشتری، جدا از سشن ادمین).
//
// ⚠️ نکته‌ی خیلی مهم درباره‌ی endpoint هایی که علامت (پیشنهادی)
// دارن: من کد فعلی همه‌ی روت‌های بک‌اند رو ندیدم (فقط چندتاشون
// رو قبلاً با هم دیدیم: products, blog, auth, reviews). برای
// بقیه (فیلتر پیشرفته‌ی محصولات، سفارش‌ها، پرداخت) یه پیاده‌سازی
// پیشنهادی توی پوشه‌ی backend-additions/ گذاشتم. اگه از قبل
// نسخه‌ی دیگه‌ای داری، یا جایگزینش کن یا این فرانت رو با
// endpoint واقعی‌ت تطبیق بده.
// ============================================================

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'technubela_token';

export function getToken() {
  if (typeof window === 'undefined') return null; // سمت سرور (SSR) توکن نداریم
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === 'undefined') return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = {
    ...(!(options.body instanceof FormData) && { 'Content-Type': 'application/json' }),
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const body = options.body && !(options.body instanceof FormData) && typeof options.body !== 'string'
    ? JSON.stringify(options.body)
    : options.body;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers, body });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'خطای سرور');
  }
  return data;
}

export const api = {
  // ====== Products ======
  // params یه رشته‌ی query string آماده‌ست، مثلاً:
  // '?category=gpu&brand=Asus,MSI&minPrice=1000000&maxPrice=50000000&sort=price-asc&page=1'
  getProducts: (params = '') => request(`/products${params}`),
  getProduct: (id) => request(`/products/${id}`),
  // (پیشنهادی) برای پر کردن گزینه‌های فیلتر (برندهای موجود، بازه‌ی قیمت) بدون نیاز به گرفتن کل محصولات
  getProductFacets: (params = '') => request(`/products/facets${params}`),
  getProductReviews: (id) => request(`/products/${id}/reviews`),
  // (پیشنهادی) ثبت نظر توسط کاربر لاگین‌کرده — با وضعیت pending تا ادمین تاییدش کنه
  submitProductReview: (id, data) => request(`/products/${id}/reviews`, { method: 'POST', body: data }),

  // ====== Blog ======
  getBlogPosts: (params = '') => request(`/blog${params}`),
  getBlogPost: (slug) => request(`/blog/${slug}`),

  // ====== Auth (OTP) — همون endpoint هایی که پنل ادمین هم استفاده می‌کنه ======
  sendOTP: (phone) => request('/auth/send-otp', { method: 'POST', body: { phone } }),
  verifyOTP: (phone, code) => request('/auth/verify-otp', { method: 'POST', body: { phone, code } }),
  getMe: () => request('/auth/me'),

  // ====== Orders (پیشنهادی) ======
  // نکته: /orders/my/:id (نه /orders/:id) عمداً انتخاب شده تا با
  // روت احتمالی GET /orders/:id که توی پنل ادمین (با requireAdmin)
  // از قبل وجود داره تداخل نکنه — دو تا endpoint کاملاً جدا از هم.
  createOrder: (data) => request('/orders', { method: 'POST', body: data }),
  getMyOrders: () => request('/orders/my'),
  getMyOrder: (id) => request(`/orders/my/${id}`),

  // ====== Payment — زرین‌پال (پیشنهادی، جزئیات کامل توی backend-additions/paymentRoutes.js) ======
  requestPayment: (orderId) => request('/payment/request', { method: 'POST', body: { orderId } }),
  verifyPayment: (orderId, authority, status) => request('/payment/verify', { method: 'POST', body: { orderId, authority, status } }),
};
