import AdminNav from '../../../components/AdminNav';

// Admin pages always show live data (orders, stock, settings) — never let
// `next build` freeze them as static HTML from build time.
export const dynamic = 'force-dynamic';

export default function AdminProtectedLayout({ children }) {
  return (
    <div className="admin-shell">
      <AdminNav />
      <div className="admin-main">{children}</div>
    </div>
  );
}
