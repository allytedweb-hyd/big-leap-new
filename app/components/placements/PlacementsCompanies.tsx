"use client";
import styles from "./PlacementsCompanies.module.css";
import { scrollToContact } from "../../utils/scrollToContact";

const allCompanies = [
  { name: "TCS", logo: "/assets/images/tcs.png" },
  { name: "Capgemini", logo: "/assets/images/Capgemini.png" },
  { name: "Accenture", logo: "https://cdn.worldvectorlogo.com/logos/accenture-2.svg" },
  { name: "Cognizant", logo: "/assets/images/cognizant.png" },
  { name: "Morgan Stanley", logo: "/assets/images/Morgan-Stanley.png" },
  { name: "Infosys", logo: "https://upload.wikimedia.org/wikipedia/commons/9/95/Infosys_logo.svg" },
  { name: "Deloitte", logo: "https://cdn.worldvectorlogo.com/logos/deloitte-1.svg" },
  { name: "Genpact", logo: "/assets/images/genpact.png" },
  { name: "Oracle", logo: "/assets/images/Oracle.png" },
  { name: "Wipro", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a0/Wipro_Primary_Logo_Color_RGB.svg" },
  { name: "DHL", logo: "/assets/images/DHL.png" },
  { name: "Tech Mahindra", logo: "/assets/images/Tech-Mahindra.png" },
  { name: "Honeywell", logo: "/assets/images/Honeywell.png" },
  { name: "HCL", logo: "/assets/images/HCL.png" },
  { name: "PwC", logo: "https://cdn.worldvectorlogo.com/logos/pwc.svg" },
  { name: "KPMG", logo: "https://cdn.worldvectorlogo.com/logos/kpmg.svg" },
];

const desktopRows = [
  allCompanies.slice(0, 4),
  allCompanies.slice(4, 8),
  allCompanies.slice(8, 12),
  allCompanies.slice(12, 16),
];

const rowOffsets = ["0px", "70px", "35px", "105px"];

const row1 = allCompanies.slice(0, 8);
const row2 = allCompanies.slice(8, 16);

export default function PlacementsCompanies() {
  return (
    <section className={styles.section}>
      {/* ── Left ── */}
      <div className={styles.left}>
        <h2 className={styles.heading}>
          Companies
          <br />
          Hiring <span className={styles.highlight}>Actively</span>
        </h2>
        <p className={styles.subtext}>
          Gain insights from industry experts and
          <br />
          master real-world skills for career growth
        </p>
        <button className={styles.ctaBtn} onClick={scrollToContact}>
          Get Started
          <span className={styles.ctaArrow}>→</span>
        </button>
      </div>

      {/* ── Desktop staggered rows ── */}
      <div className={styles.right}>
        <div className={styles.dotsOverlay} />
        <div className={styles.fadeLeft} />
        <div className={styles.logoRows}>
          {desktopRows.map((row, ri) => (
            <div
              key={ri}
              className={styles.logoRow}
              style={{ paddingLeft: rowOffsets[ri] }}
            >
              {row.map((c) => (
                <div key={c.name} className={styles.logoCard}>
                  <img
                    src={c.logo}
                    alt={c.name}
                    className={styles.logoImg}
                    data-logo={c.name.toLowerCase().replace(/\s+/g, "-")}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ── Mobile 2-row auto-scrolling carousel ── */}
      <div className={styles.carousel}>
        <div className={styles.carouselTrack}>
          <div className={styles.carouselRow}>
            {[...row1, ...row1].map((c, i) => (
              <div key={`r1-${i}`} className={styles.carouselCard}>
                <img
                  src={c.logo}
                  alt={c.name}
                  className={styles.carouselImg}
                  data-logo={c.name.toLowerCase().replace(/\s+/g, "-")}
                />
              </div>
            ))}
          </div>
          <div className={`${styles.carouselRow} ${styles.carouselRowReverse}`}>
            {[...row2, ...row2].map((c, i) => (
              <div key={`r2-${i}`} className={styles.carouselCard}>
                <img
                  src={c.logo}
                  alt={c.name}
                  className={styles.carouselImg}
                  data-logo={c.name.toLowerCase().replace(/\s+/g, "-")}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}