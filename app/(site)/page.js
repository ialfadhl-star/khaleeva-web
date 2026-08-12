import Link from 'next/link';
import Photo from '../../components/Photo';
import ProductCard from '../../components/ProductCard';
import { listFeatured } from '../../lib/products';

export default function HomePage() {
  const featured = listFeatured(4);

  return (
    <>
      <Photo tone="t3" style={{ height: '78vh' }}>
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', color: '#fff' }}>
          <span className="eyebrow" style={{ color: '#f0d9cf' }}>Koleksi Baru — Ashwa Series</span>
          <h1 className="serif" style={{ fontSize: 44, margin: '0 0 6px', textShadow: '0 2px 12px rgba(0,0,0,.25)' }}>
            Effortless. Elegant. Modest.
          </h1>
          <p style={{ margin: '0 0 26px', fontSize: 14 }}>Made for every step on your journey.</p>
          <Link href="/katalog" className="btn primary">Belanja Sekarang</Link>
        </div>
      </Photo>

      <section className="center">
        <span className="eyebrow">Belanja per Kategori</span>
        <h2 className="serif" style={{ fontSize: 30, margin: '0 0 34px' }}>Temukan Gaya Modest-mu</h2>
        <div className="grid g3">
          <Link href="/katalog?kategori=Abaya" className="card">
            <Photo tone="t5" style={{ height: 300 }} />
            <h4 style={{ marginTop: 14 }}>Abaya</h4>
          </Link>
          <Link href="/katalog?kategori=Hijab+%26+Pashmina" className="card">
            <Photo tone="t4" style={{ height: 300 }} />
            <h4 style={{ marginTop: 14 }}>Hijab &amp; Pashmina</h4>
          </Link>
          <Link href="/katalog?kategori=Aksesoris" className="card">
            <Photo tone="t2" style={{ height: 300 }} />
            <h4 style={{ marginTop: 14 }}>Aksesoris</h4>
          </Link>
        </div>
      </section>

      {featured.length > 0 && (
        <section style={{ background: 'var(--cream-2)' }}>
          <div className="center" style={{ marginBottom: 36 }}>
            <span className="eyebrow">Terlaris Minggu Ini</span>
            <h2 className="serif" style={{ fontSize: 30, margin: 0 }}>Produk Favorit</h2>
          </div>
          <div className="grid g4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="center" style={{ marginTop: 40 }}>
            <Link href="/katalog" className="btn">Lihat Semua Produk</Link>
          </div>
        </section>
      )}

      <section className="grid g2" style={{ alignItems: 'center', gap: 60 }}>
        <Photo tone="t5" style={{ height: 380 }} />
        <div>
          <span className="eyebrow">Tentang Khaleeva</span>
          <h2 className="serif" style={{ fontSize: 30, margin: '0 0 18px' }}>Menemani Setiap Langkah Perjalananmu</h2>
          <p style={{ fontSize: 14, lineHeight: 2, color: '#5b4d3d', margin: '0 0 26px' }}>
            Khaleeva hadir untuk perempuan yang ingin tampil effortless namun tetap elegan dan modest —
            dari rutinitas harian hingga momen istimewa. Dibuat dari bahan premium linen pilihan,
            dijahit dengan detail yang diperhatikan.
          </p>
          <Link href="/tentang" className="btn">Baca Kisah Kami</Link>
        </div>
      </section>

      <div className="quote-block">
        <span className="eyebrow">Daily Motivation</span>
        <p>&ldquo;Tak perlu membandingkan perjalananmu dengan orang lain — Allah memiliki waktu terbaik untuk setiap hamba-Nya.&rdquo;</p>
        <span style={{ fontSize: 12, color: 'var(--taupe)' }}>@khaleeva.id</span>
      </div>

      <section style={{ background: 'var(--cream-2)' }}>
        <div className="center" style={{ marginBottom: 36 }}>
          <span className="eyebrow">Testimoni</span>
          <h2 className="serif" style={{ fontSize: 28, margin: 0 }}>Kata Mereka</h2>
        </div>
        <div className="grid g3">
          {[
            ['Bahannya adem dan jatuhnya bagus, ga panas dipakai seharian.', 'Nadia R.'],
            ['Warnanya persis kaya di foto, packagingnya juga rapi banget.', 'Salma A.'],
            ['Potongan abaya-nya elegan, cocok buat acara formal maupun harian.', 'Dinda P.'],
          ].map(([quote, name]) => (
            <div key={name}>
              <div className="stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p style={{ fontSize: 13.5, color: '#5b4d3d', lineHeight: 1.9 }}>&ldquo;{quote}&rdquo;</p>
              <span className="eyebrow" style={{ margin: 0 }}>— {name}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
