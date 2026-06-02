"use client";
import React, { useState, useEffect } from "react";
import "./Faq.css";
import { httpClient } from "../../utils/api";

interface FAQ {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

interface AccordionItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ question, answer, isOpen, onClick }) => (
  <div className={`faq-item ${isOpen ? "faq-item--open" : ""}`} onClick={onClick}>
    <div className="faq-question">
      <span className="faq-icon">{isOpen ? "—" : "+"}</span>
      <span className="faq-question-text">{question}</span>
    </div>
    {isOpen && <p className="faq-answer">{answer}</p>}
  </div>
);

export default function FAQ() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data } = await httpClient.get("/faqs");
        setFaqs(data?.faqs || []);
      } catch (err) {
        console.error("Failed to fetch FAQs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  const left = faqs.filter((_, i) => i % 2 === 0);
  const right = faqs.filter((_, i) => i % 2 !== 0);

  if (loading) return null; // or a skeleton loader

  if (faqs.length === 0) return null; // hide section if no FAQs

  return (
    <section className="faq-section">
      <h2 className="faq-heading">
        Frequently Ask <span>Questions</span>
      </h2>

      <div className="faq-grid">
        <div className="faq-col">
          {left.map((faq, i) => {
            const globalIndex = i * 2;
            return (
              <AccordionItem
                key={faq._id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === globalIndex}
                onClick={() => toggle(globalIndex)}
              />
            );
          })}
        </div>
        <div className="faq-col">
          {right.map((faq, i) => {
            const globalIndex = i * 2 + 1;
            return (
              <AccordionItem
                key={faq._id}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === globalIndex}
                onClick={() => toggle(globalIndex)}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}