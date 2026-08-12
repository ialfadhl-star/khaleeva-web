'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from './CartContext';
import { formatIDR } from './ProductCard';

const TABS = [
  { key: 'desc', label: 'Deskripsi' },
  { key: 'material', label: 'Bahan & Perawatan' },
  { key: 'size', label: 'Panduan Ukuran' },
];

export default function ProductDetailClient({ product }) {
  const { addItem } = useCart();
  const router = useRouter();
  const [color, setColor] = useState(product.colors[0] || '');
  const [size, setSize] = useState(product.sizes[0] || '');
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState('desc');
  const [added, setAdded] = useState(false);

  const outOfStock = product.stock <= 0;

  function handleAdd() {
    if (outOfStock) return;
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      color,
      size,
      qty,
      tone: product.tone,
      image: product.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  function handleBuyNow() {
    handleAdd();
    router.push('/keranjang');
  }

  return (
    <>
      <div className="pdp-info">
        <span className="eyebrow">{product.category}</span>
        <h1 className="serif">{product.name}</h1>
        <div className="stars">
          &#9733;&#9733;&#9733;&#9733;&#9733; <span style={{ color: 'var(--taupe)', fontSize: 12 }}>(produk baru)</span>
        </div>
        <div className="price">{formatIDR(product.price)}</div>

        {product.colors.length > 0 && (
          <>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Warna — {color}</div>
            <div className="swatches">
              {product.colors.map((c) => (
                <button
                  type="button"
                  key={c}
                  className={`swatch ${color === c ? 'sel' : ''}`}
                  onClick={() => setColor(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </>
        )}

        {product.sizes.length > 0 && (
          <>
            <div className="eyebrow" style={{ marginBottom: 8 }}>Ukuran — {size}</div>
            <div className="size-pick">
              {product.sizes.map((s) => (
                <span key={s} className={size === s ? 'sel' : ''} onClick={() => setSize(s)}>
                  {s}
                </span>
              ))}
            </div>
          </>
        )}

        <div className="qty-add">
          <div className="qty">
            <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <span>{qty}</span>
            <button type="button" onClick={() => setQty((q) => q + 1)}>+</button>
          </div>
          <button
            type="button"
            className="btn primary"
            style={{ flex: 1 }}
            onClick={handleAdd}
            disabled={outOfStock}
          >
            {outOfStock ? 'Stok Habis' : added ? 'Ditambahkan ✓' : 'Tambah ke Keranjang'}
          </button>
        </div>
        <button
          type="button"
          className="btn block"
          style={{ marginTop: 12 }}
          onClick={handleBuyNow}
          disabled={outOfStock}
        >
          Beli Sekarang
        </button>

        <div className="pdp-perks">
          &#10003; Bahan premium, original Khaleeva{'\n'}
          &#10003; Stok tersedia: {product.stock} pcs{'\n'}
          &#10003; Bergaransi tukar ukuran 3 hari (syarat berlaku)
        </div>
      </div>

      <div className="tabs" style={{ gridColumn: '1 / -1', marginTop: 0 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-content" style={{ gridColumn: '1 / -1' }}>
        {tab === 'desc' && (product.description || 'Belum ada deskripsi untuk produk ini.')}
        {tab === 'material' && (product.material || 'Belum ada informasi bahan & perawatan.')}
        {tab === 'size' && (product.sizeGuide || 'Belum ada panduan ukuran.')}
      </div>
    </>
  );
}
