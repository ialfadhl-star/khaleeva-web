'use client';

import { useState } from 'react';

export default function FaqAccordion({ items }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div>
      {items.map((item, i) => (
        <div className={`faq-item ${openIndex === i ? 'open' : ''}`} key={i}>
          <button type="button" className="faq-q" onClick={() => setOpenIndex(openIndex === i ? -1 : i)}>
            <span>{item.q}</span>
            <span className="plus">+</span>
          </button>
          <div className="faq-a">{item.a}</div>
        </div>
      ))}
    </div>
  );
}
