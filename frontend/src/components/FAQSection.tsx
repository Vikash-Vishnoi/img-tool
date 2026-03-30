"use client";

import { useState } from "react";

type FAQItem = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  faqs: FAQItem[];
  heading?: string;
};

export default function FAQSection({
  faqs,
  heading = "Frequently asked questions",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section className="faq-section">
      <h2 className="faq-heading">{heading}</h2>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div key={`${faq.question}-${index}`} className={`faq-item ${openIndex === index ? "open" : ""}`}>
            <button
              type="button"
              className="faq-question"
              onClick={() => toggle(index)}
              aria-expanded={openIndex === index}
            >
              <span>{faq.question}</span>
              <span className="faq-icon" aria-hidden="true">
                {openIndex === index ? "-" : "+"}
              </span>
            </button>

            {openIndex === index ? (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}