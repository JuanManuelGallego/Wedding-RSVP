'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function RSVPForm({ guest, existingRsvp }) {
  const [attending, setAttending] = useState(
    existingRsvp ? existingRsvp.attending : null
  );
  const [email, setEmail] = useState(existingRsvp?.email || '');
  const [status, setStatus] = useState(existingRsvp ? 'done' : 'idle'); // idle | submitting | done | error
  const isUpdate = Boolean(existingRsvp) || status === 'done';

  async function handleSubmit(e) {
    e.preventDefault();
    if (attending === null) return;

    setStatus('submitting');

    const { error } = await supabase.from('rsvps').upsert(
      {
        guest_id: guest.id,
        attending,
        party_size: attending ? guest.party_size : 0,
        email: email.trim() || null,
      },
      { onConflict: 'guest_id' }
    );

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
        <p>
          {attending
            ? `Thank you — we can't wait to celebrate with you.`
            : `Thank you for letting us know. You'll be missed.`}
        </p>
        <button className="edit-response-btn" type="button" onClick={() => setStatus('idle')}>
          Change your response
        </button>
      </div>
    );
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      {isUpdate && (
        <p className="already-responded-note">Update your response below.</p>
      )}

      <div className="field">
        <label>Will you be attending?</label>
        <div className="attend-toggle" role="group" aria-label="Attendance">
          <button
            type="button"
            aria-pressed={attending === true}
            onClick={() => setAttending(true)}
          >
            Yes
          </button>
          <button
            type="button"
            className="decline"
            aria-pressed={attending === false}
            onClick={() => setAttending(false)}
          >
            No
          </button>
        </div>
      </div>

      {attending === true && guest.party_size > 1 && (
        <p className="form-note">
          Your invitation includes {guest.party_size} guests.
        </p>
      )}

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="For updates about the day"
        />
      </div>

      {status === 'error' && (
        <p className="form-error">Something went wrong sending that — please try again.</p>
      )}

      <button
        className="submit-btn"
        type="submit"
        disabled={attending === null || status === 'submitting'}
      >
        {status === 'submitting' ? 'Sending…' : isUpdate ? 'Update RSVP' : 'Send RSVP'}
      </button>

      <p className="form-note">Please respond by August 1, 2026.</p>
    </form>
  );
}
