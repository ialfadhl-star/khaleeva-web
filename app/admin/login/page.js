'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Login gagal.');
        setLoading(false);
        return;
      }
      router.push(searchParams.get('next') || '/admin');
      router.refresh();
    } catch {
      setError('Terjadi kesalahan jaringan.');
      setLoading(false);
    }
  }

  return (
    <form className="admin-login-card" onSubmit={handleSubmit}>
      <div className="logo" style={{ marginBottom: 24 }}>KHALEEVA</div>
      <span className="eyebrow">Admin Panel</span>
      <h2 className="serif" style={{ margin: '0 0 20px', fontSize: 22 }}>Masuk</h2>
      <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <div className="error-text">{error}</div>}
      <button type="submit" className="btn primary block" disabled={loading} style={{ marginTop: 8 }}>
        {loading ? 'Memproses...' : 'Masuk'}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="admin-login-wrap">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
