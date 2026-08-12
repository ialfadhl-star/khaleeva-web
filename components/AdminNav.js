'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/produk', label: 'Produk' },
  { href: '/admin/pesanan', label: 'Pesanan' },
  { href: '/admin/pengaturan', label: 'Pengaturan' },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  }

  return (
    <div className="admin-side">
      <span className="logo">KHALEEVA</span>
      {LINKS.map((l) => {
        const active = l.href === '/admin' ? pathname === '/admin' : pathname.startsWith(l.href);
        return (
          <Link key={l.href} href={l.href} className={active ? 'active' : ''}>
            {l.label}
          </Link>
        );
      })}
      <a onClick={handleLogout} style={{ cursor: 'pointer', marginTop: 20, color: '#e0a89f' }}>
        Keluar
      </a>
    </div>
  );
}
