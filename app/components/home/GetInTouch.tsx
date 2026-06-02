"use client";
import React, { useState, useEffect } from "react";
import styles from "./GetInTouch.module.css";
import { httpClient } from "../../utils/api";
import { useToast } from "../Toast/useToast";

interface FormState {
  fullName: string;
  mobile: string;
  email: string;
  intrestedCourse: string;
  message: string;
}

interface Course {
  _id: string;
  title: string;
}

export default function GetInTouch() {
  const { success, error } = useToast();

  const [form, setForm] = useState<FormState>({
    fullName: "",
    mobile: "",
    email: "",
    intrestedCourse: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);

  // Fetch all courses for the dropdown
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await httpClient.get("/courses/all");
        // Support both response shapes: { courses: [...] } or direct array
        const list = Array.isArray(data) ? data : data.courses ?? [];
        setCourses(list);
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setCoursesLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!form.fullName.trim() || !form.mobile.trim() || !form.email.trim() || !form.message.trim()) {
      error("Missing fields", "Please fill in all required fields.");
      return;
    }

    setLoading(true);
    try {
      await httpClient.post("/enroll", form);
      success(
        "You're enrolled! 🎉",
        "A confirmation email has been sent to your inbox."
      );
      setForm({ fullName: "", mobile: "", email: "", intrestedCourse: "", message: "" });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Something went wrong. Please try again.";
      error("Submission failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.section} id="contact">
      <div className={styles.globeDecor}></div>

      <div className={styles.container}>
        {/* Left text */}
        <div className={styles.leftCol}>
          <svg
            className={styles.curvedArrow}
            viewBox="0 0 120 80"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 60 Q40 10 90 30"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d="M82 22 L90 30 L80 35"
              stroke="white"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <h2 className={styles.heading}>
            Start Your<br />
            <span className={styles.orange}>Job-Ready</span><br />
            Career Today
          </h2>
          <p className={styles.subText}>
           Connect with our team to explore career-focused programs <br />
            designed for future tech professionals.
          </p>
        </div>

        {/* Right form card */}
        <div className={styles.formCard}>
          <h3 className={styles.formTitle}>
            Get In <span className={styles.orange}>Touch</span>
          </h3>
          <p className={styles.formSubtitle}>
            Fill out the form and our team will get back to you shortly.
          </p>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name *"
            value={form.fullName}
            onChange={handleChange}
            className={`${styles.input} ${styles.fullWidth}`}
            disabled={loading}
          />

          <input
            type="email"
            name="email"
            placeholder="Email *"
            value={form.email}
            onChange={handleChange}
            className={`${styles.input} ${styles.fullWidth}`}
            disabled={loading}
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number *"
            value={form.mobile}
            onChange={handleChange}
            className={`${styles.input} ${styles.fullWidth}`}
            disabled={loading}
          />

          {/* ── Dynamic Course Dropdown ── */}
          <div className={styles.selectWrapper}>
            <select
              name="intrestedCourse"
              value={form.intrestedCourse}
              onChange={handleChange}
              className={`${styles.input} ${styles.fullWidth} ${styles.select}`}
              disabled={loading || coursesLoading}
            >
              <option value="">
                {coursesLoading ? "Loading courses…" : "Interested Course (optional)"}
              </option>
              {courses.map((course) => (
                <option key={course._id} value={course.title}>
                  {course.title}
                </option>
              ))}
            </select>
            <span className={styles.selectArrow}>▾</span>
          </div>

          <textarea
            name="message"
            placeholder="Message *"
            value={form.message}
            onChange={handleChange}
            rows={5}
            className={`${styles.input} ${styles.fullWidth} ${styles.textarea}`}
            disabled={loading}
          />

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Submitting…" : "Get Started Now"}
            {!loading && <span className={styles.arrowCircle}>→</span>}
          </button>
        </div>
      </div>
    </section>
  );
}