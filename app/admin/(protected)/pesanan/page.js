import Link from 'next/link';
import { listOrders } from '../../../../lib/orders';
import { formatIDR } from '../../../../lib/whatsapp';

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

export default function AdminOrdersPage() {
  const orders = listOrders();

  return (
    <>
      <div className="admin-topbar">
        <h1 className="serif">Pesanan</h1>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>No. Pesanan</th>
            <th>Pelanggan</th>
            <th>No. HP</th>
            <th>Total</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.orderNumber}</td>
              <td>{o.customerName}</td>
              <td>{o.phone}</td>
              <td>{formatIDR(o.total)}</td>
              <td><span className={`badge ${statusClass(o.status)}`}>{o.status}</span></td>
              <td>{new Date(o.createdAt).toLocaleDateString('id-ID')}</td>
              <td><Link href={`/admin/pesanan/${o.id}`} className="btn sm">Kelola</Link></td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--taupe)', padding: 24 }}>Belum ada pesanan.</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}
