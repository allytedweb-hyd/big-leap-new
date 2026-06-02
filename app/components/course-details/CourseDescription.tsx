import styles from "./CourseDescription.module.css";

interface Props {
  descriptionTwo: string;
  learningOutcomesPoints: string[];
}

export default function CourseDescription({ descriptionTwo, learningOutcomesPoints }: Props) {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <p className={styles.para}>{descriptionTwo}</p>

        <h2 className={styles.overviewHeading}>Overview</h2>

        <ul className={styles.overviewList}>
          {learningOutcomesPoints.map((point, i) => (
            <li key={i} className={styles.overviewItem}>
              <span className={styles.checkIcon}>✓</span>
              {point}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
