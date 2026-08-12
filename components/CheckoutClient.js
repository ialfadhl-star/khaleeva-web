'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Photo from './Photo';
import { useCart } from './CartContext';
import { formatIDR } from '../lib/whatsapp';

export default function CheckoutClient({ settings }) {
  const { items, subtotal, clear, loaded } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({ customerName: '', phone: '', address: '', city: '', notes: '' });
  const [shippingMethod, setShippingMethod] = useState('reguler');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const reguler = Number(settings.shipping_reguler_cost || 0);
  const instant = Number(settings.shipping_instant_cost || 0);
  const freeMin = Number(settings.free_shipping_min || 0);
  const qualifiesFree = freeMin > 0 && subtotal >= freeMin;

  const shippingCost =
    shippingMethod === 'instant' ? instant : qualifiesFree ? 0 : reguler;
  const total = subtotal + shippingCost;

  function updateField(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.customerName || !form.phone || !form.address || !form.city) {
      setError('Lengkapi semua data penerima ya.');
      return;
    }
    if (items.length === 0) {
      setError('Keranjang kamu kosong.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          shippingMethod: shippingMethod === 'instant' ? 'Instant / Same-day' : 'Reguler (JNE/J&T)',
          shippingCost,
          items: items.map((it) => ({
            productId: it.productId,
            name: it.name,
            color: it.color,
            size: it.size,
            qty: it.qty,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal membuat pesanan.');
        setSubmitting(false);
        return;
      }
      clear();
      router.push(`/pesanan-berhasil?order=${data.order.orderNumber}`);
    } catch (err) {
      setError('Terjadi kesalahan jaringan, coba lagi.');
      setSubmitting(false);
    }
  }

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <div className="empty-state">
        Keranjang kamu kosong, belum ada yang bisa di-checkout.
        <div style={{ marginTop: 16 }}>
          <Link href="/katalog" className="btn primary">Mulai Belanja</Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="checkout-steps">
        <b>① Info Pengiriman</b>&nbsp;&rarr;&nbsp;<span>② Pengiriman</span>&nbsp;&rarr;&nbsp;<span>③ Kirim Pesanan</span>
      </div>

      <div className="checkout-wrap">
        <div>
          <div className="form-card">
            <h5>Data Penerima</h5>
            <div className="field-row">
              <input placeholder="Nama Lengkap" value={form.customerName} onChange={(e) => updateField('customerName', e.target.value)} required />
              <input placeholder="No. WhatsApp" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} required />
            </div>
            <input placeholder="Alamat Lengkap" value={form.address} onChange={(e) => updateField('address', e.target.value)} required />
            <input placeholder="Kota" value={form.city} onChange={(e) => updateField('city', e.target.value)} required />
            <textarea rows={2} placeholder="Catatan untuk kurir (opsional)" value={form.notes} onChange={(e) => updateField('notes', e.target.value)} />
          </div>

          <div className="form-card">
            <h5>Metode Pengiriman</h5>
            <div className={`radio-row ${shippingMethod === 'reguler' ? 'sel' : ''}`} onClick={() => setShippingMethod('reguler')}>
              <span>Reguler (JNE/J&amp;T) — 2&ndash;4 hari</span>
              <span>{qualifiesFree ? 'Gratis' : formatIDR(reguler)}</span>
            </div>
            <div className={`radio-row ${shippingMethod === 'instant' ? 'sel' : ''}`} onClick={() => setShippingMethod('instant')}>
              <span>Instant / Same-day (Jabodetabek)</span>
              <span>{formatIDR(instant)}</span>
            </div>
            {qualifiesFree && (
              <div className="hint-text">Kamu dapat gratis ongkir reguler karena belanja di atas {formatIDR(freeMin)} 🎉</div>
            )}
          </div>

          <div className="form-card">
            <h5>Pembayaran</h5>
            <p style={{ fontSize: 12.5, color: 'var(--taupe)', lineHeight: 1.9, margin: 0 }}>
              Setelah klik &ldquo;Kirim Pesanan ke WhatsApp&rdquo;, kamu akan diarahkan ke chat WhatsApp
              admin Khaleeva dengan ringkasan pesanan otomatis terisi. Info rekening / cara bayar akan
              dikirim admin lewat chat tersebut.
            </p>
          </div>
        </div>

        <div className="summary">
          <h3 className="serif">Ringkasan Pesanan</h3>
          {items.map((it, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 12, fontSize: 12.5 }}>
              <Photo tone={it.tone} image={it.image} style={{ width: 48, height: 48, flex: 'none' }} />
              <div style={{ flex: 1 }}>
                {it.name}
                <br />
                <span style={{ color: 'var(--taupe)' }}>
                  {[it.color, it.size].filter(Boolean).join(', ')} · Qty {it.qty}
                </span>
              </div>
              <span>{formatIDR(it.price * it.qty)}</span>
            </div>
          ))}
          <div className="sum-row"><span>Subtotal</span><span>{formatIDR(subtotal)}</span></div>
          <div className="sum-row"><span>Ongkir</span><span>{shippingCost === 0 ? 'Gratis' : formatIDR(shippingCost)}</span></div>
          <div className="sum-row total"><span>Total</span><span>{formatIDR(total)}</span></div>
          {error && <div className="error-text">{error}</div>}
          <button type="submit" className="btn primary block" style={{ marginTop: 18 }} disabled={submitting}>
            {submitting ? 'Memproses...' : 'Kirim Pesanan ke WhatsApp'}
          </button>
        </div>
      </div>
    </form>
  );
}
