// کامپوننت نمایش امتیاز ستاره‌ای — فقط نمایشی (نه ورودی)
export default function StarRating({ rating = 0, size = 'text-sm', showValue = false }) {
  return (
    <div className="flex items-center gap-1" dir="ltr">
      <div className={`flex ${size}`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span key={i} className={i < Math.round(rating) ? 'text-amber' : 'text-line'}>★</span>
        ))}
      </div>
      {showValue && <span className="text-xs text-ash">{rating.toFixed(1)}</span>}
    </div>
  );
}
