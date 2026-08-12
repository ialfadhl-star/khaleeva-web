// Standalone seed script — run with `npm run seed`.
// Self-contained (doesn't import the Next.js lib/ files) so it can run
// with plain `node scripts/seed.js` without touching Next's bundler.
import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), 'data', 'khaleeva.db');
const SCHEMA_PATH = path.join(process.cwd(), 'lib', 'schema.sql');

const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA foreign_keys = ON;');
db.exec(fs.readFileSync(SCHEMA_PATH, 'utf-8'));

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ---- PENTING: ini semua data CONTOH / PLACEHOLDER ----
// Ganti lewat admin panel (/admin/produk) begitu data asli khaleeva sudah ada.
const PRODUCTS = [
  {
    name: 'Ashwa Abaya — Premium Linen',
    category: 'Abaya',
    price: 549000,
    description:
      'Ashwa Abaya dirancang untuk menemani aktivitasmu sehari-hari maupun momen spesial. Potongan longgar dan effortless, dengan detail kancing kayu serta saku samping tersembunyi.',
    material: '100% premium linen. Cuci dengan tangan atau mesin (mode lembut), air dingin, setrika suhu sedang dari bagian dalam.',
    sizeGuide: 'S: LD 100cm / Panjang 138cm · M: LD 106cm / Panjang 140cm · L: LD 112cm / Panjang 142cm · XL: LD 118cm / Panjang 144cm.',
    colors: 'Coklat Tanah,Maroon,Sage Green,Krem',
    sizes: 'S,M,L,XL',
    stock: 12,
    tone: 't1',
    featured: 1,
  },
  {
    name: 'Zahra Abaya Set',
    category: 'Abaya',
    price: 620000,
    description: 'Set abaya dua lapis dengan inner dalaman, cocok untuk acara formal maupun harian.',
    material: 'Premium crepe, tidak menerawang, jatuh lembut.',
    sizeGuide: 'S–XL, lihat tabel ukuran lengkap di panduan ukuran.',
    colors: 'Maroon,Coklat Tanah',
    sizes: 'S,M,L,XL',
    stock: 8,
    tone: 't2',
    featured: 1,
  },
  {
    name: 'Amora Pashmina Voal',
    category: 'Hijab & Pashmina',
    price: 129000,
    description: 'Pashmina voal ringan dan adem, mudah dibentuk untuk berbagai gaya hijab.',
    material: 'Voal premium anti-kusut.',
    sizeGuide: 'All size — 75x180cm.',
    colors: 'Sage Green,Terracotta,Krem,Coklat',
    sizes: 'All Size',
    stock: 25,
    tone: 't3',
    featured: 1,
  },
  {
    name: 'Layla Bergo Instan',
    category: 'Hijab & Pashmina',
    price: 95000,
    description: 'Bergo instan tanpa pentul, praktis untuk aktivitas sehari-hari.',
    material: 'Jersey premium, elastis.',
    sizeGuide: 'All size.',
    colors: 'Coklat,Maroon,Krem',
    sizes: 'All Size',
    stock: 20,
    tone: 't4',
    featured: 1,
  },
  {
    name: 'Naura Abaya Klasik',
    category: 'Abaya',
    price: 480000,
    description: 'Abaya klasik potongan simpel, cocok dipadukan dengan aksesoris apapun.',
    material: 'Premium linen blend.',
    sizeGuide: 'S–XL.',
    colors: 'Coklat Tanah,Sage Green',
    sizes: 'S,M,L,XL',
    stock: 10,
    tone: 't5',
  },
  {
    name: 'Inner Ciput Anti Slip',
    category: 'Aksesoris',
    price: 45000,
    description: 'Ciput anti slip, nyaman dipakai seharian tanpa bikin gerah.',
    material: 'Cotton combed 30s.',
    sizeGuide: 'All size.',
    colors: 'Hitam,Krem',
    sizes: 'All Size',
    stock: 30,
    tone: 't1',
  },
  {
    name: 'Qonita Abaya Linen',
    category: 'Abaya',
    price: 575000,
    description: 'Abaya linen dengan detail lengan lonceng, elegan untuk acara semi-formal.',
    material: '100% premium linen.',
    sizeGuide: 'S–XL.',
    colors: 'Maroon,Coklat',
    sizes: 'S,M,L,XL',
    stock: 6,
    tone: 't2',
  },
  {
    name: 'Salma Pashmina Crinkle',
    category: 'Hijab & Pashmina',
    price: 139000,
    description: 'Pashmina crinkle dengan tekstur bergelombang natural, tidak perlu disetrika.',
    material: 'Crinkle premium.',
    sizeGuide: 'All size — 75x190cm.',
    colors: 'Terracotta,Sage Green',
    sizes: 'All Size',
    stock: 18,
    tone: 't3',
  },
];

const insertProduct = db.prepare(`
  INSERT OR IGNORE INTO Product (slug, name, category, price, description, material, sizeGuide, colors, sizes, stock, tone, featured, active)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
`);

let count = 0;
for (const p of PRODUCTS) {
  const info = insertProduct.run(
    slugify(p.name),
    p.name,
    p.category,
    p.price,
    p.description,
    p.material,
    p.sizeGuide,
    p.colors,
    p.sizes,
    p.stock,
    p.tone,
    p.featured ? 1 : 0
  );
  if (info.changes > 0) count += 1;
}

const settingsInsert = db.prepare(`
  INSERT INTO Setting (key, value) VALUES (?, ?)
  ON CONFLICT(key) DO NOTHING
`);
settingsInsert.run('whatsapp_number', '628123456789');
settingsInsert.run('site_domain', 'khaleeva.id');
settingsInsert.run('announcement', 'Gratis Ongkir Jabodetabek — Min. Belanja Rp300.000');
settingsInsert.run('shipping_reguler_cost', '20000');
settingsInsert.run('shipping_instant_cost', '50000');
settingsInsert.run('free_shipping_min', '300000');
settingsInsert.run('bank_name', 'BCA');
settingsInsert.run('bank_account_number', '1234567890');
settingsInsert.run('bank_account_holder', 'Khaleeva Indonesia');

console.log(`Seed selesai. ${count} produk baru ditambahkan (skip yang sudah ada).`);
console.log('Semua data ini PLACEHOLDER — ganti lewat /admin/produk begitu data asli sudah siap.');
