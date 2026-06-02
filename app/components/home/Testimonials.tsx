"use client";
import React, { useState, useEffect, useRef } from "react";
import "./Testimonials.css";
import { httpClient } from "../../utils/api";

interface Testimonial {
  _id: string;
  name: string;
  text: string;
  color: string;
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await httpClient.get("/testimonials");
        setTestimonials(data?.testimonials || []);
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const total = testimonials.length;

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (total > 0) {
      timerRef.current = setInterval(() => {
        setCurrent((c) => (c + 1) % total);
      }, 3500);
    }
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [total]);

  const getIndex = (offset: number) => (current + offset + total) % total;
  const prev = () => { setCurrent((c) => (c - 1 + total) % total); resetTimer(); };
  const next = () => { setCurrent((c) => (c + 1) % total); resetTimer(); };

  if (loading || total === 0) return null;

  return (
    <section className="tm-section">
      <p className="tm-badge">TESTIMONIALS</p>
      <h2 className="tm-heading">
        What Our Students Said<br />
        <span>About Us</span>
      </h2>

      <div className="tm-carousel">
        {[-1, 0, 1].map((offset) => {
          const t = testimonials[getIndex(offset)];
          const isFeatured = offset === 0;
          return (
            <div
              key={offset}
              className={`tm-card ${isFeatured ? "tm-card--featured" : "tm-card--side"}`}
            >
              <p className="tm-text">"{t.text}"</p>
              <div className="tm-card-header">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=${t.color}&color=fff&size=128&bold=true&rounded=true`}
                  alt={t.name}
                  className="tm-avatar"
                />
                <div>
                  <p className="tm-name">{t.name}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="tm-controls">
        <button className="tm-arrow" onClick={prev}>&#8592;</button>
        <div className="tm-dots">
          {testimonials.map((_, i) => (
            <span
              key={i}
              className={`tm-dot ${i === current ? "tm-dot--active" : ""}`}
              onClick={() => { setCurrent(i); resetTimer(); }}
            />
          ))}
        </div>
        <button className="tm-arrow" onClick={next}>&#8594;</button>
      </div>
    </section>
  );
}