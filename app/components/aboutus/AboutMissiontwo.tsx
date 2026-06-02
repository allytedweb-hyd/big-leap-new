"use client";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./AboutMission.module.css";
import { scrollToContact } from "../../utils/scrollToContact";

export default function AboutMission() {
  const router = useRouter();

  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* ── LEFT: Text content ── */}
        <div className={styles.leftCol}>
          <span className={styles.eyebrow}>Expert Mentors. Real Experience</span>

          <h2 className={styles.heading}>
            Learn From Industry Experts &amp; Build Real Skills That Matter
          </h2>

          {/* "Explore Programs" → navigate to /courses page */}
          <button className={styles.exploreBtn} onClick={() => router.push("/courses")}>
            Explore Programs
            <span className={styles.arrowCircle}>
              <ArrowRight size={16} />
            </span>
          </button>
        </div>

        {/* ── RIGHT: Student image with badge ── */}
        <div className={styles.rightCol}>
          <div className={styles.imageCard}>
            <img
              src="./assets/images/aboutus/badgegirl.png"
              alt="Excited student ready to learn"
              className={styles.studentImg}
            />

            {/* Circular rotating badge → scroll to #contact */}
            <button
              className={styles.badge}
              aria-label="Get in touch"
              onClick={scrollToContact}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              <svg
                className={styles.badgeRing}
                viewBox="0 0 120 120"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <path
                    id="badgeCirclePath"
                    d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
                  />
                </defs>
                <text className={styles.badgeText}>
                  <textPath href="#badgeCirclePath" startOffset="0%">
                    GET IN TOUCH • GET IN TOUCH • GET IN TOUCH •&nbsp;
                  </textPath>
                </text>
              </svg>
              <span className={styles.badgeArrow}>
                <ArrowRight size={20} />
              </span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}