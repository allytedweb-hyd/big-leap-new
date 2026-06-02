"use client";

import React, { useState, useEffect, useCallback } from "react";
import styles from "./Syllabusmodal.module.css";
import { httpClient, UPLOADS_URL } from "../../utils/api";
import { useToast } from "../Toast/useToast";

interface SyllabusModalProps {
  courseId: string;
  courseTitle: string;
  curriculumKey: string; // filename stored on disk
  onClose: () => void;
}

interface FormState {
  fullName: string;
  email: string;
  mobile: string;
}

export default function SyllabusModal({
  courseId,
  courseTitle,
  curriculumKey,
  onClose,
}: SyllabusModalProps) {
  const { success, error } = useToast();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    mobile: "",
  });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Close on Escape
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.email.trim() || !form.mobile.trim()) {
      error("Missing fields", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      // Optional: log the syllabus download lead to your enroll/lead endpoint
      await httpClient.post("/enroll", {
        fullName: form.fullName,
        email: form.email,
        mobile: form.mobile,
        intrestedCourse: courseTitle,
        message: "Requested syllabus download.",
      });

      // Trigger the file download
      const fileUrl = `${UPLOADS_URL}/curricula/${curriculumKey}`;
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `${courseTitle}-Syllabus`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDone(true);
      success("Syllabus ready!", "Your download has started.");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Something went wrong. Please try again.";
      error("Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Left panel */}
        <div className={styles.leftPanel}>
          <div className={styles.iconWrap}>
            <svg viewBox="0 0 48 48" width="48" height="48" fill="none">
              <rect x="8" y="4" width="32" height="40" rx="4" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
              <line x1="16" y1="14" x2="32" y2="14" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="16" y1="20" x2="32" y2="20" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="16" y1="26" x2="26" y2="26" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="33" cy="36" r="7" fill="#f97316" />
              <path d="M30 36l2 2 4-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>

          <h2 className={styles.leftHeading}>
            Get Your Free<br />
            <span className={styles.orange}>Syllabus</span>
          </h2>

          <p className={styles.leftSub}>
            Download the complete curriculum for{" "}
            <strong>{courseTitle}</strong> — topics, projects, and timelines
            all in one doc.
          </p>

          <ul className={styles.benefits}>
            {[
              "Detailed module breakdown",
              "Project & assignment list",
              "Live session schedule",
              "Career outcomes roadmap",
            ].map((item) => (
              <li key={item}>
                <span className={styles.tick}>✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Right panel — form */}
        <div className={styles.rightPanel}>
          {done ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <svg viewBox="0 0 56 56" width="64" height="64" fill="none">
                  <circle cx="28" cy="28" r="26" fill="#f97316" opacity="0.15" />
                  <circle cx="28" cy="28" r="20" fill="#f97316" opacity="0.25" />
                  <circle cx="28" cy="28" r="14" fill="#f97316" />
                  <path d="M20 28l5.5 5.5L36 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className={styles.successTitle}>Download Started!</h3>
              <p className={styles.successMsg}>
                Your syllabus for <strong>{courseTitle}</strong> is downloading.
                Check your downloads folder.
              </p>
              <button className={styles.doneBtn} onClick={onClose}>
                Close
              </button>
            </div>
          ) : (
            <>
              <h3 className={styles.formTitle}>
                Quick Details &amp; <span className={styles.orange}>Download</span>
              </h3>
              <p className={styles.formSub}>
                Enter your info to unlock the free syllabus.
              </p>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Rahul Sharma"
                  value={form.fullName}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={loading}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="+91 98765 43210"
                  value={form.mobile}
                  onChange={handleChange}
                  className={styles.input}
                  disabled={loading}
                />
              </div>

              <button
                className={styles.downloadBtn}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <span className={styles.spinner} />
                ) : (
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" />
                  </svg>
                )}
                {loading ? "Preparing…" : "Download Syllabus"}
              </button>

              <p className={styles.privacyNote}>
                🔒 We respect your privacy. No spam, ever.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}