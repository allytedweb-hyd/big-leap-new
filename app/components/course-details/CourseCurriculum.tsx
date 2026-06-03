"use client";
import * as Accordion from "@radix-ui/react-accordion";
import { ChevronUp } from "lucide-react";
import styles from "./CourseCurriculum.module.css";

interface Lesson {
  _id: string;
  title: string;
  videoUrl: string;
  duration: number;
}

interface Chapter {
  _id: string;
  title: string;
  lessons: Lesson[];
}

interface Props {
  curriculum: Chapter[];
}

function formatDuration(minutes: number): string {
  if (!minutes) return "";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0 && m > 0) return `${h}hr. ${m} minutes`;
  if (h > 0) return `${h}hr.`;
  return `${m} minutes`;
}

function LessonCard({ number, lesson }: { number: number; lesson: Lesson }) {
  return (
    <div className={styles.lessonCard}>
      <div className={styles.lessonHeader}>
        <span className={styles.videoIcon}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="#f97316">
            <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v2a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h8a2 2 0 012 2v2z" />
          </svg>
        </span>
        <span className={styles.lessonLabel}>Lesson {number}</span>
        {lesson.duration > 0 && (
          <span className={styles.lessonDuration}>
            {formatDuration(lesson.duration)}
          </span>
        )}
      </div>
      <h4 className={styles.lessonTitle}>{lesson.title}</h4>
    </div>
  );
}

export default function CourseCurriculum({ curriculum }: Props) {
  if (!curriculum || curriculum.length === 0) {
    return null;
  }

  // Total lessons count across all chapters
  const totalLessons = curriculum.reduce((acc, ch) => acc + ch.lessons.length, 0);

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <span className={styles.eyebrow}>ABOUT COURSE</span>
        <h2 className={styles.heading}>
          Complete <span className={styles.orange}>Curriculum</span>
        </h2>
        <p className={styles.meta}>
          {totalLessons} Lessons &nbsp;•&nbsp; {curriculum.length} Chapters
        </p>

        <Accordion.Root
          type="multiple"
          defaultValue={curriculum.length > 0 ? [curriculum[0]._id] : []}
          className={styles.accordion}
        >
          {curriculum.map((chapter, chapterIdx) => (
            <Accordion.Item
              key={chapter._id}
              value={chapter._id}
              className={styles.item}
            >
              <Accordion.Trigger className={styles.trigger}>
                <div className={styles.triggerLeft}>
                  <span className={styles.chapterNum}>{chapterIdx + 1}</span>
                  <div className={styles.chapterMeta}>
                    <span className={styles.chapterDuration}>
                      Chapter {chapterIdx + 1} – {chapter.lessons.length} lessons
                    </span>
                    <span className={styles.chapterTitle}>{chapter.title}</span>
                  </div>
                </div>
                <span className={styles.chevronWrap}>
                  <ChevronUp size={18} color="#fff" className={styles.chevron} />
                </span>
              </Accordion.Trigger>

              <Accordion.Content className={styles.content}>
                <div className={styles.lessonList}>
                  <h4 className={styles.lessonListTitle}>Lesson Content</h4>

                  {chapter.lessons.map((lesson, lessonIdx) => (
                    <div key={lesson._id} className={styles.lessonItem}>
                      <span className={styles.lessonIcon}>
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="#f97316">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>

                      <span className={styles.lessonText}>
                        {lesson.title}
                      </span>

                      {lesson.duration > 0 && (
                        <span className={styles.lessonTime}>
                          {formatDuration(lesson.duration)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  );
}
