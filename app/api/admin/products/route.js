import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/requireAdmin';
import { listProducts, createProduct } from '../../../../lib/products';

export async function GET(request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ products: listProducts() });
}

export async function POST(request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const data = await request.json();
  if (!data.name || !data.category || data.price === undefined) {
    return NextResponse.json({ error: 'Nama, kategori, dan harga wajib diisi.' }, { status: 400 });
  }
  const product = createProduct(data);
  return NextResponse.json({ product });
}
