import CheckoutClient from '../../../components/CheckoutClient';
import { getAllSettings } from '../../../lib/settings';

export const metadata = { title: 'Checkout — Khaleeva' };

export default function CheckoutPage() {
  const settings = getAllSettings();
  return (
    <>
      <div className="crumb">Beranda / Keranjang / <b>Checkout</b></div>
      <CheckoutClient settings={settings} />
    </>
  );
}
