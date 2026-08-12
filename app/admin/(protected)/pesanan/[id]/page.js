import { notFound } from 'next/navigation';
import { getOrderById } from '../../../../../lib/orders';
import { getSetting } from '../../../../../lib/settings';
import { formatIDR } from '../../../../../lib/whatsapp';
import OrderStatusForm from '../../../../../components/OrderStatusForm';

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) notFound();
  const waNumber = getSetting('whatsapp_number');

  return (
    <>
      <div className="admin-topbar">
        <h1 className="serif">Pesanan {order.orderNumber}</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, maxWidth: 900 }}>
        <div>
          <div className="form-card">
            <h5>Data Pelanggan</h5>
            <p style={{ fontSize: 13, lineHeight: 2, margin: 0 }}>
              <b>{order.customerName}</b><br />
              {order.phone}<br />
              {order.address}, {order.city}<br />
              {order.notes && <span style={{ color: 'var(--taupe)' }}>Catatan: {order.notes}</span>}
            </p>
          </div>

          <div className="form-card">
            <h5>Item Pesanan</h5>
            {order.items.map((it) => (
              <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid #f0e9da' }}>
                <span>
                  {it.name}
                  {(it.color || it.size) && (
                    <span style={{ color: 'var(--taupe)' }}> ({[it.color, it.size].filter(Boolean).join(', ')})</span>
                  )}
                  {' '}x{it.qty}
                </span>
                <span>{formatIDR(it.price * it.qty)}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginTop: 10 }}>
              <span>Subtotal</span><span>{formatIDR(order.subtotal)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span>Ongkir ({order.shippingMethod})</span><span>{formatIDR(order.shippingCost)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 600, marginTop: 8 }}>
              <span>Total</span><span>{formatIDR(order.total)}</span>
            </div>
          </div>
        </div>

        <OrderStatusForm order={order} waNumber={waNumber} />
      </div>
    </>
  );
}
