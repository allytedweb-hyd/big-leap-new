"use client";
import React from "react";
import "./WhyStudentsFail.css";

const problems = [
  "Only watching tutorials",
  "No real project experience",
  "No industry workflow exposure",
  "No confidence in interviews",
  "No guidance for off-campus hiring",
  "Learning tools without understanding systems",
];

const solutions = [
  "Build real-world pipelines",
  "Experience industry simulation",
  "Work on cloud platforms",
  "Prepare for off-campus hiring",
  "Solve real engineering problems",
  "Become job-ready with mentorship",
];

const XIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="11" r="11" fill="#FF3B3B" />
    <path d="M7 7L15 15M15 7L7 15" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <circle cx="11" cy="11" r="11" fill="#00A651" />
    <path d="M6 11.5L9.5 15L16 8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="38" height="20" viewBox="0 0 38 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1 10H35M35 10L26 2M35 10L26 18" stroke="#00A651" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function WhyStudentsFail() {
  return (
    <section className="never-get-hired">

      <div className="section-eyebrow">
        <span className="eyebrow-line" />
        <span className="eyebrow-dot red-dot" />
        <span className="eyebrow-dot orange-dot" />
        <span className="eyebrow-line" />
      </div>

      <h2 className="section-title">
        Why Most Freshers
        <span className="highlight"> Struggle to Get Hired</span>
      </h2>

      <p className="description">
        From confusion to confidence <br /> in 90 days
      </p>

      <div className="main-layout">

        {/* LEFT CARD */}
        <div className="fail-card">
          <div className="card-content">
            <p className="label red">MOST STUDENTS STRUGGLE BECAUSE THEY…</p>
            <div className="chips-list">
              {problems.map((text, i) => (
                <div className="chip" key={i}>
                  <XIcon />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image anchored to bottom, absolute */}
          <div className="card-image-wrapper">
            <div className="image-fade-top fail-fade" />
            <img src="/assets/images/leftim.jpeg" className="card-bg-img" alt="Struggling student" />
          </div>
        </div>

        {/* MIDDLE ARROWS */}
        <div className="middle-arrows">
          <div className="arrows-offset">
            {problems.map((_, i) => (
              <div className="arrow-row" key={i}>
                <ArrowIcon />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="success-card">
          <div className="card-content">
            <p className="label green">AT BIG LEAP TECHNOLOGIES, STUDENTS…</p>
            <div className="chips-list">
              {solutions.map((text, i) => (
                <div className="chip" key={i}>
                  <CheckIcon />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Image anchored to bottom, absolute */}
          <div className="card-image-wrapper success-image-wrapper">
            <div className="image-fade-top success-fade" />
            <img src="/assets/images/rightim.jpeg" className="card-bg-img2" alt="Successful student" />
          </div>
        </div>

      </div>
    </section>
  );
}