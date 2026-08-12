import Link from 'next/link';
import { listProducts } from '../../../../lib/products';
import { formatIDR } from '../../../../lib/whatsapp';
import DeleteProductButton from '../../../../components/DeleteProductButton';

export default function AdminProductsPage() {
  const products = listProducts();

  return (
    <>
      <div className="admin-topbar">
        <h1 className="serif">Produk</h1>
        <Link href="/admin/produk/baru" className="btn primary sm">+ Tambah Produk</Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th></th>
            <th>Nama</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: p.image
                      ? `url(${p.image}) center/cover`
                      : `linear-gradient(135deg, var(--c${p.tone.slice(1)}a, #ccc), var(--c${p.tone.slice(1)}b, #999))`,
                  }}
                />
              </td>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{formatIDR(p.price)}</td>
              <td style={{ color: p.stock <= 3 ? '#a33' : 'inherit' }}>{p.stock}</td>
              <td>
                <span className={`badge ${p.active ? 'done' : 'cancelled'}`}>{p.active ? 'Aktif' : 'Nonaktif'}</span>
              </td>
              <td style={{ display: 'flex', gap: 8 }}>
                <Link href={`/admin/produk/${p.id}`} className="btn sm">Edit</Link>
                <DeleteProductButton id={p.id} name={p.name} />
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr><td colSpan={7} style={{ textAlign: 'center', color: 'var(--taupe)', padding: 24 }}>Belum ada produk.</td></tr>
          )}
        </tbody>
      </table>
    </>
  );
}
