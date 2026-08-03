'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { t } from '../../lib/i18n';

export default function VideoInvite({ guest, locale }) {
  const isReturningGuest = guest.attending !== null;
  const videoRef = useRef(null);
  const [phase, setPhase] = useState(isReturningGuest ? 'buttons' : 'poster'); // poster | playing | fading | buttons
  const [attending, setAttending] = useState(guest.attending);
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error

  useEffect(() => {
    if (phase === 'playing') {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play()?.catch(() => setPhase('buttons'));
      }
    }
  }, [phase]);

  function startVideo() {
    setPhase('playing');
  }

  function replay() {
    setPhase('playing');
  }

  function fadeOut() {
    if (phase === 'fading') return;
    setPhase('fading');
    window.setTimeout(() => setPhase('buttons'), 650);
  }

  async function answer(value) {
    if (status === 'submitting') return;
    setAttending(value);
    setStatus('submitting');

    const { error } = await supabase
      .from('guests')
      .update({ attending: value, responded_at: new Date().toISOString() })
      .eq('id', guest.id);

    if (error) {
      console.error(error);
      setStatus('error');
      return;
    }

    setStatus('done');
  }

  return (
    <div className={`video-invite${phase === 'fading' ? ' video-invite--fading' : ''}`}>
      {phase !== 'poster' && phase !== 'buttons' && (
        <video
          ref={videoRef}
          className="video-invite__video"
          src="/video.mp4"
          preload="auto"
          playsInline
          onEnded={fadeOut}
          onError={() => setPhase('buttons')}
        />
      )}

      {phase === 'poster' && (
        <div className="video-invite__poster">
          <p className="eyebrow">{t(locale, 'invitedEyebrow')}</p>
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

      {phase !== 'poster' && phase !== 'buttons' && (
        <button className="video-invite__skip" type="button" onClick={fadeOut}>
          {t(locale, 'skip')}
        </button>
      )}

      {phase === 'buttons' && (
        <div className="video-invite__content">
          <div className="video-invite__inner">
            <p className="eyebrow">{t(locale, 'attendingLabel')}</p>
            {status === 'done' ? (
              <div className="confirmation">
                <p className="eyebrow">{attending ? t(locale, 'confirmYes') : t(locale, 'confirmNo')}</p>
                <p className="eyebrow">{attending && t(locale, 'realInvite')}</p><button
                  className="edit-response-btn"
                  type="button"
                  onClick={() => setStatus('idle')}
                >
                  {t(locale, 'changeResponse')}
                </button>
              </div>
            ) : (
              <>
                <div className="video-invite__buttons" role="group" aria-label="Attendance">
                  <button
                    className="video-invite__answer video-invite__answer--yes"
                    type="button"
                    aria-pressed={attending === true}
                    onClick={() => answer(true)}
                  >
                    {t(locale, 'yes')}
                  </button>
                  <button
                    className="video-invite__answer video-invite__answer--no"
                    type="button"
                    aria-pressed={attending === false}
                    onClick={() => answer(false)}
                  >
                    {t(locale, 'no')}
                  </button>
                </div>
                {isReturningGuest && status === 'idle' && (
                  <p className="already-responded-note">
                    {attending ? t(locale, 'alreadyRespondedYes') : t(locale, 'alreadyRespondedNo')}
                  </p>
                )}
                {guest.party_size > 1 && (
                  <p className="form-note">
                    {t(locale, 'partyNote', { count: guest.party_size })}
                  </p>
                )}

                {status === 'error' && <p className="form-error">{t(locale, 'error')}</p>}
              </>
            )}

            <button className="video-invite__replay" type="button" onClick={replay}>
              {t(locale, 'replay')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}