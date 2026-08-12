import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../../lib/requireAdmin';
import { getOrderById, updateOrder } from '../../../../../lib/orders';

export async function GET(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
  return NextResponse.json({ order });
}

export async function PUT(request, { params }) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await params;
  const data = await request.json();
  const order = updateOrder(id, data);
  if (!order) return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
  return NextResponse.json({ order });
}
