import './globals.css';
import { CartProvider } from '@/contexts/CartContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// ============================================================
// ROOT LAYOUT
// ------------------------------------------------------------
// - html lang="fa" dir="rtl" برای درست نمایش داده شدن فارسی
// - متادیتای پیش‌فرض سئو (هر صفحه می‌تونه override کنه با
//   export function generateMetadata در همون page.js)
// - Organization JSON-LD یه بار توی کل سایت (به گوگل کمک می‌کنه
//   نام برند، لوگو، و شبکه‌های اجتماعی رو توی نتایج جستجو بشناسه)
// ============================================================

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://technubela.example.com';

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'تک‌نبولا | فروشگاه قطعات کامپیوتر و گجت', template: '%s | تک‌نبولا' },
  description: 'خرید آنلاین قطعات کامپیوتر، لپ‌تاپ، جانبی و گجت‌های کاربردی با گارانتی اصالت و ارسال سریع به سراسر ایران.',
  keywords: ['قطعات کامپیوتر', 'کارت گرافیک', 'خرید لپ‌تاپ', 'فروشگاه کامپیوتر', 'گجت کامپیوتری'],
  openGraph: {
    type: 'website',
    locale: 'fa_IR',
    siteName: 'تک‌نبولا',
    title: 'تک‌نبولا | فروشگاه قطعات کامپیوتر و گجت',
    description: 'خرید آنلاین قطعات کامپیوتر، لپ‌تاپ، جانبی و گجت‌های کاربردی با گارانتی اصالت.',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export const viewport = { themeColor: '#ffffff' };

export default function RootLayout({ children }) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'OnlineStore',
    name: 'تک‌نبولا',
    url: SITE_URL,
    // ⚠️ لوگوی واقعی رو جایگزین کن — فایل رو توی public/logo.png بذار
    logo: `${SITE_URL}/logo.png`,
    telephone: '021-91000000',
  };

  return (
    <html lang="fa" dir="rtl">
      <body className="font-sans antialiased">
        {/* eslint-disable-next-line react/no-danger */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="min-h-[60vh]">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
