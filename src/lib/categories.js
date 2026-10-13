// ============================================================
// تاکسونومی دسته‌بندی‌ها
// ------------------------------------------------------------
// توی بک‌اند، Product.category صرفاً یه رشته‌ی آزاده (نه رفرنس
// به یه مدل Category جدا) — طبق نمونه‌ی پنل ادمین، مقداری مثل
// 'gpu' توش ذخیره میشه. پس این فایل تنها منبع مرجع نگاشت
// slug ها به برچسب فارسی، آیکون، و گروه‌بندیه، و همه‌جای فرانت
// (مگامنو، فوتر، فیلتر محصولات، متادیتای صفحه‌ی دسته) از همینجا
// می‌خونن. اگه بعداً خواستید یه دسته اضافه/حذف کنید، فقط همینجا
// رو ویرایش کنید — چیزی توی بک‌اند لازم نیست عوض بشه.
//
// ⚠️ نکته: چون category توی بک‌اند آزاده (نه enum)، وقتی محصول
// جدید توی پنل ادمین ثبت می‌کنید، دقیقاً همین مقادیر slug (ستون
// value پایین) رو توی فیلد «دسته‌بندی» وارد کنید تا محصول درست
// زیر همون دسته توی فروشگاه نمایش داده بشه.
// ============================================================

export const CATEGORY_GROUPS = [
  {
    label: 'قطعات کامپیوتر',
    items: [
      { slug: 'gpu', label: 'کارت گرافیک', icon: '🎮' },
      { slug: 'cpu', label: 'پردازنده (CPU)', icon: '🧠' },
      { slug: 'motherboard', label: 'مادربرد', icon: '🔌' },
      { slug: 'ram', label: 'رم', icon: '💾' },
      { slug: 'storage', label: 'هارد و SSD', icon: '💿' },
      { slug: 'psu', label: 'منبع تغذیه', icon: '🔋' },
      { slug: 'case', label: 'کیس', icon: '🖥️' },
      { slug: 'cooling', label: 'خنک‌کننده و فن', icon: '❄️' },
    ],
  },
  {
    label: 'جانبی کامپیوتر',
    items: [
      { slug: 'monitor', label: 'مانیتور', icon: '🖥️' },
      { slug: 'keyboard', label: 'کیبورد', icon: '⌨️' },
      { slug: 'mouse', label: 'ماوس', icon: '🖱️' },
      { slug: 'audio', label: 'هدست و اسپیکر', icon: '🎧' },
      { slug: 'webcam', label: 'وبکم', icon: '📷' },
      { slug: 'mousepad', label: 'پد ماوس', icon: '▭' },
    ],
  },
  {
    label: 'گجت‌های کاربردی',
    items: [
      { slug: 'hub-adapter', label: 'هاب و تبدیل', icon: '🔗' },
      { slug: 'external-storage', label: 'هارد اکسترنال و فلش', icon: '💽' },
      { slug: 'charger-powerbank', label: 'شارژر و پاوربانک', icon: '🔌' },
      { slug: 'mobile-accessories', label: 'لوازم جانبی موبایل', icon: '📱' },
      { slug: 'smart-gadgets', label: 'گجت هوشمند', icon: '⌚' },
      { slug: 'cables', label: 'کابل و رابط', icon: '🔗' },
    ],
  },
  {
    label: 'لپ‌تاپ و آماده',
    items: [
      { slug: 'laptop', label: 'لپ‌تاپ', icon: '💻' },
      { slug: 'prebuilt-pc', label: 'کامپیوتر آماده', icon: '🖥️' },
    ],
  },
];

/** لیست تخت همه‌ی دسته‌ها (بدون گروه‌بندی) — برای فیلتر و lookup سریع */
export const ALL_CATEGORIES = CATEGORY_GROUPS.flatMap(g => g.items);

/** گرفتن برچسب فارسی از روی slug، با fallback به خود slug اگه پیدا نشد */
export function categoryLabel(slug) {
  return ALL_CATEGORIES.find(c => c.slug === slug)?.label || slug;
}

export function categoryIcon(slug) {
  return ALL_CATEGORIES.find(c => c.slug === slug)?.icon || '📦';
}
