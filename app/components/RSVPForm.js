'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { t } from '../../lib/i18n';

export default function RSVPForm({ guest, locale }) {
  const hasResponded = guest.attending !== null;
  const [attending, setAttending] = useState(hasResponded ? guest.attending : null);
  const [status, setStatus] = useState(hasResponded ? 'done' : 'idle'); // idle | submitting | done | error
  const isUpdate = hasResponded || status === 'done';

  async function handleSubmit(e) {
    e.preventDefault();
    if (attending === null) return;

    setStatus('submitting');

    const { error } = await supabase
      .from('guests')
      .update({ attending, responded_at: new Date().toISOString() })
      .eq('id', guest.id);

    if (error) {
      console.error(error);
      setStatus('error');
      return;
    }

    setStatus('done');
  }

  if (status === 'done') {
    return (
      <div className="confirmation">
        <p className="confirmation-mark">&</p>
        <p>{attending ? t(locale, 'confirmYes') : t(locale, 'confirmNo')}</p>
        <button className="edit-response-btn" type="button" onClick={() => setStatus('idle')}>
          {t(locale, 'changeResponse')}
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {isUpdate && (
        <p className="already-responded-note">{t(locale, 'updateNote')}</p>
      )}

      <div className="field">
        <label>{t(locale, 'attendingLabel')}</label>
        <div className="attend-toggle" role="group" aria-label="Attendance">
          <button
            type="button"
            aria-pressed={attending === true}
            onClick={() => setAttending(true)}
          >
            {t(locale, 'yes')}
          </button>
          <button
            type="button"
            className="decline"
            aria-pressed={attending === false}
            onClick={() => setAttending(false)}
          >
            {t(locale, 'no')}
          </button>
        </div>
      </div>

      {attending === true && guest.party_size > 1 && (
        <p className="form-note">
          {t(locale, 'partyNote', { count: guest.party_size })}
        </p>
      )}

      {status === 'error' && (
        <p className="form-error">{t(locale, 'error')}</p>
      )}

      <button
        className="submit-btn"
        type="submit"
        disabled={attending === null || status === 'submitting'}
      >
        {status === 'submitting'
          ? t(locale, 'sending')
          : isUpdate
            ? t(locale, 'updateBtn')
            : t(locale, 'sendBtn')}
      </button>

      <p className="form-note">{t(locale, 'deadline')}</p>
    </form>
  );
}
