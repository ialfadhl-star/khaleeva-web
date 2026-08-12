import Link from 'next/link';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="grid">
        <div>
          <div className="logo">KHALEEVA</div>
          <p style={{ marginTop: 14, maxWidth: 240 }}>
            Modest wear premium untuk setiap langkah perjalananmu. South Jakarta, Indonesia.
          </p>
        </div>
        <div>
          <h5>Belanja</h5>
          <p>
            <Link href="/katalog?kategori=Abaya">Abaya</Link>
            <br />
            <Link href="/katalog?kategori=Hijab+%26+Pashmina">Hijab &amp; Pashmina</Link>
            <br />
            <Link href="/katalog?kategori=Aksesoris">Aksesoris</Link>
          </p>
        </div>
        <div>
          <h5>Bantuan</h5>
          <p>
            <Link href="/kontak">FAQ</Link>
            <br />
            <Link href="/kontak">Kontak Kami</Link>
            <br />
            Pengiriman &amp; Retur
          </p>
        </div>
        <div>
          <h5>Ikuti Kami</h5>
          <p>Instagram — @khaleeva.id</p>
        </div>
      </div>
      <div className="bottom">
        <span>© {year} Khaleeva.id — All rights reserved.</span>
        <span>Transfer Bank · QRIS · E-Wallet</span>
      </div>
    </footer>
  );
}
