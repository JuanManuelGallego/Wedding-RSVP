'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || 'Something went wrong.');
      return;
    }

    router.refresh();
  }

  return (
    <main className="admin-wrap">
      <div className="admin-login">
        <h1>Admin</h1>
        <form onSubmit={handleSubmit} className="form" style={{ maxWidth: 320 }}>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>
          {error && <p className="form-error">{error}</p>}
          <button className="submit-btn" type="submit" disabled={loading}>
            {loading ? 'Checking\u2026' : 'Enter'}
          </button>
        </form>
      </div>
    </main>
  );
}
