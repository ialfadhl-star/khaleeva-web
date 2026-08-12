'use client';

import Link from 'next/link';
import Photo from '../../../components/Photo';
import { useCart } from '../../../components/CartContext';
import { formatIDR } from '../../../components/ProductCard';

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, lineKey, loaded } = useCart();

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <div className="cart-empty-wrap">
        <h2 className="serif" style={{ fontSize: 26, margin: '20px 0' }}>
          Keranjang Belanja (0)
        </h2>
        <div className="empty-state">
          Keranjang kamu masih kosong.
          <div style={{ marginTop: 16 }}>
            <Link href="/katalog" className="btn primary">Mulai Belanja</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-wrap">
      <div>
        <h2 className="serif" style={{ fontSize: 26, margin: '20px 0' }}>
          Keranjang Belanja ({items.reduce((s, it) => s + it.qty, 0)})
        </h2>

        {items.map((it) => {
          const key = lineKey(it);
          return (
            <div className="cart-item" key={key}>
              <Photo tone={it.tone} image={it.image} style={{ height: 90 }} />
              <div>
                <h4>{it.name}</h4>
                <div className="meta">
                  {it.color ? `Warna: ${it.color}` : ''}
                  {it.color && it.size ? ' · ' : ''}
                  {it.size ? `Ukuran: ${it.size}` : ''}
                </div>
              </div>
              <button type="button" className="remove" onClick={() => removeItem(key)} aria-label="Hapus dari keranjang" title="Hapus">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                  <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                </svg>
              </button>
              <div className="qty">
                <button type="button" onClick={() => updateQty(key, it.qty - 1)}>−</button>
                <span>{it.qty}</span>
                <button type="button" onClick={() => updateQty(key, it.qty + 1)}>+</button>
              </div>
              <div style={{ textAlign: 'right', fontSize: 14 }}>{formatIDR(it.price * it.qty)}</div>
            </div>
          );
        })}
        <Link href="/katalog" className="btn sm" style={{ marginTop: 24, display: 'inline-block' }}>
          &larr; Lanjut Belanja
        </Link>
      </div>

      <div className="summary">
        <h3 className="serif">Ringkasan Pesanan</h3>
        <div className="sum-row"><span>Subtotal</span><span>{formatIDR(subtotal)}</span></div>
        <div className="sum-row"><span>Estimasi Ongkir</span><span>Dihitung di checkout</span></div>
        <div className="sum-row total"><span>Total</span><span>{formatIDR(subtotal)}</span></div>
        <Link href="/checkout" className="btn primary block" style={{ marginTop: 18 }}>
          Lanjut ke Checkout
        </Link>
      </div>
    </div>
  );
}
