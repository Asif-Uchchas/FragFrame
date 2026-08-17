'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Kicker } from '@/components/ui/Section';
import { Scanlines } from '@/components/ui/Texture';
import YouTubeEmbed, { timecodeToSeconds } from '@/components/work/YouTubeEmbed';
import { chapters, reel } from '@/data/reel';
import styles from './ReelPlayer.module.css';

/**
 * The showreel frame and its chapter picker.
 *
 * Picking a chapter swaps the still, the title and the timecode, and moves the
 * scrubber. The scrubber position is derived from the chapter's start time
 * against the total runtime rather than being a fixed decorative width, so it
 * always tells the truth about where the chapter sits.
 *
 * When `reel.youtubeId` is set the frame becomes a real click-to-load player
 * and each chapter seeks to its own start offset.
 */
export default function ReelPlayer() {
  const [activeId, setActiveId] = useState(chapters[0]?.id ?? '');
  const active = chapters.find((chapter) => chapter.id === activeId) ?? chapters[0];

  if (!active) return null;

  const totalSeconds = timecodeToSeconds(reel.runtime);
  const elapsedSeconds = timecodeToSeconds(active.start);
  const progress = totalSeconds > 0 ? Math.round((elapsedSeconds / totalSeconds) * 100) : 0;

  return (
    <>
      <div className={`chamfer ${styles.frame}`}>
        <Image
          src={active.image}
          alt={active.alt}
          fill
          className={styles.still}
          sizes="100vw"
          priority
        />
        <div className={styles.vignette} aria-hidden="true" />
        <Scanlines />

        {reel.youtubeId ? (
          // `key` restarts the embed when the chapter changes so the new start
          // offset actually takes effect.
          <YouTubeEmbed
            key={active.id}
            videoId={reel.youtubeId}
            title={`${active.title} — showreel`}
            startSeconds={elapsedSeconds}
            large
          />
        ) : (
          <span className={styles.playMark} aria-hidden="true">
            ▶
          </span>
        )}

        <div className={styles.bar}>
          <div className={styles.track}>
            <span className={styles.elapsed}>{active.start}</span>
            <div
              className={styles.rail}
              role="progressbar"
              aria-label="Chapter position"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
              aria-valuetext={`${active.start} of ${reel.runtime}`}
            >
              <div className={styles.progress} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.total}>{reel.runtime}</span>
          </div>
          <div className={styles.chapterTitle}>{active.title}</div>
        </div>
      </div>

      {!reel.youtubeId && <p className={styles.note}>{reel.placeholderNote}</p>}

      <Kicker className={styles.chaptersKicker}>{reel.chaptersKicker}</Kicker>

      <div className={styles.chapters}>
        {chapters.map((chapter) => (
          <button
            key={chapter.id}
            type="button"
            className={styles.chapter}
            aria-pressed={chapter.id === activeId}
            onClick={() => setActiveId(chapter.id)}
          >
            <span className={styles.chapterStart}>{chapter.start}</span>
            <span>
              <span className={styles.chapterName}>{chapter.title}</span>
              <span className={styles.chapterBody}>{chapter.body}</span>
            </span>
          </button>
        ))}
      </div>
    </>
  );
}
