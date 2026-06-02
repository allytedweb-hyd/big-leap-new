"use client";
import styles from "./BuiltForYou.module.css";

const CARDS = [
  {
    img: "/assets/images/Freshers.png",
    title: "Freshers",
    desc: "Start your engineering journey with real tools and workflows from day one.",
  },
  {
    img: "/assets/images/Final.png",
    title: "Final-Year Students",
    desc: "Bridge the gap between college projects and industry expectations.",
  },
  {
    img: "/assets/images/Nonit.png",
    title: "Non-IT Candidates",
    desc: "Structured, hands-on entry into tech for career switchers.",
  },
  {
    img: "/assets/images/offcampus.png",
    title: "Off-Campus Seekers",
    desc: "Students preparing for product and service company hiring rounds.",
  },
];

export default function BuiltForYou() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        Built for <span>Every Aspiring</span> Engineer
      </h2>
      <p className={styles.subtext}>
        Whether you're a fresher or preparing for off-campus hiring,
        Industry Simulation meets you where you are.
      </p>

      <div className={styles.grid}>
        {CARDS.map((card) => (
          <div key={card.title} className={styles.card}>
            <img src={card.img} alt={card.title} />
            <div className={styles.overlay} />
            <div className={styles.cardText}>
              <p className={styles.cardTitle}>{card.title}</p>
              <p className={styles.cardDesc}>{card.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}