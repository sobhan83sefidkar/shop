const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://technubela.example.com';

// Next.js از روی این فایل، خودکار /robots.txt رو می‌سازه.
export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // صفحات شخصی/حساس رو از ایندکس گوگل کنار می‌ذاریم
      disallow: ['/account', '/cart', '/checkout', '/login'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
