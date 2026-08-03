'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { t } from '@/lib/i18n';
import { VIDEO_SRC } from '@/lib/constants';
import { VideoPhase, SubmitStatus } from '@/lib/types';
import type { Guest, Locale } from '@/lib/types';

export default function VideoInvite({ guest, locale }: { guest: Guest; locale: Locale }) {
  const isReturningGuest = guest.attending !== null;
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<VideoPhase>(
    isReturningGuest ? VideoPhase.Done : VideoPhase.Poster
  );
  const [attending, setAttending] = useState<boolean | null>(guest.attending);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(SubmitStatus.Idle);
  const [isBuffering, setIsBuffering] = useState(false);

  // Cleanup video on unmount
  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }, []);

  // Start video when phase changes to Playing
  useEffect(() => {
    if (phase === VideoPhase.Playing) {
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.play()?.catch(() => setPhase(VideoPhase.Ended));
      }
    }
  }, [phase]);

  // Keyboard shortcut: space to play/pause
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code !== 'Space' || e.target instanceof HTMLButtonElement) return;

      const video = videoRef.current;
      if (!video) return;

      if (phase === VideoPhase.Poster) {
        e.preventDefault();
        setPhase(VideoPhase.Playing);
      } else if (phase === VideoPhase.Playing && !video.paused) {
        e.preventDefault();
        video.pause();
      } else if (phase === VideoPhase.Playing && video.paused) {
        e.preventDefault();
        video.play();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase]);

  function startVideo() {
    setPhase(VideoPhase.Playing);
  }

  function onEnded() {
    setPhase(VideoPhase.Ended);
  }

  const submitRsvp = useCallback(
    async (answer: boolean) => {
      if (submitStatus === SubmitStatus.Submitting) return;
      setSubmitStatus(SubmitStatus.Submitting);
      setAttending(answer);

      const { error } = await supabase
        .from('guests')
        .update({ attending: answer, responded_at: new Date().toISOString() })
        .eq('id', guest.id);

      if (error) {
        console.error(error);
        setSubmitStatus(SubmitStatus.Error);
        return;
      }

      setSubmitStatus(SubmitStatus.Idle);
      setPhase(VideoPhase.Done);
    },
    [submitStatus, guest.id]
  );

  return (
    <div className="video-invite">
      {/* Video element */}
      {(phase === VideoPhase.Playing || phase === VideoPhase.Ended) && (
        <>
          <video
            ref={videoRef}
            className="video-invite__video"
            src={VIDEO_SRC}
            preload="auto"
            playsInline
            onEnded={onEnded}
            onError={() => setPhase(VideoPhase.Ended)}
            onWaiting={() => setIsBuffering(true)}
            onPlaying={() => setIsBuffering(false)}
          />
          {isBuffering && phase === VideoPhase.Playing && (
            <div className="video-invite__poster" style={{ background: 'transparent' }}>
              <div className="video-invite__buffering" />
            </div>
          )}
        </>
      )}

      {/* Poster / play button */}
      {phase === VideoPhase.Poster && (
        <div className="video-invite__poster">
          {guest.party_size === 1 ? (
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

      {/* RSVP buttons — Yes + No */}
      {phase === VideoPhase.Ended && (
        <div className="video-invite__confirm-overlay" role="region" aria-live="polite">
          <p className="video-invite__confirm-question">{t(locale, 'attendingLabel')}</p>
          <div className="video-invite__confirm-actions">
            <button
              className="video-invite__confirm-btn"
              type="button"
              onClick={() => submitRsvp(true)}
              disabled={submitStatus === SubmitStatus.Submitting}
            >
              {submitStatus === SubmitStatus.Submitting && attending === true
                ? '\u2026'
                : t(locale, 'yes')}
            </button>
            <button
              className="video-invite__confirm-btn video-invite__confirm-btn--decline"
              type="button"
              onClick={() => submitRsvp(false)}
              disabled={submitStatus === SubmitStatus.Submitting}
            >
              {submitStatus === SubmitStatus.Submitting && attending === false
                ? '\u2026'
                : t(locale, 'no')}
            </button>
          </div>
          {submitStatus === SubmitStatus.Error && (
            <div className="video-invite__confirm-error-wrap">
              <p className="video-invite__confirm-error">{t(locale, 'error')}</p>
              <button
                className="video-invite__retry-btn"
                type="button"
                onClick={() => submitRsvp(attending ?? true)}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}

      {/* Confirmation message */}
      {phase === VideoPhase.Done && (
        <div className="video-invite__confirm-overlay">
          <div className="video-invite__confirmation">
            <p className="eyebrow">
              {attending ? t(locale, 'confirmYes') : t(locale, 'confirmNo')}
            </p>
            {attending && <p className="eyebrow">{t(locale, 'realInvite')}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
