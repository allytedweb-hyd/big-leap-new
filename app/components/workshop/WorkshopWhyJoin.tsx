import styles from "./WorkshopWhyJoin.module.css";

const features = [
  {
    id: 1,
    iconBg: "#d1f0f0",
    iconColor: "#3bbfbf",
    title: "Full Session Recording",
    desc: "The Complete 2-Hour Recording Is Sent To Your Email Within 24 Hours After The Live Session.",
  },
  {
    id: 2,
    iconBg: "#d4f5e2",
    iconColor: "#2db56e",
    title: "Certificate Of Participation",
    desc: "The Complete 2-Hour Recording Is Sent To Your Email Within 24 Hours After The Live Session.",
  },
  {
    id: 3,
    iconBg: "#fde0e8",
    iconColor: "#e8456a",
    title: "Taught By Industry Expert",
    desc: "The Complete 2-Hour Recording Is Sent To Your Email Within 24 Hours After The Live Session.",
  },
  {
    id: 4,
    iconBg: "#f5d8f8",
    iconColor: "#c04ec9",
    title: "Comprehensive Learning",
    desc: "The Complete 2-Hour Recording Is Sent To Your Email Within 24 Hours After The Live Session.",
  },
  {
    id: 5,
    iconBg: "#faecd2",
    iconColor: "#c9922a",
    title: "Full Session Recording",
    desc: "The Complete 2-Hour Recording Is Sent To Your Email Within 24 Hours After The Live Session.",
  },
];

function VideoIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" fill={color}>
      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v2a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h8a2 2 0 012 2v2z" />
    </svg>
  );
}

export default function WorkshopWhyJoin() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <span className={styles.eyebrow}>WHY JOIN</span>
          <h2 className={styles.heading}>
            Why You Should Join This{" "}
            <span className={styles.orange}>MasterClass</span>
          </h2>
        </div>

        {/* Row 1 — 3 cards */}
        <div className={styles.rowThree}>
          {features.slice(0, 3).map((f) => (
            <div key={f.id} className={styles.card}>
              <div
                className={styles.iconWrap}
                style={{ background: f.iconBg }}
              >
                <VideoIcon color={f.iconColor} />
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Row 2 — 2 cards centered */}
        <div className={styles.rowTwo}>
          {features.slice(3).map((f) => (
            <div key={f.id} className={styles.card}>
              <div
                className={styles.iconWrap}
                style={{ background: f.iconBg }}
              >
                <VideoIcon color={f.iconColor} />
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardDesc}>{f.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
