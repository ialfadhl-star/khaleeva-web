'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const OPTIONS = [
  { value: 'terbaru', label: 'Terbaru' },
  { value: 'harga-rendah', label: 'Harga Terendah' },
  { value: 'harga-tinggi', label: 'Harga Tertinggi' },
];

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get('sort') || 'terbaru';

  function onChange(e) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('sort', e.target.value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select value={current} onChange={onChange}>
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          Urutkan: {o.label}
        </option>
      ))}
    </select>
  );
}
