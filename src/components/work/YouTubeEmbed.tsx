'use client';

import { useState } from 'react';
import styles from './YouTubeEmbed.module.css';

/**
 * Click-to-load YouTube player ("facade" pattern).
 *
 * Until someone actually clicks play this renders nothing but a button over
 * the poster image that the parent has already drawn. That means an unplayed
 * card costs zero network requests, ships no YouTube JavaScript, and sets no
 * cookies — which matters on a page that can show a dozen of them at once.
 *
 * On click the iframe is injected with `autoplay=1`, so the single click both
 * loads and starts the video.
 *
 * `youtube-nocookie.com` is used so a visitor who never plays anything is
 * never profiled, and a visitor who does play is tracked as little as YouTube
 * allows.
 */
export default function YouTubeEmbed({
  videoId,
  title,
  startSeconds,
  large,
}: {
  videoId: string;
  /** Used as the iframe title and the button's accessible name. */
  title: string;
  /** Seek offset, used by the reel chapter picker. */
  startSeconds?: number;
  /** The oversized play button used on the reel frame. */
  large?: boolean;
}) {
  const [active, setActive] = useState(false);

  if (active) {
    const params = new URLSearchParams({
      autoplay: '1',
      rel: '0',
      modestbranding: '1',
    });
    if (startSeconds) params.set('start', String(startSeconds));

    return (
      <iframe
        className={styles.frame}
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      className={styles.trigger}
      onClick={() => setActive(true)}
      aria-label={`Play ${title}`}
    >
      <span className={`${styles.play} ${large ? styles.large : ''}`} aria-hidden="true">
        ▶
      </span>
    </button>
  );
}

/** Converts a "m:ss" or "h:mm:ss" timecode into seconds for the `start` param. */
export function timecodeToSeconds(timecode: string): number {
  return timecode
    .split(':')
    .map(Number)
    .reduce((total, part) => total * 60 + part, 0);
}
