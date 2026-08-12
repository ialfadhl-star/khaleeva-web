'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from './CartContext';

const ANNOUNCE_KEY = 'khaleeva_announce_dismissed';

export default function Header({ announcement }) {
  const { count } = useCart();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (announcement && sessionStorage.getItem(ANNOUNCE_KEY) === announcement) {
      setDismissed(true);
    }
  }, [announcement]);

  function dismissAnnounce() {
    sessionStorage.setItem(ANNOUNCE_KEY, announcement);
    setDismissed(true);
  }

  return (
    <>
      {announcement && !dismissed ? (
        <div className="announce">
          {announcement}
          <button type="button" className="announce-close" onClick={dismissAnnounce} aria-label="Tutup pengumuman">
            &times;
          </button>
        </div>
      ) : null}
      <div className="site-header">
        <Link href="/" className="logo">KHALEEVA</Link>
        <nav>
          <Link href="/">Beranda</Link>
          <Link href="/katalog">Katalog</Link>
          <Link href="/tentang">Tentang Kami</Link>
          <Link href="/kontak">Kontak</Link>
        </nav>
        <div className="header-icons">
          <Link href="/keranjang" title="Keranjang">
            <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            <span className="cart-count">{count}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
