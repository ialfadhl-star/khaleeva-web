import { NextResponse } from 'next/server';
import { createOrder } from '../../../lib/orders';
import { getProductById } from '../../../lib/products';

export async function POST(request) {
  const body = await request.json();
  const { customerName, phone, address, city, notes, shippingMethod, shippingCost, items } = body;

  if (!customerName || !phone || !address || !city) {
    return NextResponse.json({ error: 'Lengkapi data penerima terlebih dahulu.' }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: 'Keranjang kosong.' }, { status: 400 });
  }

  // Re-validate price & stock from the database — never trust client-sent prices.
  const safeItems = [];
  for (const it of items) {
    const product = it.productId ? getProductById(it.productId) : null;
    if (!product) {
      return NextResponse.json({ error: `Produk "${it.name}" tidak ditemukan.` }, { status: 400 });
    }
    if (product.stock < it.qty) {
      return NextResponse.json({ error: `Stok "${product.name}" tidak cukup (sisa ${product.stock}).` }, { status: 400 });
    }
    safeItems.push({
      productId: product.id,
      name: product.name,
      color: it.color || '',
      size: it.size || '',
      price: product.price,
      qty: it.qty,
    });
  }

  try {
    const order = createOrder({
      customerName,
      phone,
      address,
      city,
      notes: notes || '',
      shippingMethod: shippingMethod || 'Reguler (JNE/J&T)',
      shippingCost: Number(shippingCost) || 0,
      items: safeItems,
    });
    return NextResponse.json({ order });
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Gagal membuat pesanan.' }, { status: 500 });
  }
}
