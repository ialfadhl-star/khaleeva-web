import { NextResponse } from 'next/server';
import { requireAdmin } from '../../../../lib/requireAdmin';
import { getAllSettings, setSettings } from '../../../../lib/settings';

export async function GET(request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  return NextResponse.json({ settings: getAllSettings() });
}

export async function PUT(request) {
  const admin = await requireAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const data = await request.json();
  setSettings(data);
  return NextResponse.json({ settings: getAllSettings() });
}
