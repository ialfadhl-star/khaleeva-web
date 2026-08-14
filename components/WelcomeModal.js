'use client';

import { useState, useEffect } from 'react';

const SEEN_KEY = 'khaleeva_welcome_seen';

export default function WelcomeModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(SEEN_KEY)) {
      setOpen(true);
    }
  }, []);

  function close() {
    localStorage.setItem(SEEN_KEY, '1');
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div className="welcome-overlay" onClick={close}>
      <div className="welcome-card" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="welcome-close" onClick={close} aria-label="Tutup">
          &times;
        </button>
        <div className="welcome-emoji">💌✨</div>
        <h2 className="welcome-title">Halo Khalivia Mutia Audina</h2>
        <p className="welcome-text">
          Semoga lo suka yaa 🤍<br />
          Jangan lupa janji lo yaa!! ✨
        </p>
        <button type="button" className="btn primary" onClick={close}>
          Yuk Lihat!
        </button>
      </div>
    </div>
  );
}
