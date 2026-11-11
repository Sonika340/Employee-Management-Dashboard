import React from 'react';

export default function DashboardCard({ title, count, type = 'total' }) {
  const getIcon = () => {
    switch (type) {
      case 'active':
        return (
          <div className="card-icon-container card-icon-active" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        );
      case 'inactive':
        return (
          <div className="card-icon-container card-icon-inactive" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="8" y1="12" x2="16" y2="12" />
            </svg>
          </div>
        );
      case 'total':
      default:
        return (
          <div className="card-icon-container card-icon-total" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
        );
    }
  };

  return (
    <article className="dashboard-card">
      {getIcon()}
      <div className="card-details">
        <span className="card-title">{title}</span>
        <strong className="card-count">{count}</strong>
      </div>
    </article>
  );
}
