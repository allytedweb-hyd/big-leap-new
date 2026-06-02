"use client";
import { ArrowRight } from "lucide-react";
import styles from "./CoursePricing.module.css";
import { scrollToContact } from "../../utils/scrollToContact";

interface Props {
  title: string;
  price: number;
  keyHighlights: string[];
  hours: number;
  category?: string;
}

export default function CoursePricing({ title, price, keyHighlights, hours, category }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.card}>

          {/* Left column */}
          <div className={styles.leftCol}>
            <h2 className={styles.courseTitle}>{title}</h2>
            <p className={styles.courseDesc}>
              Learn how data flows—from raw sources to powerful insights.
            </p>
            <div className={styles.price}>
              ₹{price.toLocaleString("en-IN")}
            </div>
            <button className={styles.enrollBtn} onClick={scrollToContact}>
              Enroll Now
              <span className={styles.arrowCircle}>
                <ArrowRight size={16} />
              </span>
            </button>
          </div>

          {/* Right column */}
          <div className={styles.rightCol}>
            <div className={styles.popularBadge}>Most Popular</div>
            <div className={styles.starDecor}>✦</div>

            <div className={styles.metaRow}>
              <span className={styles.metaLabel}>Duration:</span>
              <span className={styles.metaValue}>{hours}+ Hours</span>
            </div>
            {category && (
              <div className={styles.metaRow}>
                <span className={styles.metaLabel}>Category:</span>
                <span className={styles.metaValue}>{category}</span>
              </div>
            )}

            {keyHighlights.length > 0 && (
              <>
                <div className={styles.divider}>
                  <span className={styles.dividerLabel}>Key Highlights</span>
                </div>
                <ul className={styles.highlightList}>
                  {keyHighlights.map((item, i) => (
                    <li key={i} className={styles.highlightItem}>
                      <span className={styles.checkIcon}>
                        <svg viewBox="0 0 20 20" width="13" height="13" fill="white">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}