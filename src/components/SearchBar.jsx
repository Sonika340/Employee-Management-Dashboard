import React from 'react';

export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar-wrapper">
      <label htmlFor="employee-search" className="filter-label">
        Search
      </label>
      <div className="search-input-container">
        <svg
          className="search-icon"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          id="employee-search"
          type="text"
          className="search-input"
          placeholder="Search employees by name"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
