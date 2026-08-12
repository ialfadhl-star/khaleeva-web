import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../lib/requireAdmin';
import { getProductById, updateProduct, deleteProduct } from '../../../../../lib/products';

export async function GET(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PUT(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const data = await request.json();
  const product = updateProduct(id, data);
  if (!product) return NextResponse.json({ error: 'Produk tidak ditemukan.' }, { status: 404 });
  return NextResponse.json({ product });
}

export async function DELETE(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  deleteProduct(id);
  return NextResponse.json({ ok: true });
}
