"use client";
import { useState } from "react";
import styles from "./CoreExperiences.module.css";

const CARDS = [
  {
    icon: "🔧",
    title: "Real Pipeline Development",
    desc: "Build end-to-end batch and streaming data pipelines with Apache Spark, Kafka, and Airflow.",
  },
  {
    icon: "⚡",
    title: "Real-Time Engineering Workflows",
    desc: "Design, execute, and monitor workflows in production environments the way real teams do.",
  },
  {
    icon: "🏗️",
    title: "Industry-Style Task Execution",
    desc: "Sprint planning to delivery — structured tasks that mirror real company engineering cycles.",
  },
  {
    icon: "🔬",
    title: "Debugging & Troubleshooting",
    desc: "Analyze logs, identify failures, fix issues, and optimize performance like a senior engineer.",
  },
  {
    icon: "☁️",
    title: "Cloud & Big Data Exposure",
    desc: "Hands-on with AWS, Azure, and GCP, plus big data technologies used in modern ecosystems.",
  },
  {
    icon: "📊",
    title: "Monitoring & Optimization",
    desc: "Monitor pipeline execution, data quality, and system performance using real dashboards.",
  },
  {
    icon: "🤝",
    title: "Engineering Collaboration",
    desc: "Work inside cross-functional teams with real task assignment, review, and delivery cycles.",
  },
  {
    icon: "🚀",
    title: "Production-Oriented Thinking",
    desc: "Design scalable, maintainable systems deployed in real-world projects at enterprise scale.",
  },
];

export default function CoreExperiences() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        8 Core Engineering <span>Experiences</span>
      </h2>
      <p className={styles.subtext}>
        Every module reflects how top engineers actually work inside leading tech companies
      </p>

      <div className={styles.grid}>
        {CARDS.map((card, i) => (
          <div
            key={card.title}
            className={`${styles.card} ${activeIndex === i ? styles.active : ""}`}
            onMouseEnter={() => setActiveIndex(i)}
          >
            <div className={styles.iconWrap}>{card.icon}</div>
            <p className={styles.cardTitle}>{card.title}</p>
            <p className={styles.cardDesc}>{card.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}