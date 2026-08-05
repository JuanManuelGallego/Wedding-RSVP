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
  const envelopeRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<VideoPhase>(
    isReturningGuest ? VideoPhase.Done : VideoPhase.Envelope
  );
  const [attending, setAttending] = useState<boolean | null>(guest.attending);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>(SubmitStatus.Idle);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [jumpToEnd, setJumpToEnd] = useState(false);
  const [envelopeStage, setEnvelopeStage] = useState<'idle' | 'opening' | 'sliding'>('idle');

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

  useEffect(() => {
    if (phase === VideoPhase.Playing) {
      const video = videoRef.current;
      if (video && video.paused) {
        video.currentTime = 0;
        video.play()?.catch(() => setPhase(VideoPhase.Ended));
      }
    }
    if (phase === VideoPhase.Ended && jumpToEnd) {
      const video = videoRef.current;
      if (video && video.duration) {
        video.currentTime = video.duration;
        setJumpToEnd(false);
      }
    }
  }, [phase, jumpToEnd]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.code !== 'Space' || e.target instanceof HTMLButtonElement) return;

      const video = videoRef.current;
      if (!video) return;

      if (phase === VideoPhase.Playing && !video.paused) {
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

  function openEnvelope() {
    if (envelopeStage !== 'idle') return;
    setEnvelopeStage('opening');
  }

  function onFlapAnimationEnd() {
    setEnvelopeStage('sliding');
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play()?.catch(() => {});
    }
  }

  function onVideoSlideEnd() {
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
      setHasSubmitted(true);
      setPhase(VideoPhase.Done);
    },
    [submitStatus, guest.id]
  );

  return (
    <div className="video-invite">
      {phase !== VideoPhase.Done && (
        <video
          ref={videoRef}
          className={
            phase === VideoPhase.Envelope
              ? `video-invite__envelope-video${envelopeStage === 'sliding' ? ' video-invite__envelope-video--sliding' : ''}`
              : 'video-invite__video'
          }
          src={VIDEO_SRC}
          preload="auto"
          playsInline
          onEnded={onEnded}
          onError={() => setPhase(VideoPhase.Ended)}
          onWaiting={() => setIsBuffering(true)}
          onPlaying={() => setIsBuffering(false)}
          onLoadedMetadata={() => {
            if (jumpToEnd && videoRef.current) {
              videoRef.current.currentTime = videoRef.current.duration;
              setJumpToEnd(false);
            }
          }}
          onAnimationEnd={phase === VideoPhase.Envelope ? onVideoSlideEnd : undefined}
        />
      )}

      {isBuffering && phase === VideoPhase.Playing && (
        <div className="video-invite__poster" style={{ background: 'transparent' }}>
          <div className="video-invite__buffering" />
        </div>
      )}

      {phase === VideoPhase.Envelope && (
        <div
          ref={envelopeRef}
          className={`video-invite__envelope${envelopeStage !== 'idle' ? ' video-invite__envelope--' + envelopeStage : ''}`}
          onClick={openEnvelope}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              openEnvelope();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={t(locale, 'play')}
        >
          <svg
            className="video-invite__envelope-svg"
            viewBox="0 0 400 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="envelopeBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f6f1e7" />
                <stop offset="100%" stopColor="#ebe4d4" />
              </linearGradient>
              <filter id="envelopeShadow" x="-20%" y="-10%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="12" floodColor="#16233f" floodOpacity="0.25" />
              </filter>
            </defs>

            <g filter="url(#envelopeShadow)">
              <rect x="8" y="60" width="384" height="212" rx="6" fill="url(#envelopeBody)" stroke="#b1854c" strokeWidth="1.2" />

              <path
                className="video-invite__envelope-flap"
                d="M8 60 L200 170 L392 60"
                fill="#ebe4d4"
                stroke="#b1854c"
                strokeWidth="1.2"
                strokeLinejoin="round"
                onAnimationEnd={onFlapAnimationEnd}
              />

              <path
                d="M8 272 L140 170"
                stroke="#b1854c"
                strokeWidth="0.8"
                opacity="0.4"
              />
              <path
                d="M392 272 L260 170"
                stroke="#b1854c"
                strokeWidth="0.8"
                opacity="0.4"
              />
            </g>

            <circle
              className="video-invite__envelope-seal"
              cx="200"
              cy="165"
              r="18"
              fill="#b1854c"
              stroke="#9a7340"
              strokeWidth="1"
            />
            <text
              x="200"
              y="170"
              textAnchor="middle"
              fill="#f6f1e7"
              fontSize="14"
            >
              M&J
            </text>

            <text
              className="video-invite__envelope-name"
              x="200"
              y="220"
              textAnchor="middle"
              fill="#16233f"
              fontSize="32"
              fontFamily="'Great Vibes', cursive"
              fontWeight="400"
            >
              {guest.display_name}
            </text>
          </svg>

          <p className="video-invite__envelope-hint">{t(locale, 'play')}</p>
          
          <div className="video-invite__sound-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          </div>

        </div>
      )}

      {phase === VideoPhase.Ended && (
        <div className="video-invite__confirm-overlay" role="region" aria-live="polite">
          <p className="video-invite__confirm-question">{t(locale, 'attendingLabel')}</p>
          <div className="video-invite__confirm-actions">
            <button
              className={`video-invite__confirm-btn${isReturningGuest && attending === true ? ' video-invite__confirm-btn--selected' : ''}`}
              type="button"
              onClick={() => submitRsvp(true)}
              disabled={submitStatus === SubmitStatus.Submitting}
            >
              {submitStatus === SubmitStatus.Submitting && attending === true
                ? '…'
                : t(locale, 'yes')}
            </button>
            <button
              className={`video-invite__confirm-btn video-invite__confirm-btn--decline${isReturningGuest && attending === false ? ' video-invite__confirm-btn--selected' : ''}`}
              type="button"
              onClick={() => submitRsvp(false)}
              disabled={submitStatus === SubmitStatus.Submitting}
            >
              {submitStatus === SubmitStatus.Submitting && attending === false
                ? '…'
                : t(locale, 'no')}
            </button>
          </div>
          <button
            className="video-invite__replay-btn"
            type="button"
            onClick={() => {
              setEnvelopeStage('idle');
              setPhase(VideoPhase.Envelope);
            }}
          >
            {t(locale, 'replay')}
          </button>
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

      {phase === VideoPhase.Done && (
        <div className="video-invite__confirm-overlay">
          <div className="video-invite__confirmation">
            <p className="eyebrow">
              {hasSubmitted
                ? attending
                  ? t(locale, 'confirmYes')
                  : t(locale, 'confirmNo')
                : attending
                  ? t(locale, 'alreadyRespondedYes')
                  : t(locale, 'alreadyRespondedNo')}
            </p>
            {hasSubmitted && attending && (
              <p className="eyebrow">{t(locale, 'realInvite')}</p>
            )}
          </div>
          <div className="video-invite__done-actions">
            <button
              className="video-invite__done-btn"
              type="button"
              onClick={() => {
                setEnvelopeStage('idle');
                setPhase(VideoPhase.Envelope);
              }}
            >
              {t(locale, 'replay')}
            </button>
            <button
              className="video-invite__done-btn"
              type="button"
              onClick={() => {
                setJumpToEnd(true);
                setPhase(VideoPhase.Ended);
              }}
            >
              {t(locale, 'changeResponse')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
