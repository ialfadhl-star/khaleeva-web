import Link from 'next/link';
import Photo from '../../../components/Photo';

export const metadata = { title: 'Tentang Kami — Khaleeva' };

export default function AboutPage() {
  return (
    <>
      <Photo tone="t5" style={{ height: '55vh' }} />

      <section className="center narrow">
        <span className="eyebrow">Kisah Khaleeva</span>
        <h2 className="serif" style={{ fontSize: 30, margin: '0 0 18px' }}>Menemani Setiap Langkah Perjalananmu</h2>
        <p style={{ fontSize: 14.5, lineHeight: 2.1, color: '#5b4d3d' }}>
          Khaleeva lahir dari keinginan menghadirkan modest wear yang tidak hanya menutup aurat, tapi
          juga membuat pemakainya percaya diri di setiap langkah — effortless untuk dipakai sehari-hari,
          elegan untuk momen istimewa. Setiap koleksi dibuat dari bahan premium pilihan dengan detail
          yang diperhatikan, dari South Jakarta untuk perempuan Indonesia.
        </p>
      </section>

      <section style={{ background: 'var(--cream-2)' }}>
        <div className="grid values">
          <div className="value-card">
            <div className="num">01</div>
            <h3 className="serif" style={{ margin: '10px 0' }}>Effortless</h3>
            <p style={{ fontSize: 13, color: '#5b4d3d' }}>Mudah dipadupadankan untuk aktivitas harian tanpa perlu banyak effort.</p>
          </div>
          <div className="value-card">
            <div className="num">02</div>
            <h3 className="serif" style={{ margin: '10px 0' }}>Elegant</h3>
            <p style={{ fontSize: 13, color: '#5b4d3d' }}>Detail jahitan dan siluet yang membuat tampilanmu tetap berkelas.</p>
          </div>
          <div className="value-card">
            <div className="num">03</div>
            <h3 className="serif" style={{ margin: '10px 0' }}>Modest</h3>
            <p style={{ fontSize: 13, color: '#5b4d3d' }}>Dirancang sesuai prinsip berpakaian syar&apos;i tanpa mengurangi gaya.</p>
          </div>
        </div>
      </section>

      <section className="center">
        <span className="eyebrow">Lookbook</span>
        <div className="grid g4" style={{ marginTop: 24 }}>
          <Photo tone="t1" style={{ height: 240 }} />
          <Photo tone="t2" style={{ height: 240 }} />
          <Photo tone="t3" style={{ height: 240 }} />
          <Photo tone="t4" style={{ height: 240 }} />
        </div>
        <Link href="/katalog" className="btn primary" style={{ marginTop: 34, display: 'inline-block' }}>
          Belanja Koleksi
        </Link>
      </section>
    </>
  );
}
