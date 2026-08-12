import Link from 'next/link';
import { listProducts } from '../../../lib/products';
import { listOrders } from '../../../lib/orders';
import { formatIDR } from '../../../lib/whatsapp';

function statusClass(status) {
  const map = {
    'Menunggu Konfirmasi': 'pending',
    Diproses: 'processing',
    Dikirim: 'shipped',
    Selesai: 'done',
    Dibatalkan: 'cancelled',
  };
  return map[status] || 'pending';
}

export default function AdminDashboard() {
  const products = listProducts();
  const orders = listOrders();
  const pending = orders.filter((o) => o.status === 'Menunggu Konfirmasi').length;
  const revenue = orders
    .filter((o) => o.status !== 'Dibatalkan')
    .reduce((s, o) => s + o.total, 0);
  const lowStock = products.filter((p) => p.stock <= 3).length;

  return (
    <>
      <div className="admin-topbar">
        <h1 className="serif">Dashboard</h1>
      </div>

      <div className="stat-cards">
        <div className="stat-card"><div className="num">{products.length}</div><div className="label">Total Produk</div></div>
        <div className="stat-card"><div className="num">{orders.length}</div><div className="label">Total Pesanan</div></div>
        <div className="stat-card"><div className="num">{pending}</div><div className="label">Menunggu Konfirmasi</div></div>
        <div className="stat-card"><div className="num">{formatIDR(revenue)}</div><div className="label">Total Omzet</div></div>
      </div>

      {lowStock > 0 && (
        <div className="hint-text" style={{ marginBottom: 20 }}>
          ⚠ {lowStock} produk stoknya tersisa 3 atau kurang — cek halaman{' '}
          <Link href="/admin/produk" style={{ color: 'var(--maroon)' }}>Produk</Link>.
        </div>
      )}

      <h3 className="serif" style={{ fontSize: 18, margin: '20px 0 12px' }}>Pesanan Terbaru</h3>
      <table className="admin-table">
        <thead>
          <tr>
            <th>No. Pesanan</th>
            <th>Pelanggan</th>
            <th>Total</th>
            <th>Status</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {orders.slice(0, 8).map((o) => (
            <tr key={o.id}>
              <td><Link href={`/admin/pesanan/${o.id}`} style={{ color: 'var(--maroon)' }}>{o.orderNumber}</Link></td>
              <td>{o.customerName}</td>
              <td>{formatIDR(o.total)}</td>
              <td><span className={`badge ${statusClass(o.status)}`}>{o.status}</span></td>
              <td>{new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--taupe)', padding: 24 }}>Belum ada pesanan.</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}
