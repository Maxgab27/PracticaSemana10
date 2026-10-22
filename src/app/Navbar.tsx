import React from 'react';

export const Navbar: React.FC = () => {
  return (
    <header className="app-navbar">
      <div className="navbar-brand">
        <div className="brand-logo-container" aria-hidden="true">
          <svg
            className="brand-logo-svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 3v18h18" />
            <path d="M18 9l-5 5-4-4-3 3" />
          </svg>
        </div>
        <div className="brand-texts">
          <span className="brand-title">COMERCIAL NOVA</span>
          <span className="brand-subtitle">Plataforma de Analítica & Segmentación K-Means</span>
        </div>
      </div>
    </header>
  );
};
