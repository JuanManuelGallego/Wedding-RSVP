'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';

interface UseGuestMutationsReturn {
  savingId: string | null;
  error: string;
  updateGuest: (id: string, body: Record<string, unknown>) => Promise<{ ok: boolean }>;
  setError: (error: string) => void;
}

export function useGuestMutations(): UseGuestMutationsReturn {
  const router = useRouter();
  const [savingId, setSavingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  const updateGuest = useCallback(
    async (id: string, body: Record<string, unknown>): Promise<{ ok: boolean }> => {
      if (savingId) return { ok: false };
      setSavingId(id);
      setError('');

      const res = await fetch(`/api/admin/guests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      setSavingId(null);
      if (!res.ok) {
        setError(`Couldn't update guest.`);
        return { ok: false };
      }
      router.refresh();
      return { ok: true };
    },
    [savingId, router]
  );

  return { savingId, error, updateGuest, setError };
}
