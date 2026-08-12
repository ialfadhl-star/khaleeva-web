'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteProductButton({ id, name }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function handleDelete() {
    if (!window.confirm(`Hapus produk "${name}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setBusy(true);
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  return (
    <button type="button" className="btn sm danger" onClick={handleDelete} disabled={busy}>
      {busy ? '...' : 'Hapus'}
    </button>
  );
}
