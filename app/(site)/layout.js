import { CartProvider } from '../../components/CartContext';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import WelcomeModal from '../../components/WelcomeModal';
import { getSetting } from '../../lib/settings';

// This whole section reads live data (products, orders, settings) straight
// from SQLite on every request. Force dynamic rendering so `next build`
// never freezes these pages with stale data from build time.
export const dynamic = 'force-dynamic';

export default function SiteLayout({ children }) {
  const announcement = getSetting('announcement');

  return (
    <CartProvider>
      <div className="page">
        <WelcomeModal />
        <Header announcement={announcement} />
        {children}
        <Footer />
      </div>
    </CartProvider>
  );
}
