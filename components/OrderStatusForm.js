'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { buildResiWaMessage, buildWaLink } from '../lib/whatsapp';

const STATUSES = ['Menunggu Konfirmasi', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];

export default function OrderStatusForm({ order, waNumber }) {
  const router = useRouter();
  const [status, setStatus] = useState(order.status);
  const [resi, setResi] = useState(order.resi || '');
  const [courier, setCourier] = useState(order.courier || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await fetch(`/api/admin/orders/${order.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, resi, courier }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  const waLink = resi ? buildWaLink(waNumber, buildResiWaMessage({ ...order, status, resi, courier })) : null;

  return (
    <div className="form-card">
      <h5>Status &amp; Pengiriman</h5>
      <label className="field-label">Status Pesanan</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      <div className="field-row">
        <div>
          <label className="field-label">Kurir</label>
          <input value={courier} onChange={(e) => setCourier(e.target.value)} placeholder="JNE / J&amp;T / SiCepat" />
        </div>
        <div>
          <label className="field-label">No. Resi</label>
          <input value={resi} onChange={(e) => setResi(e.target.value)} placeholder="Nomor resi" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="button" className="btn primary" onClick={handleSave} disabled={saving}>
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
        {waLink && (
          <a href={waLink} target="_blank" rel="noreferrer" className="btn sm">
            Kirim Resi ke WhatsApp Pelanggan
          </a>
        )}
      </div>
      {saved && <div className="hint-text" style={{ marginTop: 10 }}>Tersimpan.</div>}
    </div>
  );
}
