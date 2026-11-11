import React from 'react';

export default function EmptyState({
  searchQuery = '',
  selectedDept = 'All',
  selectedStatus = 'All',
  onClearFilters,
  onAddEmployee
}) {
  // Dynamically format descriptive filter explanation
  const buildExplanation = () => {
    const parts = [];
    if (searchQuery.trim()) {
      parts.push(`match “${searchQuery.trim()}”`);
    }
    if (selectedDept !== 'All') {
      parts.push(`in ${selectedDept}`);
    }
    if (selectedStatus !== 'All') {
      parts.push(`with status ${selectedStatus}`);
    }

    if (parts.length > 0) {
      return `No records ${parts.join(' ')}.`;
    }
    return 'No employee records match the selected criteria.';
  };

  return (
    <div className="empty-state-card" role="region" aria-label="No results found">
      <div className="empty-state-icon" aria-hidden="true">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#5B4A9F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      </div>

      <h3 className="empty-state-title">No employees found</h3>
      <p className="empty-state-message">
        {buildExplanation()}
        <br />
        Try a different name or clear the filters.
      </p>

      <div className="empty-state-actions">
        <button
          type="button"
          className="empty-clear-btn"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
        <button
          type="button"
          className="empty-add-btn"
          onClick={onAddEmployee}
        >
          Add Employee
        </button>
      </div>
    </div>
  );
}
