import React from 'react';

export default function FilterBar({
  departments = [],
  selectedDept,
  onDeptChange,
  selectedStatus,
  onStatusChange,
  onClearFilters
}) {
  return (
    <div className="filter-controls-group">
      <div className="filter-field">
        <label htmlFor="dept-filter" className="filter-label">
          Department
        </label>
        <select
          id="dept-filter"
          className="filter-select"
          value={selectedDept}
          onChange={(e) => onDeptChange(e.target.value)}
        >
          <option value="All">All departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="status-filter" className="filter-label">
          Status
        </label>
        <select
          id="status-filter"
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="All">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
      </div>

      <div className="filter-clear-wrapper">
        <button
          type="button"
          className="clear-filters-btn"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}
