import styles from "./PlacementsHowWeHelp.module.css";
import React from "react";

const IconSkills = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <circle cx="24" cy="18" r="8" stroke="#1a2060" strokeWidth="2.5"/>
    <path d="M24 26v6M20 32h8" stroke="#1a2060" strokeWidth="2.5" strokeLinecap="round"/>
    <rect x="10" y="38" width="28" height="3" rx="1.5" stroke="#1a2060" strokeWidth="2.5"/>
  </svg>
);

const IconProjects = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <path d="M12 36V20l8-8h16v24H12z" stroke="#1a2060" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M20 12v8h-8" stroke="#1a2060" strokeWidth="2.5" strokeLinejoin="round"/>
    <path d="M18 28h12M18 33h8" stroke="#1a2060" strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="34" cy="14" r="5" fill="#1a2060"/>
    <path d="M31 14l2 2 4-4" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconSimulation = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <rect x="8" y="10" width="32" height="22" rx="3" stroke="#1a2060" strokeWidth="2.5"/>
    <path d="M18 36h12M24 32v4" stroke="#1a2060" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M20 22l4-5 4 3 4-5" stroke="#1a2060" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconResume = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <rect x="10" y="8" width="28" height="32" rx="3" stroke="#1a2060" strokeWidth="2.5"/>
    <circle cx="24" cy="20" r="5" stroke="#1a2060" strokeWidth="2.2"/>
    <path d="M15 33c0-5 18-5 18 0" stroke="#1a2060" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

const IconInterview = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <circle cx="16" cy="20" r="5" stroke="#1a2060" strokeWidth="2.2"/>
    <circle cx="32" cy="20" r="5" stroke="#1a2060" strokeWidth="2.2"/>
    <circle cx="24" cy="17" r="5" stroke="#1a2060" strokeWidth="2.5"/>
    <path d="M10 36c0-6 28-6 28 0" stroke="#1a2060" strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);

const IconPlacement = () => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="36">
    <rect x="8" y="14" width="32" height="22" rx="3" stroke="#1a2060" strokeWidth="2.5"/>
    <path d="M16 14v-3a2 2 0 012-2h12a2 2 0 012 2v3" stroke="#1a2060" strokeWidth="2.5"/>
    <path d="M8 22h32" stroke="#1a2060" strokeWidth="2.2"/>
    <path d="M20 30l3 3 6-6" stroke="#1a2060" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const steps = [
  { id: 1, label: "Learn Industry Skills",   Icon: IconSkills },
  { id: 2, label: "Build Real Projects",     Icon: IconProjects },
  { id: 3, label: "Industry Simulations",    Icon: IconSimulation },
  { id: 4, label: "Resume Preparation",      Icon: IconResume },
  { id: 5, label: "Mock Interviews",         Icon: IconInterview },
  { id: 6, label: "Placement Drives",        Icon: IconPlacement },
];

export default function PlacementsHowWeHelp() {
  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.heading}>
          How We Help You <span className={styles.highlight}>Get Placed</span>
        </h2>
        <p className={styles.subtext}>
          Gain insights from industry experts and master real-world skills
          <br />
          for career growth and professional development
        </p>
      </div>

      <div className={styles.flow}>
        {steps.map((step, i) => (
          <React.Fragment key={step.id}>
            <div className={styles.stepWrapper}>
              <div className={styles.circle}>
                <step.Icon />
              </div>
              <p className={styles.label}>{step.label}</p>
            </div>
            {i < steps.length - 1 && (
              <div className={styles.connectorWrapper}>
                <div className={styles.line} />
              </div>
            )}
          </React.Fragment>
        ))}

        {/* Get Hired */}
        <div className={styles.connectorWrapper}>
          <div className={styles.line} />
        </div>
        <div className={styles.stepWrapper}>
          <div className={styles.getHiredCircle}>
            <span>Get<br />Hired</span>
          </div>
          <p className={styles.label}>&nbsp;</p>
        </div>
      </div>
    </section>
  );
}