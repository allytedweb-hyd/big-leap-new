"use client";
import React from "react";
import { useRouter } from "next/navigation";
import "./Banner.css";
import { scrollToContact } from "../../utils/scrollToContact";

export default function Banner() {
  const router = useRouter();

  return (
    <>
      <section className="hero">
        <div className="icon top">
          <img src="/assets/images/Bubble1.png" alt="python" />
        </div>
        <div className="icon left">
          <img src="/assets/images/Bubble2.png" alt="AI" />
        </div>
        <div className="icon right">
          <img src="/assets/images/Bubble3.png" alt="spark" />
        </div>
        <div className="icon left2">
          <img src="/assets/images/Bubble4.png" alt="spark" />
        </div>
        <div className="icon right2">
          <img src="/assets/images/Bubble5.png" alt="spark" />
        </div>

        <div className="content">
          <h1>
            From Learning to <br />
            <span>Real Engineering</span>
          </h1>
          <p>
            Build real pipelines, work on cloud platforms, industry tools,
            experience industry simulation, and prepare for industry hiring.
          </p>
          <div className="buttons">
            <button className="primary" onClick={scrollToContact}>
              <span className="btn-icon">▶</span> Talk to our expert
            </button>
            <button className="secondary" onClick={() => router.push("/courses")}>
              Explore Programs
            </button>
          </div>
        </div>

        <div className="circle big"></div>
        <div className="circle medium"></div>
        <div className="circle small"></div>
        <div className="circle left"></div>
        <div className="circle right"></div>
      </section>

      <div className="stats-bar">
        {/* Real Projects */}
        <div className="stat-item">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
              <path d="M7 8h2l2 4 2-6 2 4h2"/>
            </svg>
          </div>
          <p>Real Projects</p>
        </div>

        <div className="divider"></div>

        {/* Industry Simulation */}
        <div className="stat-item">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="1"/>
              <path d="M3 9h18"/>
              <path d="M9 21V9"/>
              <path d="M6 6h.01"/>
              <path d="M12 6h.01"/>
              <path d="M18 6h.01"/>
              <path d="M12 13h.01"/>
              <path d="M18 13h.01"/>
              <path d="M12 17h.01"/>
              <path d="M18 17h.01"/>
            </svg>
          </div>
          <p>Industry Simulation</p>
        </div>

        <div className="divider"></div>

        {/* Off-Campus Hiring Prep */}
        <div className="stat-item">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/>
            </svg>
          </div>
          <p>Off-Campus Hiring Prep</p>
        </div>

        <div className="divider"></div>

        {/* Placement Support */}
        <div className="stat-item">
          <div className="stat-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
              <line x1="12" y1="12" x2="12" y2="12"/>
              <path d="M2 12h20"/>
            </svg>
          </div>
          <p>Placement Support</p>
        </div>
      </div>
    </>
  );
}