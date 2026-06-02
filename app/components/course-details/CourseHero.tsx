"use client";
import ReactStars from "react-rating-stars-component";
import styles from "./CourseHero.module.css";
import { scrollToContact } from "../../utils/scrollToContact";

interface Props {
  title: string;
  description: string;
  category?: string;
}

export default function CourseHero({ title, description, category }: Props) {
  const words = title.split(" ");
  const firstWord = words[0];
  const rest = words.slice(1).join(" ");

  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        {/* Rating row */}
        <div className={styles.ratingRow}>
          <ReactStars
            count={5}
            value={4.5}
            size={18}
            isHalf={true}
            edit={false}
            activeColor="#f59e0b"
            color="#555"
          />
          <span className={styles.ratingText}>(312 ratings)</span>
          <span className={styles.dot}>•</span>
          <span className={styles.students}>
            <strong>500+</strong> students
          </span>
          {category && (
            <>
              <span className={styles.dot}>•</span>
              <span className={styles.category}>{category}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h1 className={styles.heading}>
          <span className={styles.orange}>{firstWord}</span>
          {rest && (
            <>
              <br />
              {rest}
            </>
          )}
        </h1>

        {/* Description */}
        <p className={styles.desc}>{description}</p>

        {/* CTA */}
        <button
          className={styles.enrollBtn}
          onClick={scrollToContact}
        >
          Enroll Now &nbsp;→
        </button>
      </div>
    </section>
  );
}