'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { t } from '../../lib/i18n';

export default function VideoInvite({ guest, locale }) {
  const isReturningGuest = guest.attending !== null;
  const videoRef = useRef(null);
  const [phase, setPhase] = useState(isReturningGuest ? 'done' : 'poster');
  const [attending, setAttending] = useState(guest.attending);
  const [status, setStatus] = useState('idle');

  useEffect(() => {
    if (phase === 'playing') {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play()?.catch(() => setPhase('ended'));
      }
    }
  }, [phase]);

  function startVideo() {
    setPhase('playing');
  }

  function onEnded() {
    setPhase('ended');
  }

  async function confirm() {
    if (status === 'submitting') return;
    setStatus('submitting');
    setAttending(true);

    const { error } = await supabase
      .from('guests')
      .update({ attending: true, responded_at: new Date().toISOString() })
      .eq('id', guest.id);

    if (error) {
      console.error(error);
      setStatus('error');
      return;
    }

    setStatus('done');
    setPhase('done');
  }

  return (
    <div className="video-invite">
      {(phase === 'playing' || phase === 'ended') && (
        <video
          ref={videoRef}
          className="video-invite__video"
          src="/video.mp4"
          preload="auto"
          playsInline
          onEnded={onEnded}
          onError={() => setPhase('ended')}
        />
      )}

      {phase === 'poster' && (
        <div className="video-invite__poster">
          {guest.size === 1 ? (
            <p className="eyebrow">{t(locale, 'invitedEyebrow')}</p>
          ) : (
            <p className="eyebrow">{t(locale, 'invitedEyebrowParty')}</p>
          )}
          <p className="video-invite__name">{guest.display_name}</p>
          <div className="video-invite__ornament">
            <span className="video-invite__ornament-diamond" />
          </div>
          <button
            className="video-invite__play"
            type="button"
            aria-label={t(locale, 'play')}
            onClick={startVideo}
          >
            <span className="video-invite__play-triangle" />
          </button>
          <p className="video-invite__play-label">{t(locale, 'play')}</p>
        </div>
      )}

      {phase === 'ended' && (
        <div className="video-invite__confirm-overlay">
          <button
            className="video-invite__confirm-btn"
            type="button"
            onClick={confirm}
            disabled={status === 'submitting'}
          >
            {status === 'submitting' ? '...' : t(locale, 'confirmAttendance')}
          </button>
          {status === 'error' && (
            <p className="video-invite__confirm-error">{t(locale, 'error')}</p>
          )}
        </div>
      )}

      {phase === 'done' && (
        <div className="video-invite__confirm-overlay">
          <div className="video-invite__confirmation">
            <p className="eyebrow">{attending ? t(locale, 'confirmYes') : t(locale, 'confirmNo')}</p>
            {attending && <p className="eyebrow">{t(locale, 'realInvite')}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
