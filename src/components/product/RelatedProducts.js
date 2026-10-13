import ProductCard from './ProductCard';

export default function RelatedProducts({ products = [] }) {
  if (!products.length) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-bold text-ink mb-4">محصولات مرتبط</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
