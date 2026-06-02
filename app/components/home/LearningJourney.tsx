"use client";
import React from "react";
import "./LearningJourney.css";

const steps = [
  {
    icon: "📖",
    title: "Learn",
    desc: "Core concepts, tools & foundations",
  },
  {
    icon: "🏋️",
    title: "Practice",
    desc: "Hands-on labs & guided exercises",
  },
  {
    icon: "🔨",
    title: "Build",
    desc: "Real projects from scratch",
  },
  {
    icon: "⛑️",
    title: "Work Like Engineer",
    desc: "Industry workflows & simulation",
  },
  {
    icon: "🏆",
    title: "Placement",
    desc: "Job referrals & career support",
  },
];

export default function LearningJourney() {
  return (
    <section className="lj-section">
      <span className="lj-badge">Your Path</span>
      <h2 className="lj-heading">
        Your Learning <span>Journey</span>
      </h2>
      <p className="lj-subtext">
        A structured path from complete beginner to job-ready Data Engineer in months, not years.
      </p>

      <div className="lj-steps">
        {steps.map((step, i) => (
          <React.Fragment key={step.title}>
            <div className="lj-step">
              <div className="lj-icon-wrap">
                <span className="lj-icon">{step.icon}</span>
              </div>
              <p className="lj-step-title">{step.title}</p>
              <p className="lj-step-desc">{step.desc}</p>
            </div>
            {i < steps.length - 1 && (
              <div className="lj-divider" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}