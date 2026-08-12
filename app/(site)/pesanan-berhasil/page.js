import Link from 'next/link';
import { getOrderByNumber } from '../../../lib/orders';
import { getSetting } from '../../../lib/settings';
import { buildOrderWaMessage, buildWaLink, formatIDR } from '../../../lib/whatsapp';

export const metadata = { title: 'Pesanan Diterima — Khaleeva' };

export default async function OrderSuccessPage({ searchParams }) {
  const sp = await searchParams;
  const orderNumber = sp?.order;
  const order = orderNumber ? getOrderByNumber(orderNumber) : null;

  if (!order) {
    return (
      <div className="confirm">
        <h1 className="serif" style={{ fontSize: 26 }}>Pesanan tidak ditemukan</h1>
        <p style={{ color: 'var(--taupe)' }}>Nomor pesanan tidak valid atau sudah kedaluwarsa.</p>
        <Link href="/katalog" className="btn primary" style={{ marginTop: 20, display: 'inline-block' }}>
          Kembali Belanja
        </Link>
      </div>
    );
  }

  const waNumber = getSetting('whatsapp_number');
  const waLink = buildWaLink(waNumber, buildOrderWaMessage(order));
  const bankName = getSetting('bank_name');
  const bankAccountNumber = getSetting('bank_account_number');
  const bankAccountHolder = getSetting('bank_account_holder');

  return (
    <div className="confirm">
      <div className="check-circle">&#10003;</div>
      <h1 className="serif" style={{ fontSize: 28, margin: '0 0 10px' }}>Pesanan Kamu Diterima!</h1>
      <p style={{ color: 'var(--taupe)', fontSize: 13.5 }}>
        Satu langkah lagi — kirim ringkasan pesanan ini ke WhatsApp admin Khaleeva supaya bisa segera diproses.
      </p>

      <div className="order-box">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>No. Pesanan</span><b>{order.orderNumber}</b>
        </div>
        {order.items.map((it, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
            <span>{it.name} x{it.qty}</span><span>{formatIDR(it.price * it.qty)}</span>
          </div>
        ))}
        <hr style={{ border: 'none', borderTop: '1px solid var(--taupe-line)', margin: '10px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Ongkir ({order.shippingMethod})</span><span>{formatIDR(order.shippingCost)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
          <span>Total</span><span>{formatIDR(order.total)}</span>
        </div>
      </div>

      <div className="order-box" style={{ marginTop: 18 }}>
        <div style={{ fontWeight: 600, marginBottom: 4 }}>Transfer Pembayaran</div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Bank</span><b>{bankName}</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>No. Rekening</span><b>{bankAccountNumber}</b>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Atas Nama</span><b>{bankAccountHolder}</b>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--taupe-line)', margin: '10px 0' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
          <span>Total yang Ditransfer</span><span>{formatIDR(order.total)}</span>
        </div>
      </div>

      <p style={{ color: 'var(--taupe)', fontSize: 13.5, maxWidth: 460, margin: '18px auto 0' }}>
        Segera konfirmasi dan kirim bukti pembayaran melalui WhatsApp ya, biar pesanan kamu langsung diproses.
      </p>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 20, flexWrap: 'wrap' }}>
        <Link href="/katalog" className="btn">Lanjut Belanja</Link>
        <a href={waLink} target="_blank" rel="noreferrer" className="btn primary">
          Kirim Bukti Pembayaran ke WhatsApp &rarr;
        </a>
      </div>
    </div>
  );
}
