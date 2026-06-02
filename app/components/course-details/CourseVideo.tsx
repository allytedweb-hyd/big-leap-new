"use client";
import { useState } from "react";
import styles from "./CourseVideo.module.css";

interface Props {
  demoUrl: string;
  thumbnailUrl: string;
  title: string;
}

// Extract YouTube video ID from various URL formats
function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export default function CourseVideo({ demoUrl, thumbnailUrl, title }: Props) {
  const [playing, setPlaying] = useState(false);

  const youtubeId = getYouTubeId(demoUrl);
  const embedUrl = youtubeId
    ? `https://www.youtube.com/embed/${youtubeId}?autoplay=1`
    : demoUrl;

  const thumb = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : thumbnailUrl;

  return (
    <section className={styles.videoSection}>
      <div className={styles.container}>
        <div className={styles.videoWrapper}>
          {!playing ? (
            <div className={styles.thumbnail}>
              <img
                src={thumb}
                alt={`${title} preview`}
                className={styles.thumbImg}
              />
              <div className={styles.overlay}></div>
              <button
                className={styles.playBtn}
                onClick={() => setPlaying(true)}
                aria-label="Play preview"
              >
                <svg viewBox="0 0 24 24" width="28" height="28" fill="white">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              <p className={styles.previewLabel}>Preview Course</p>
            </div>
          ) : (
            <iframe
              className={styles.iframe}
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    </section>
  );
}
