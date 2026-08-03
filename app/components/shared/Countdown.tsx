'use client';

import { useEffect, useState } from 'react';
import { t } from '@/lib/i18n';
import { WEDDING_TIMESTAMP } from '@/lib/constants';
import type { Locale } from '@/lib/types';

function calcRemaining() {
  const now = Date.now();
  const diff = Math.max(0, WEDDING_TIMESTAMP - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
  };
}

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

export default function Countdown({ locale = 'es' as Locale }: { locale?: Locale }) {
  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const id = setInterval(() => setRemaining(calcRemaining()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="countdown"
      role="timer"
      aria-live="polite"
      aria-label={t(locale, 'countdownLabel')}
    >
      <div className="countdown-unit">
        <span className="countdown-number">{pad(remaining.days)}</span>
        <span className="countdown-label">{t(locale, 'countdownDays')}</span>
      </div>
      <span className="countdown-sep" aria-hidden="true">
        :
      </span>
      <div className="countdown-unit">
        <span className="countdown-number">{pad(remaining.hours)}</span>
        <span className="countdown-label">{t(locale, 'countdownHours')}</span>
      </div>
      <span className="countdown-sep" aria-hidden="true">
        :
      </span>
      <div className="countdown-unit">
        <span className="countdown-number">{pad(remaining.minutes)}</span>
        <span className="countdown-label">{t(locale, 'countdownMinutes')}</span>
      </div>
    </div>
  );
}
