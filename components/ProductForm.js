'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CATEGORIES = ['Abaya', 'Hijab & Pashmina', 'Aksesoris'];
const TONES = ['t1', 't2', 't3', 't4', 't5'];

export default function ProductForm({ initial }) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    name: initial?.name || '',
    category: initial?.category || CATEGORIES[0],
    price: initial?.price || '',
    stock: initial?.stock ?? 0,
    colors: initial?.colors?.join(', ') || '',
    sizes: initial?.sizes?.join(', ') || '',
    description: initial?.description || '',
    material: initial?.material || '',
    sizeGuide: initial?.sizeGuide || '',
    image: initial?.image || '',
    tone: initial?.tone || 't1',
    featured: initial?.featured || false,
    active: initial?.active ?? true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal upload foto.');
      } else {
        update('image', data.url);
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
    try {
      const res = await fetch(isEdit ? `/api/admin/products/${initial.id}` : '/api/admin/products', {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal menyimpan produk.');
        setSaving(false);
        return;
      }
      router.push('/admin/produk');
      router.refresh();
    } catch {
      setError('Terjadi kesalahan jaringan.');
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 640 }}>
      <div className="form-card">
        <h5>Informasi Dasar</h5>
        <label className="field-label">Nama Produk</label>
        <input value={form.name} onChange={(e) => update('name', e.target.value)} required />

        <div className="field-row">
          <div>
            <label className="field-label">Kategori</label>
            <select value={form.category} onChange={(e) => update('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Harga (Rp)</label>
            <input type="number" min="0" value={form.price} onChange={(e) => update('price', e.target.value)} required />
          </div>
        </div>

        <div className="field-row">
          <div>
            <label className="field-label">Stok</label>
            <input type="number" min="0" value={form.stock} onChange={(e) => update('stock', e.target.value)} required />
          </div>
          <div>
            <label className="field-label">Warna Placeholder Foto</label>
            <select value={form.tone} onChange={(e) => update('tone', e.target.value)}>
              {TONES.map((t) => <option key={t} value={t}>{t.toUpperCase()}</option>)}
            </select>
          </div>
        </div>
        <div className="hint-text">Dipakai kalau belum ada foto asli diupload.</div>

        <label className="field-label">Pilihan Warna (pisahkan dengan koma)</label>
        <input value={form.colors} onChange={(e) => update('colors', e.target.value)} placeholder="Coklat Tanah, Maroon, Sage Green" />

        <label className="field-label">Pilihan Ukuran (pisahkan dengan koma)</label>
        <input value={form.sizes} onChange={(e) => update('sizes', e.target.value)} placeholder="S, M, L, XL" />
      </div>

      <div className="form-card">
        <h5>Foto Produk</h5>
        {form.image && (
          <div className="thumb-list"><img src={form.image} alt="" /></div>
        )}
        <label className="upload-box">
          {uploading ? 'Mengupload...' : 'Klik untuk upload foto (JPG/PNG/WEBP, maks 5MB)'}
          <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
        </label>
      </div>

      <div className="form-card">
        <h5>Detail Produk</h5>
        <label className="field-label">Deskripsi</label>
        <textarea rows={3} value={form.description} onChange={(e) => update('description', e.target.value)} />
        <label className="field-label">Bahan &amp; Perawatan</label>
        <textarea rows={2} value={form.material} onChange={(e) => update('material', e.target.value)} />
        <label className="field-label">Panduan Ukuran</label>
        <textarea rows={2} value={form.sizeGuide} onChange={(e) => update('sizeGuide', e.target.value)} />
      </div>

      <div className="form-card">
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, marginBottom: 10 }}>
          <input type="checkbox" checked={form.featured} onChange={(e) => update('featured', e.target.checked)} style={{ width: 'auto', marginBottom: 0 }} />
          Tampilkan di Beranda (produk unggulan)
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <input type="checkbox" checked={form.active} onChange={(e) => update('active', e.target.checked)} style={{ width: 'auto', marginBottom: 0 }} />
          Aktif (tampil di katalog)
        </label>
      </div>

      {error && <div className="error-text">{error}</div>}
      <div style={{ display: 'flex', gap: 10 }}>
        <button type="submit" className="btn primary" disabled={saving || uploading}>
          {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Produk'}
        </button>
        <button type="button" className="btn" onClick={() => router.push('/admin/produk')}>Batal</button>
      </div>
    </form>
  );
}
