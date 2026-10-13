import Link from 'next/link';
import { api } from '@/lib/api';
import { CATEGORY_GROUPS } from '@/lib/categories';
import ProductCard from '@/components/product/ProductCard';
import BlogCard from '@/components/blog/BlogCard';
import Image from 'next/image';


// ============================================================
// صفحه‌ی اصلی — Server Component
// ------------------------------------------------------------
// بخش‌ها: هیرو (با پس‌زمینه‌ی مدار/شبکه‌ای که امضای بصری سایته)،
// دسته‌بندی‌های پرکاربرد، پرفروش‌ها، جدیدترین‌ها، نشان‌های اعتماد،
// و پیش‌نمایش مقالات وبلاگ (برای internal linking و سئو).
// ============================================================

export const metadata = {
  title: 'تک‌نبولا | فروشگاه تخصصی قطعات کامپیوتر و گجت',
  description: 'خرید آنلاین کارت گرافیک، پردازنده، لپ‌تاپ، جانبی و گجت‌های کاربردی با گارانتی اصالت کالا و ارسال سریع به سراسر ایران.',
  alternates: { canonical: '/' },
};

const categories = [
  { slug: 'gpu', label: 'کارت گرافیک', icon: '/images/gpu.webp' },
  { slug: 'cpu', label: 'پردازنده (CPU)', icon: '/images/cpu.webp' },
  { slug: 'motherboard', label: 'مادربرد', icon: '/images/mother-board.webp' },
  { slug: 'ram', label: 'رم', icon: '/images/ram2.webp' },
  { slug: 'storage', label: 'هارد و SSD', icon: '/images/ssd.webp' },
  { slug: 'psu', label: 'منبع تغذیه', icon: '/images/computer-power.webp' },
  { slug: 'case', label: 'کیس', icon: '/images/computer-case.webp' },
  { slug: 'monitor', label: 'مانیتور', icon: '/images/monitor.webp' },
  { slug: 'keyboard', label: 'کیبورد', icon: '/images/keyboard.webp' },
  { slug: 'mouse', label: 'ماوس', icon: '/images/mouse.webp' },
  { slug: 'audio', label: 'هدست و اسپیکر', icon: '/images/speaker.webp' },
  { slug: 'cooling', label: 'خنک‌کننده و فن', icon: '/images/cooler.webp' },
]

export default async function HomePage() {
  // درخواست‌ها موازی گرفته میشن تا صفحه سریع‌تر لود بشه
  const [bestsellersRes, newArrivalsRes, postsRes] = await Promise.allSettled([
    api.getProducts('?sort=bestselling&limit=8'),
    api.getProducts('?sort=newest&limit=8'),
    api.getBlogPosts('?limit=3'),
  ]);

  const bestsellers = bestsellersRes.status === 'fulfilled' ? (bestsellersRes.value.products || []) : [];
  const newArrivals = newArrivalsRes.status === 'fulfilled' ? (newArrivalsRes.value.products || []) : [];
  const posts = postsRes.status === 'fulfilled' ? (postsRes.value.posts || []) : [];

  // یه دسته از هر گروه، برای نمایش شش‌تایی روی صفحه‌ی اصلی
  // const featuredCategories = CATEGORY_GROUPS.flatMap(g => g.items).slice(0, 12);

  return (
    <div>
      {/* ===== هیرو ===== */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 circuit-bg" aria-hidden="true" />
        <div className="absolute inset-0 bg-gradient-to-b from-grape/10 via-transparent to-night" aria-hidden="true" />
        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 text-center">
          <span className="inline-block text-xs bg-panel border border-line text-grape-light px-3 py-1.5 rounded-full mb-5">
            ارسال به سراسر ایران
          </span>
          <h1 className="text-3xl md:text-5xl font-bold text-ink leading-tight mb-4">
            قطعات کامپیوتر و گجت،<br className="hidden md:block" /> با <span className="text-transparent bg-clip-text bg-gradient-to-l from-grape-light to-lagoon">اصالت تضمینی</span>
          </h1>
          <p className="text-ash max-w-xl mx-auto mb-8">
            از کارت گرافیک و پردازنده تا لوازم جانبی و گجت‌های کاربردی روزمره — همه‌چیز برای ست‌آپ شما، یک‌جا.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/products" className="bg-grape hover:bg-grape/80 text-white font-bold px-6 py-3 rounded-btn transition">
              مشاهده محصولات
            </Link>
            <Link href="/category/gpu" className="bg-panel border border-line hover:border-grape-light text-ink font-bold px-6 py-3 rounded-btn transition">
              کارت‌های گرافیک
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* ===== دسته‌بندی‌های پرکاربرد ===== */}
        <section className="py-10">
          <h2 className="text-lg font-bold text-ink mb-5">دسته‌بندی‌ها</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map(cat => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex flex-col items-center gap-2 bg-panel border border-line rounded-card p-4 hover:border-grape/60 hover:-translate-y-0.5 transition"
              >
                <div className="w-[100px] h-[100px] flex items-center justify-center">
                  <Image
                    src={cat.icon}
                    alt={cat.label}
                    width={100}
                    height={100}
                    className="w-full h-full object-contain"
                  />
                </div>

                <span className="text-xs text-ash text-center">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ===== پرفروش‌ترین‌ها ===== */}
        {bestsellers.length > 0 && (
          <ProductSection title="پرفروش‌ترین‌ها" href="/products?isBestseller=true" products={bestsellers} />
        )}

        {/* ===== جدیدترین‌ها ===== */}
        {newArrivals.length > 0 && (
          <ProductSection title="جدیدترین محصولات" href="/products?sort=newest" products={newArrivals} />
        )}

        {/* ===== نشان‌های اعتماد ===== */}
        <section className="py-10 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🛡️', title: 'گارانتی اصالت کالا', text: 'همه‌ی محصولات دارای گارانتی رسمی و اصالت تضمین‌شده' },
            { icon: '🚚', title: 'ارسال سریع', text: 'ارسال به سراسر کشور در کمتر از ۴۸ ساعت' },
            { icon: '💬', title: 'پشتیبانی تخصصی', text: 'مشاوره‌ی رایگان قبل و بعد از خرید توسط کارشناسان سخت‌افزار' },
          ].map(item => (
            <div key={item.title} className="bg-panel border border-line rounded-card p-5 flex gap-4 items-start">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <h3 className="text-ink font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-ash text-xs leading-6">{item.text}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ===== پیش‌نمایش وبلاگ ===== */}
        {posts.length > 0 && (
          <section className="py-10">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-ink">از مجله نوبلا</h2>
              <Link href="/blog" className="text-sm text-grape-light hover:underline">مشاهده همه →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {posts.map(post => <BlogCard key={post.id} post={post} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function ProductSection({ title, href, products }) {
  return (
    <section className="py-6 border-t border-line">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-ink">{title}</h2>
        <Link href={href} className="text-sm text-grape-light hover:underline">مشاهده همه →</Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
