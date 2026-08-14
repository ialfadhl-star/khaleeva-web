import { notFound } from 'next/navigation';
import Photo from '../../../../components/Photo';
import ProductCard from '../../../../components/ProductCard';
import ProductDetailClient from '../../../../components/ProductDetailClient';
import { getProductBySlug, listProducts } from '../../../../lib/products';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return { title: `${product.name} — Khaleeva` };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const related = listProducts({ activeOnly: true, category: product.category })
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <div className="crumb">
        Beranda / Katalog / {product.category} / <b>{product.name}</b>
      </div>

      <div className="pdp-wrap pdp-wrap--simple">
        <Photo tone={product.tone} image={product.image} className="pdp-main-photo" />
        <ProductDetailClient product={product} />
      </div>

      {related.length > 0 && (
        <section style={{ background: 'var(--cream-2)', marginTop: 40 }}>
          <div className="center" style={{ marginBottom: 30 }}>
            <span className="eyebrow">Kamu Mungkin Juga Suka</span>
          </div>
          <div className="grid g4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
