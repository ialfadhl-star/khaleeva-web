'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsForm({ initial }) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 520 }}>
      <div className="form-card">
        <h5>Kontak &amp; Domain</h5>
        <label className="field-label">Nomor WhatsApp CS (format 62xxx, tanpa +/spasi)</label>
        <input value={form.whatsapp_number} onChange={(e) => update('whatsapp_number', e.target.value)} />
        <label className="field-label">Domain Website</label>
        <input value={form.site_domain} onChange={(e) => update('site_domain', e.target.value)} />
        <label className="field-label">Teks Pengumuman (bar atas)</label>
        <input value={form.announcement} onChange={(e) => update('announcement', e.target.value)} />
      </div>

      <div className="form-card">
        <h5>Rekening Bank</h5>
        <div className="field-row">
          <div>
            <label className="field-label">Nama Bank</label>
            <input value={form.bank_name} onChange={(e) => update('bank_name', e.target.value)} />
          </div>
          <div>
            <label className="field-label">No. Rekening</label>
            <input value={form.bank_account_number} onChange={(e) => update('bank_account_number', e.target.value)} />
          </div>
        </div>
        <label className="field-label">Atas Nama</label>
        <input value={form.bank_account_holder} onChange={(e) => update('bank_account_holder', e.target.value)} />
        <div className="hint-text">
          Info rekening ini ditampilkan di halaman pesanan berhasil supaya pembeli bisa langsung transfer.
        </div>
      </div>

      <div className="form-card">
        <h5>Ongkos Kirim</h5>
        <div className="field-row">
          <div>
            <label className="field-label">Reguler (Rp)</label>
            <input type="number" value={form.shipping_reguler_cost} onChange={(e) => update('shipping_reguler_cost', e.target.value)} />
          </div>
          <div>
            <label className="field-label">Instant (Rp)</label>
            <input type="number" value={form.shipping_instant_cost} onChange={(e) => update('shipping_instant_cost', e.target.value)} />
          </div>
        </div>
        <label className="field-label">Minimal Belanja Gratis Ongkir Reguler (Rp, 0 = nonaktif)</label>
        <input type="number" value={form.free_shipping_min} onChange={(e) => update('free_shipping_min', e.target.value)} />
        <div className="hint-text">
          Estimasi ongkir masih flat per metode (bukan hitung otomatis per kota). Upgrade ke API cek
          ongkir real-time (Biteship/RajaOngkir) bisa dilakukan di fase berikutnya.
        </div>
      </div>

      <button type="submit" className="btn primary" disabled={saving}>
        {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </button>
      {saved && <span className="hint-text" style={{ marginLeft: 12 }}>Tersimpan.</span>}
    </form>
  );
}
