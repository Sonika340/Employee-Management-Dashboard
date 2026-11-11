import React from 'react';

export default function Header({
  title = 'Dashboard',
  onToggleMobileMenu,
  onAddEmployee
}) {
  // Format today's date dynamically: e.g. "Wednesday, 11 November 2026"
  const todayFormatted = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="app-header">
      <div className="header-left">
        {/* Hamburger button visible on mobile/tablet */}
        <button
          type="button"
          className="header-hamburger-btn"
          onClick={onToggleMobileMenu}
          aria-label="Open menu"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <div>
          <h1 className="header-title">{title}</h1>
          <p className="header-date">{todayFormatted}</p>
        </div>
      </div>

      <div className="header-right">
        {/* Mobile quick add button */}
        {onAddEmployee && (
          <button
            type="button"
            className="mobile-header-add-btn"
            onClick={onAddEmployee}
            aria-label="Add Employee"
            title="Add Employee"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </button>
        )}

        <button
          type="button"
          className="header-bell-btn"
          aria-label="Notifications"
          title="Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </button>

        <div className="profile-chip">
          <div className="profile-avatar">HA</div>
          <span className="profile-name">HR Admin</span>
        </div>
      </div>
    </header>
  );
}
