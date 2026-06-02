"use client";
import { useRef } from "react";
import styles from "./PlacementsCompanies.module.css";
import { scrollToContact } from "../../utils/scrollToContact";

const row1 = [
  { name: "amazon",  logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
  { name: "Trello",  logo: "https://cdn.worldvectorlogo.com/logos/trello.svg" },
  { name: "Shopify", logo: "https://cdn.worldvectorlogo.com/logos/shopify.svg" },
  { name: "Slack",   logo: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" },
  { name: "NETFLIX", logo: "https://cdn.worldvectorlogo.com/logos/netflix-4.svg" },
  { name: "miro",    logo: "https://cdn.worldvectorlogo.com/logos/miro-2.svg" },
  { name: "HubSpot", logo: "https://cdn.worldvectorlogo.com/logos/hubspot.svg" },
  { name: "Dropbox", logo: "https://cdn.worldvectorlogo.com/logos/dropbox-1.svg" },
];

const row2 = [
  { name: "tinder",  logo: "https://cdn.worldvectorlogo.com/logos/tinder-2.svg" },
  { name: "Spotify", logo: "https://cdn.worldvectorlogo.com/logos/spotify-2.svg" },
  { name: "Adobe",   logo: "https://cdn.worldvectorlogo.com/logos/adobe-2.svg" },
  { name: "Docker",  logo: "https://cdn.worldvectorlogo.com/logos/docker.svg" },
  { name: "Linear",  logo: "https://cdn.worldvectorlogo.com/logos/linear-1.svg" },
  { name: "Hotjar",  logo: "https://cdn.worldvectorlogo.com/logos/hotjar.svg" },
  { name: "Notion",  logo: "https://cdn.worldvectorlogo.com/logos/notion-2.svg" },
  { name: "Figma",   logo: "https://cdn.worldvectorlogo.com/logos/figma-1.svg" },
];

const desktopRows = [
  [
    { name: "amazon",  logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Trello",  logo: "https://cdn.worldvectorlogo.com/logos/trello.svg" },
    { name: "Shopify", logo: "https://cdn.worldvectorlogo.com/logos/shopify.svg" },
    { name: "Slack",   logo: "https://cdn.worldvectorlogo.com/logos/slack-new-logo.svg" },
  ],
  [
    { name: "NETFLIX", logo: "https://cdn.worldvectorlogo.com/logos/netflix-4.svg" },
    { name: "miro",    logo: "https://cdn.worldvectorlogo.com/logos/miro-2.svg" },
    { name: "HubSpot", logo: "https://cdn.worldvectorlogo.com/logos/hubspot.svg" },
    { name: "Dropbox", logo: "https://cdn.worldvectorlogo.com/logos/dropbox-1.svg" },
  ],
  [
    { name: "tinder",  logo: "https://cdn.worldvectorlogo.com/logos/tinder-2.svg" },
    { name: "Spotify", logo: "https://cdn.worldvectorlogo.com/logos/spotify-2.svg" },
    { name: "Adobe",   logo: "https://cdn.worldvectorlogo.com/logos/adobe-2.svg" },
    { name: "Docker",  logo: "https://cdn.worldvectorlogo.com/logos/docker.svg" },
  ],
  [
    { name: "Linear",  logo: "https://cdn.worldvectorlogo.com/logos/linear-1.svg" },
    { name: "Hotjar",  logo: "https://cdn.worldvectorlogo.com/logos/hotjar.svg" },
    { name: "Notion",  logo: "https://cdn.worldvectorlogo.com/logos/notion-2.svg" },
    { name: "Figma",   logo: "https://cdn.worldvectorlogo.com/logos/figma-1.svg" },
  ],
];

const rowOffsets = ["0px", "70px", "35px", "105px"];

export default function PlacementsCompanies() {
  return (
    <section className={styles.section}>
      {/* Left */}
      <div className={styles.left}>
        <h2 className={styles.heading}>
          Companies<br />
          Hiring <span className={styles.highlight}>Actively</span>
        </h2>
        <p className={styles.subtext}>
          Gain insights from industry experts and<br />
          master real-world skills for career growth
        </p>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>300+</span>
            <span className={styles.statLabel}>Hiring Partners</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>1200+</span>
            <span className={styles.statLabel}>Successful Placements</span>
          </div>
        </div>

        <div className={styles.packageItem}>
          <span className={styles.statNum}>₹12 LPA</span>
          <span className={styles.statLabel}>Highest Package</span>
        </div>

        <button className={styles.ctaBtn} onClick={scrollToContact}>
          Get Started
          <span className={styles.ctaArrow}>→</span>
        </button>
      </div>

      {/* Desktop — staggered rows */}
      <div className={styles.right}>
        <div className={styles.dotsOverlay} />
        <div className={styles.fadeLeft} />
        <div className={styles.logoRows}>
          {desktopRows.map((row, ri) => (
            <div key={ri} className={styles.logoRow} style={{ paddingLeft: rowOffsets[ri] }}>
              {row.map((c) => (
                <div key={c.name} className={styles.logoCard}>
                  <img src={c.logo} alt={c.name} className={styles.logoImg} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile — 2-row auto-scrolling carousel */}
      <div className={styles.carousel}>
        <div className={styles.carouselTrack}>
          {/* Row 1 — duplicated for infinite scroll feel */}
          <div className={styles.carouselRow}>
            {[...row1, ...row1].map((c, i) => (
              <div key={`r1-${i}`} className={styles.carouselCard}>
                <img src={c.logo} alt={c.name} className={styles.carouselImg} />
              </div>
            ))}
          </div>
          {/* Row 2 — scrolls opposite direction */}
          <div className={`${styles.carouselRow} ${styles.carouselRowReverse}`}>
            {[...row2, ...row2].map((c, i) => (
              <div key={`r2-${i}`} className={styles.carouselCard}>
                <img src={c.logo} alt={c.name} className={styles.carouselImg} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}