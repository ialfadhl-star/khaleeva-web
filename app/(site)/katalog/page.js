import { Suspense } from 'react';
import Link from 'next/link';
import ProductCard from '../../../components/ProductCard';
import SortSelect from '../../../components/SortSelect';
import { listProducts, listCategories } from '../../../lib/products';

export const metadata = { title: 'Katalog — Khaleeva' };

export default async function KatalogPage({ searchParams }) {
  const sp = await searchParams;
  const activeCategory = sp?.kategori || '';
  const sort = sp?.sort || 'terbaru';

  let products = listProducts({ activeOnly: true, category: activeCategory || null });

  if (sort === 'harga-rendah') products = [...products].sort((a, b) => a.price - b.price);
  else if (sort === 'harga-tinggi') products = [...products].sort((a, b) => b.price - a.price);

  const categories = listCategories();

  return (
    <>
      <div className="crumb">Beranda / <b>Katalog</b></div>
      <div className="catalog-wrap">
        <div className="filter">
          <h5>Kategori</h5>
          <div style={{ marginBottom: 6 }}>
            <Link
              href="/katalog"
              style={{ fontWeight: activeCategory ? 300 : 500, color: activeCategory ? 'inherit' : 'var(--maroon)' }}
            >
              Semua Produk
            </Link>
          </div>
          {categories.map((c) => (
            <div key={c} style={{ marginBottom: 6, fontSize: 13 }}>
              <Link
                href={`/katalog?kategori=${encodeURIComponent(c)}`}
                style={{ color: activeCategory === c ? 'var(--maroon)' : 'inherit', fontWeight: activeCategory === c ? 500 : 300 }}
              >
                {c}
              </Link>
            </div>
          ))}
        </div>

        <div>
          <div className="catalog-top">
            <span>Menampilkan {products.length} produk{activeCategory ? ` — ${activeCategory}` : ''}</span>
            <Suspense fallback={null}>
              <SortSelect />
            </Suspense>
          </div>
          {products.length === 0 ? (
            <div className="empty-state">Belum ada produk di kategori ini.</div>
          ) : (
            <div className="grid g4">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
