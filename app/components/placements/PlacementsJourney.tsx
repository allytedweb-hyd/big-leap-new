import styles from "./PlacementsJourney.module.css";

const learners = [
  {
    name: "Tejaswini Madivada",
    image: "/assets/images/tejaswini.png",
    from: "Fresher, Msc(Arts & Science)",
    role: "UI/UX Designer",
    company: "Google",
    companyLogo: "https://cdn-icons-png.flaticon.com/512/2991/2991148.png",
  },
  {
    name: "Manoj kumar",
    image: "/assets/images/manoj.png",
    from: "Fresher, Msc(Arts & Science)",
    role: "Software Developer",
    company: "Microsoft",
    companyLogo: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
  },
  {
    name: "Pooja Reddy",
    image: "/assets/images/pooja.png",
    from: "Fresher, Msc(Arts & Science)",
    role: "Data Analyst",
    company: "Amazon",
    companyLogo: "https://cdn-icons-png.flaticon.com/512/5968/5968217.png",
  },
  {
    name: "Thomas",
    image: "/assets/images/thomas.png",
    from: "Fresher, Msc(Arts & Science)",
    role: "Python Developer",
    company: "Meta",
    companyLogo: "https://cdn-icons-png.flaticon.com/512/5968/5968764.png",
  },
];

export default function PlacementsJourney() {
  return (
    <section className={styles.section}>
      {/* Heading */}
      <div className={styles.header}>
        <h2 className={styles.heading}>
          Journey Of Our <span className={styles.highlight}>Learners</span>
        </h2>
        <p className={styles.subtext}>
          Gain insights from industry experts and master real-world skills
          <br />
          for career growth and professional development
        </p>
      </div>

      {/* Cards */}
      <div className={styles.grid}>
        {learners.map((learner) => (
          <div key={learner.name} className={styles.card}>
            {/* Photo */}
            <div className={styles.photoWrap}>
              <img
                src={learner.image}
                alt={learner.name}
                className={styles.photo}
              />
            </div>

            {/* Name */}
            <p className={styles.name}>{learner.name}</p>

            {/* From */}
            <div className={styles.fromRow}>
              <span className={styles.fromDot} />
              <span className={styles.fromText}>{learner.from}</span>
            </div>

            {/* Dotted arrow */}
            <div className={styles.arrowCol}>
              <span className={styles.dottedLine} />
              <span className={styles.arrowHead}>▼</span>
            </div>

            {/* Company */}
            <div className={styles.companyWrap}>
              <img
                src={learner.companyLogo}
                alt={learner.company}
                className={styles.companyLogo}
              />
              <span className={styles.companyName}>{learner.company}</span>
            </div>

            {/* Role pill */}
            <div className={styles.rolePill}>
              <span className={styles.roleIcon}>●</span>
              <span className={styles.roleText}>{learner.role}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}