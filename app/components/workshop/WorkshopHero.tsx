// components/workshop/WorkshopHero.tsx
"use client";
import React, { useState, useEffect } from "react";
import { Calendar, Clock, Video, ArrowRight } from "lucide-react";
import styles from "./WorkshopHero.module.css";
import { httpClient } from "../../utils/api";
import { useToast } from "../Toast/useToast";
import { useParams } from "next/navigation";

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

interface FormState {
  fullname: string;  // Changed from firstName/lastName to fullname
  email: string;
  mobile: string;    // Changed from phone to mobile to match backend
  message: string;
}

interface WorkshopHeroProps {
  workshop: Workshop;
}

export default function WorkshopHero({ workshop }: WorkshopHeroProps) {
  const params = useParams();
  const workshopId = params?.id as string; // Get workshop ID from URL params
  const { success, error } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<FormState>({
    fullname: "",
    email: "",
    mobile: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Validate fullname (should have at least first and last name)
    const fullnameParts = form.fullname.trim().split(/\s+/);
    if (!form.fullname.trim() || fullnameParts.length < 2) {
      error("Invalid Name", "Please enter your full name (first and last name).");
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      error("Invalid Email", "Please enter a valid email address.");
      return;
    }

    // Validate mobile (exactly 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.mobile)) {
      error("Invalid Phone Number", "Please enter a valid 10-digit phone number.");
      return;
    }

    // Validate workshopId exists
    if (!workshopId && !workshop._id) {
      error("Invalid Workshop", "Workshop information is missing. Please try again.");
      return;
    }

    setSubmitting(true);
    try {
      // Send data matching backend schema
      const payload = {
        workshopId: workshop._id, // Use workshop ID from the workshop object
        fullname: form.fullname.trim(),
        email: form.email.trim().toLowerCase(),
        mobile: form.mobile.trim(),
        message: form.message.trim() || undefined, // Send undefined if empty
      };

      await httpClient.post("/workshop-registrations", payload);

      success(
        "Registration Successful! 🎉",
        `You've been registered for ${workshop.workshopHeading}. We'll send the workshop details to your email.`
      );

      // Reset form
      setForm({
        fullname: "",
        email: "",
        mobile: "",
        message: "",
      });
    } catch (err: any) {
      const msg = err?.response?.data?.message || "Something went wrong. Please try again.";
      error("Registration Failed", msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "Date TBA";
    return new Date(dateStr).toLocaleDateString("en-US", { 
      month: "long", 
      day: "numeric",
      year: "numeric"
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "Time TBA";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const parseHeading = (heading: string) => {
    const keywords = ["Masterclass", "Workshop", "Bootcamp", "Training"];
    for (const keyword of keywords) {
      if (heading.includes(keyword)) {
        const parts = heading.split(keyword);
        return { main: parts[0].trim(), highlight: keyword };
      }
    }
    return { main: heading, highlight: "Session" };
  };

  const { main, highlight } = parseHeading(workshop.workshopHeading);
  const learningItems = workshop.whatYouWillLearn || [];

  return (
    <section className={styles.section}>
      <div className={styles.gridOverlay}></div>
      <div className={styles.container}>
        {/* ── LEFT COLUMN ── */}
        <div className={styles.leftCol}>
          <span className={styles.eyebrow}>FREE LIVE MASTERCLASS</span>
          <h1 className={styles.heading}>
            {main}<br />
            <span className={styles.orange}>{highlight}</span>
          </h1>
          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <span className={styles.metaIconWrap}><Calendar size={15} color="#fff" /></span>
              <span className={styles.metaText}>{formatDate(workshop.date)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIconWrap}><Clock size={15} color="#fff" /></span>
              <span className={styles.metaText}>{formatTime(workshop.time)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaIconWrap}><Video size={15} color="#fff" /></span>
              <span className={styles.metaText}>Online: {workshop.platform}</span>
            </div>
          </div>
          <p className={styles.learnLabel}>WHAT YOU WILL LEARN</p>
          <div className={styles.learnCard}>
            {learningItems.map((item, i) => (
              <div key={i} className={styles.learnItem}>
                <span className={styles.learnCheck}>
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none"
                    stroke="#f97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className={styles.rightCol}>
          <div className={styles.formCard}>
            <h2 className={styles.formTitle}>
              Register <span className={styles.orange}>Now</span>
            </h2>
            <p className={styles.formSubtitle}>
              Fill out the form and our team will get back<br />to you shortly.
            </p>
            
            {/* Full Name input (combined first and last name) */}
            <input 
              type="text" 
              name="fullname" 
              placeholder="Full Name *" 
              value={form.fullname} 
              onChange={handleChange}
              className={`${styles.input} ${styles.fullWidth}`} 
              disabled={submitting} 
              required 
            />
            
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address *"
              value={form.email} 
              onChange={handleChange}
              className={`${styles.input} ${styles.fullWidth}`} 
              disabled={submitting} 
              required 
            />
            
            <input 
              type="tel" 
              name="mobile" 
              placeholder="Mobile Number * (10 digits)"
              value={form.mobile} 
              onChange={handleChange}
              className={`${styles.input} ${styles.fullWidth}`} 
              disabled={submitting} 
              required 
              maxLength={10}
              pattern="\d{10}"
            />
            
            <textarea 
              name="message" 
              placeholder="Message (optional)"
              value={form.message} 
              onChange={handleChange} 
              rows={4}
              className={`${styles.input} ${styles.fullWidth} ${styles.textarea}`}
              disabled={submitting} 
            />
            
            <button 
              className={styles.submitBtn} 
              onClick={handleSubmit} 
              disabled={submitting}
            >
              {submitting ? "Submitting..." : "Register Now"}
              {!submitting && (
                <span className={styles.arrowCircle}><ArrowRight size={16} /></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}