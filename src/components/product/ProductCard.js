import Link from 'next/link';
import StarRating from '@/components/common/StarRating';
import { formatPrice, discountPercent } from '@/lib/format';
import { productUrl } from '@/lib/seo';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

// کارت محصول — توی همه‌ی صفحات (خانه، لیست، مرتبط) استفاده میشه.
// همچنان Server Component ساده‌ست (بدون state/جاوااسکریپت اضافه)؛
// همه‌ی جلوه‌های هاور فقط با CSS/Tailwind پیاده شدن تا صفحات لیست
// بزرگ سبک بمونن.
export default function ProductCard({ product }) {
  const discount = discountPercent(product.price, product.oldPrice);
  const outOfStock = !product.stock || product.stock <= 0;

  return (
    <Link
      href={productUrl(product)}
      className="group relative flex flex-col bg-panel border border-line rounded-card overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-transparent hover:shadow-[0_0_0_1px_rgba(37,99,235,0.5),0_20px_35px_-15px_rgba(37,99,235,0.35)]"
    >
      <div className="relative aspect-square bg-card overflow-hidden">
        {/* درخشش گرادیانی گریپ/لاگون پشت تصویر — فقط موقع هاور دیده میشه، امضای بصری برند */}
        <div className="absolute inset-0 bg-gradient-to-br from-grape/25 via-transparent to-lagoon/25 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-[1]" />

        {product.images?.[0] ? (
          <img
            src={`${API_BASE}${product.images[0]}`}
            alt={product.name}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${outOfStock ? 'grayscale opacity-50' : ''}`}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl text-ash-dark">📦</div>
        )}

        {/* نشان‌های راست‌بالا — استایل شیشه‌ای با سایه‌ی رنگی */}
        <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1.5 z-10">
          {product.isNew && (
            <span className="flex items-center gap-1 bg-lagoon/90 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg shadow-lagoon/30">
              ✦ جدید
            </span>
          )}
          {product.isBestseller && (
            <span className="flex items-center gap-1 bg-amber/90 backdrop-blur-sm text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-lg shadow-amber/30">
              🔥 پرفروش
            </span>
          )}
        </div>

        {/* نشان تخفیف — چپ‌بالا، پررنگ‌تر از بقیه چون مهم‌ترین محرک خریده */}
        {discount > 0 && !outOfStock && (
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="bg-ember text-white text-xs font-extrabold px-2.5 py-1 rounded-full shadow-lg shadow-ember/40">
              ٪{discount.toLocaleString('fa-IR')}−
            </span>
          </div>
        )}

        {outOfStock && (
          <div className="absolute inset-0 bg-night/50 backdrop-blur-[2px] flex items-center justify-center z-10">
            <span className="bg-night/85 border border-line text-ink text-xs font-bold px-4 py-2 rounded-full">
              ناموجود
            </span>
          </div>
        )}
      </div>

      <div className="relative p-3.5 flex flex-col gap-1.5 flex-1">
        <span className="text-[11px] text-ash-dark tracking-wide">{product.brand}</span>
        <h3 className="text-sm text-ink leading-6 line-clamp-2 flex-1 group-hover:text-grape-light transition-colors">
          {product.name}
        </h3>

        {product.reviewCount > 0 && (
          <div className="flex items-center gap-1.5">
            <StarRating rating={product.rating} size="text-[11px]" />
            <span className="text-[10px] text-ash-dark">({product.reviewCount.toLocaleString('fa-IR')})</span>
          </div>
        )}

        <div className="flex flex-col mt-1.5 pt-2.5 border-t border-line/60 font-mono">
          {product.oldPrice > product.price && (
            <span className="text-[11px] text-ash-dark line-through">{formatPrice(product.oldPrice)}</span>
          )}
          <span className="text-ink font-bold text-[15px]">{formatPrice(product.price)}</span>
        </div>
      </div>
    </Link>
  );
}
