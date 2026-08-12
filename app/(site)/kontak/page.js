import FaqAccordion from '../../../components/FaqAccordion';
import { getSetting } from '../../../lib/settings';

export const metadata = { title: 'Kontak / FAQ — Khaleeva' };

const FAQ = [
  {
    q: 'Bagaimana cara melakukan pemesanan?',
    a: 'Pilih produk, tentukan warna & ukuran, tambahkan ke keranjang, lalu ikuti langkah checkout. Pesananmu akan diarahkan ke WhatsApp untuk konfirmasi dan info pembayaran.',
  },
  {
    q: 'Berapa lama estimasi pengiriman?',
    a: '2–4 hari kerja untuk pengiriman reguler, atau same-day untuk area Jabodetabek dengan opsi instant.',
  },
  {
    q: 'Apakah bisa tukar ukuran?',
    a: 'Bisa, selama produk belum dipakai/dicuci dan diajukan maksimal 3 hari setelah barang diterima.',
  },
  {
    q: 'Bagaimana cara merawat bahan linen premium?',
    a: 'Cuci dengan air dingin secara lembut, hindari peras keras, dan setrika suhu sedang dari bagian dalam kain.',
  },
];

export default function ContactPage() {
  const waNumber = getSetting('whatsapp_number');
  const waDisplay = waNumber.startsWith('62') ? '0' + waNumber.slice(2) : waNumber;

  return (
    <div className="faq-wrap">
      <div>
        <h2 className="serif" style={{ fontSize: 26, margin: '20px 0 10px' }}>Pertanyaan yang Sering Diajukan</h2>
        <FaqAccordion items={FAQ} />
      </div>

      <div className="contact-card">
        <h5 className="serif" style={{ fontSize: 16, margin: '0 0 14px' }}>Hubungi Kami</h5>
        <div className="row">&#128172; WhatsApp CS — {waDisplay}</div>
        <div className="row">&#128231; hello@khaleeva.id</div>
        <div className="row">&#128205; South Jakarta, Indonesia</div>
        <h5 className="serif" style={{ fontSize: 16, margin: '18px 0 10px' }}>Ikuti Kami</h5>
        <div className="row">Instagram — @khaleeva.id</div>
      </div>
    </div>
  );
}
