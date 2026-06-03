"use client";
import React from "react";
import "./WhyChooseUs.css";
import { scrollToContact } from "@/app/utils/scrollToContact";

const points = [
  "Industry Simulation Environment",
  "Real Pipeline Development",
  "Cloud & Big Data Ecosystem",
  "Off-Campus Hiring Preparation",
  "Real-Time Workflow Experience",
  "Placement Guidance Till You Get Hired",
];

const badges = [
  {
    id: "badge1",
    top: "Industry",
    bottom: "Simulation",
    className: "wcu-badge1",
    icon: "🏭",
  },
  {
    id: "badge2",
    top: "Real",
    bottom: "Pipelines",
    className: "wcu-badge2",
    icon: "📊",
  },
  {
    id: "badge3",
    top: "Off-Campus",
    bottom: "Hiring Prep",
    className: "wcu-badge3",
    icon: "🎓",
  },
  {
    id: "badge4",
    top: "Placement",
    bottom: "Support",
    className: "wcu-badge4",
    icon: "💼",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="wcu-section">
      <div className="wcu-container">
        <div className="wcu-content">

          {/* LEFT */}
          <div className="wcu-left">
            <img
              src="/assets/images/leftone.png"
              alt="Engineers working on real data systems"
              className="wcu-img wcu-img1"
            />
            <img
              src="/assets/images/right.png"
              alt="Pipeline dashboard and cloud architecture"
              className="wcu-img wcu-img2"
            />

            {badges.map((badge) => (
              <div key={badge.id} className={`wcu-badge ${badge.className}`}>
                <div className="wcu-badge-icon">
                  <span className="wcu-badge-emoji">{badge.icon}</span>
                </div>
                <div className="wcu-badge-text">
                  <span>{badge.top}</span>
                  <p>{badge.bottom}</p>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT */}
          <div className="wcu-right">
            <p className="wcu-tag">WHY CHOOSE US</p>

            <h2 className="wcu-heading">
              We Don't Just Teach Tools.{" "}
              <span>We Simulate Real Engineering Work.</span>
            </h2>

            <p className="wcu-transform">
              From watching tutorials{" "}
              <span className="wcu-arrow">→</span>{" "}
              to building production-grade pipelines
            </p>

            <p className="wcu-desc">
              Learn how modern data engineering teams build, debug, deploy, and
              scale real-world data systems — not just theory, but actual
              workflow simulation.
            </p>

            <div className="wcu-points">
              {points.map((p) => (
                <p key={p}>✔ {p}</p>
              ))}
            </div>

            <button className="wcu-btn"  onClick={scrollToContact}>Start Your Journey →</button>
          </div>

        </div>
      </div>
    </section>
  );
}