"use client";

import { useState, useEffect } from "react";
import "./Header.css";
import { httpClient } from "../../utils/api";
import { scrollToContact } from "@/app/utils/scrollToContact";

interface Workshop {
  _id: string;
  workshopHeading: string;
  date: string;
  time: string;
  platform: string;
  whatYouWillLearn: string[];
  createdAt: string;
  updatedAt: string;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/courses" },
  { label: "Placements", href: "/placements" },
  { label: "LMS", href: "/login-page" },
  { label: "Industry Simulation", href: "/industry-simulations" },
  { label: "About Us", href: "/aboutus" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch workshops on component mount
  useEffect(() => {
    const fetchWorkshops = async () => {
      try {
        const { data } = await httpClient.get("/workshops");
        const workshopsData = data?.workshops || [];
        // Sort workshops and take latest 5 for dropdown
        const sortedWorkshops = [...workshopsData].sort((a: Workshop, b: Workshop) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setWorkshops(sortedWorkshops.slice(0, 5)); // Show latest 5 workshops
      } catch (error) {
        console.error("Failed to fetch workshops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkshops();
  }, []);

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <a href="/" className="navbar-logo">
          <img
            src="/assets/images/logo1.png"
            alt="BigLeap Logo"
            className="navbar-logo-img"
          />
        </a>

        {/* Desktop Links */}
        <div className="navbar-links">
          {NAV_LINKS.map((link) => (
            <a key={link.label} href={link.href} className="navbar-link">
              {link.label}
              <span className="navbar-link-underline" />
            </a>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="navbar-cta">
          <div className="navbar-dropdown">
            <a href="#" className="navbar-btn navbar-btn--outline">
              Free Workshop ▾
            </a>

            <div className="navbar-dropdown-menu">
              {loading ? (
                <div style={{ padding: "10px", textAlign: "center", color: "#666" }}>
                  Loading...
                </div>
              ) : workshops.length > 0 ? (
                workshops.map((workshop) => (
                  <a
                    key={workshop._id}
                    href={`/workshops/${slugify(workshop.workshopHeading)}/${workshop._id}`}
                  >
                    {workshop.workshopHeading}
                  </a>
                ))
              ) : (
                <div style={{ padding: "10px", textAlign: "center", color: "#666" }}>
                  No workshops available
                </div>
              )}
            </div>
          </div>

          <a href="#enroll" className="navbar-btn navbar-btn--primary" onClick={scrollToContact}>
            Enroll Now
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="navbar-hamburger"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="navbar-mobile">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="navbar-mobile-link"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="navbar-mobile-cta">
            <a href="/workshop" className="navbar-btn navbar-btn--outline">
              Free Workshop
            </a>
            <a href="#enroll" className="navbar-btn navbar-btn--primary">
              Enroll Now
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}