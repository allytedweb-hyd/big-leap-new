"use client";
import { ArrowRight } from "lucide-react";
import styles from "./AboutHero.module.css";
import { scrollToContact } from "../../utils/scrollToContact";

export default function AboutHero() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* LEFT */}
        <div className={styles.leftCol}>
          <span className={styles.eyebrow}>About BigLeap Institute</span>

          <h1 className={styles.heading}>
            We Build{" "}
            <span className={styles.orange}>Engineers,</span>
            <br />
            Not Just Graduates
          </h1>

          <p className={styles.desc}>
            BigLeap is India's most outcome-focused tech training institute. We bridge
            the gap between academic learning and real industry demands — turning
            students into job-ready professionals through live projects and expert
            mentorship.
          </p>

          <button className={styles.enrollBtn} onClick={scrollToContact}>
            Enroll Now
            <span className={styles.arrowCircle}>
              <ArrowRight size={16} />
            </span>
          </button>
        </div>

        {/* RIGHT — desktop: 3 pill images */}
        <div className={styles.rightCol}>
          <div className={`${styles.imgWrap} ${styles.img1}`}>
            <img
              src="./assets/images/aboutus/left.png"
              alt="Student with glasses"
              className={styles.img}
            />
          </div>

          <div className={`${styles.imgWrap} ${styles.img2}`}>
            <img
              src="./assets/images/aboutus/middle.png"
              alt="Student with books"
              className={styles.img}
            />
          </div>

          <div className={`${styles.imgWrap} ${styles.img3}`}>
            <img
              src="./assets/images/aboutus/right.png"
              alt="Student in blazer"
              className={styles.img}
            />
          </div>
        </div>

        {/* MOBILE — single image */}
        <div className={styles.mobileImgWrap}>
          <img
            src="./assets/images/aboutimg.png"
            alt="BigLeap students"
            className={styles.mobileImg}
          />
        </div>

      </div>
    </section>
  );
}