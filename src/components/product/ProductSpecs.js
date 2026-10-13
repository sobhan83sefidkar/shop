// جدول مشخصات فنی — عمداً با فونت مونو نمایش داده میشه تا حس
// «برگه‌ی تخصصی/دیتاشیت» بده، متفاوت از فونت معمولی بقیه‌ی صفحه.
// این همون امضای طراحی مخصوص بخش‌های تکنیکال سایته.
export default function ProductSpecs({ specs = [] }) {
  if (!specs.length) return null;

  return (
    <div className="bg-panel border border-line rounded-card overflow-hidden">
      <h2 className="font-bold text-ink p-4 border-b border-line">مشخصات فنی</h2>
      <table className="w-full font-mono text-sm">
        <tbody>
          {specs.map((spec, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-card/40' : ''}>
              <td className="p-3 text-ash w-1/3 align-top">{spec.key}</td>
              <td className="p-3 text-ink">{spec.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
