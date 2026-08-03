'use client';

import { useRouter } from 'next/navigation';

const CSRF_HEADERS = { 'X-Requested-With': 'XMLHttpRequest' };

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST', headers: CSRF_HEADERS });
    } finally {
      router.refresh();
    }
  }

  return (
    <button className="link-btn" type="button" onClick={handleLogout}>
      Log out
    </button>
  );
}
