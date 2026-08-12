# Khaleeva.id — Website (MVP)

Website katalog + jualan untuk brand Khaleeva. Alur checkout mengarah ke
WhatsApp (bukan payment gateway otomatis), sesuai keputusan MVP supaya bisa
launch cepat tanpa biaya integrasi besar di awal.

## Isi project ini

- **Storefront** (`/`, `/katalog`, `/produk/[slug]`, `/keranjang`, `/checkout`,
  `/tentang`, `/kontak`) — tampilan sesuai mockup, warna & tipografi masih
  placeholder earth-tone (lihat catatan di bawah).
- **Admin panel** (`/admin`) — login, kelola produk (tambah/edit/hapus/upload
  foto/stok), kelola pesanan (ubah status, input resi, kirim resi ke WA
  pelanggan), pengaturan (nomor WA, domain, ongkir, teks pengumuman).
- **Database**: SQLite lokal (`data/khaleeva.db`), dibuat otomatis pakai
  modul bawaan Node.js (`node:sqlite`) — tidak perlu install database
  terpisah.

## Menjalankan di komputer sendiri

Butuh **Node.js versi 22.5 ke atas** (cek dengan `node --version`).

```bash
npm install
npm run dev
```

Buka **http://localhost:3000**. Database & 8 produk contoh sudah otomatis
ter-seed (file `data/khaleeva.db` sudah disertakan). Kalau mau reset ke data
placeholder awal:

```bash
rm data/khaleeva.db
npm run seed
```

## Login Admin

Buka **http://localhost:3000/admin**

- Username: `admin`
- Password: `khaleeva2026`

Ganti kredensial ini di file `.env` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`)
sebelum website ini benar-benar dipakai publik. Ganti juga `SESSION_SECRET`
ke string acak yang panjang.

## Data yang masih PLACEHOLDER — wajib diganti

1. **Produk** — 8 produk contoh (Ashwa Abaya, Zahra Abaya Set, dst) beserta
   harga & stok. Ganti/tambah lewat `/admin/produk`, atau hapus semua dan
   input data asli.
2. **Foto produk** — belum ada foto asli, masih pakai kotak warna gradient.
   Upload foto asli lewat form edit produk di admin panel.
3. **Nomor WhatsApp, domain, ongkir** — atur di `/admin/pengaturan`.
4. **Warna & font brand** — CSS di `app/globals.css` masih pakai warna
   perkiraan dari screenshot Instagram (maroon/earth-tone) dan font Google
   Fonts (Cormorant Garamond + Jost). Kalau ada file logo/brand guideline
   asli, kirim ke saya supaya bisa disesuaikan persis.

## Batasan versi MVP ini (sengaja disederhanakan)

Ini konsekuensi dari keputusan "MVP dulu" yang sudah didiskusikan — semua
poin di bawah bisa diupgrade nanti kalau order sudah mulai ramai:

- **Ongkir** masih tarif flat (diatur manual di Pengaturan), belum hitung
  otomatis per kota lewat API (Biteship/RajaOngkir).
- **Pembayaran** masih manual — customer diarahkan ke WhatsApp, admin kirim
  info rekening manual, belum ada Virtual Account otomatis (Midtrans/Xendit).
- **Notifikasi resi** masih manual — admin klik tombol "Kirim Resi ke
  WhatsApp Pelanggan" di admin panel (bukan otomatis lewat WhatsApp Business
  API).
- **Filter katalog** hanya kategori & urutan harga (warna/ukuran/rentang
  harga belum ada, bisa ditambah kalau dibutuhkan).

## Sebelum deploy ke publik (penting)

1. **Ganti `ADMIN_PASSWORD` dan `SESSION_SECRET`** di `.env`.
2. **Pilih hosting yang punya penyimpanan file persisten** (VPS biasa,
   Railway, Render, atau sejenisnya). Website ini **TIDAK cocok di-deploy ke
   Vercel apa adanya**, karena database SQLite dan foto yang diupload admin
   disimpan sebagai file di server (`data/khaleeva.db` dan
   `public/uploads/`) — di Vercel, filesystem seperti ini tidak permanen
   antar deployment/request. Kalau nanti mau pakai Vercel, database perlu
   dipindah ke layanan terpisah (misal Turso/Postgres) dan foto ke cloud
   storage (S3/Cloudinary) — beri tahu saya kalau sudah waktunya, saya
   bantu migrasi.
3. **Jalankan `npm run build && npm start`** untuk mode production (bukan
   `npm run dev`), idealnya dijalankan lewat process manager seperti PM2
   supaya otomatis restart kalau crash.
4. Project ini sudah pakai **Next.js 16.3.0** (0 kerentanan di `npm audit`
   per hari ini). Kalau nanti `npm audit` menemukan advisory baru, jalankan
   `npm audit fix` (tanpa `--force`) dulu — kalau itu tetap mau upgrade ke
   major version berikutnya, kabari saya dulu supaya breaking changes-nya
   bisa dicek dan disesuaikan sebelum dipakai di production.

## Struktur folder ringkas

```
app/
  (site)/          halaman toko (beranda, katalog, produk, keranjang, checkout, dst)
  admin/           admin panel (login + halaman terproteksi)
  api/             API routes (orders, admin products/orders/settings/upload)
components/        komponen React yang dipakai berulang
lib/                akses database, sesi login, WhatsApp, dsb
scripts/seed.js     data placeholder awal
data/khaleeva.db    file database SQLite
public/uploads/     foto produk yang diupload lewat admin panel
```
