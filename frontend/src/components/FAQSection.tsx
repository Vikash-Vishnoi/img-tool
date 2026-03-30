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
  return (
    <section className="faq-section">
      <h2 className="faq-heading">{heading}</h2>

      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details key={`${faq.question}-${index}`} className="faq-item">
            <summary className="faq-question">
              <span>{faq.question}</span>
              <span className="faq-icon" aria-hidden="true">+</span>
            </summary>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}