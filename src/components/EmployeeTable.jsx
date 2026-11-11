import React from 'react';
import StatusBadge from './StatusBadge';

export default function EmployeeTable({
  employees = [],
  totalEmployeesCount = 0,
  currentPage = 1,
  totalPages = 1,
  onPageChange = () => {},
  startIndex = 0,
  endIndex = 0,
  sortOrder = 'asc',
  onToggleSort = () => {},
  onEdit,
  onDelete
}) {
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Generate page numbers array [1, 2, ...]
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="employee-table-wrapper">
      {/* Desktop & Tablet Table */}
      <div className="table-responsive-container">
        <table className="employee-data-table">
          <thead>
            <tr>
              <th scope="col" className="th-name">
                <button
                  type="button"
                  className="table-sort-header-btn"
                  onClick={onToggleSort}
                  aria-label={`Sort by employee name, currently ${sortOrder === 'asc' ? 'ascending' : 'descending'}`}
                  title="Click to toggle sorting"
                >
                  <span>Employee Name</span>
                  <span className="sort-arrow-indicator" aria-hidden="true">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                </button>
              </th>
              <th scope="col">Email</th>
              <th scope="col">Department</th>
              <th scope="col">Designation</th>
              <th scope="col">Status</th>
              <th scope="col" className="th-action">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="employee-table-row">
                <td className="td-name">
                  <div className="employee-identity">
                    <span className="initials-avatar" aria-hidden="true">
                      {getInitials(emp.name)}
                    </span>
                    <span className="employee-name-text">{emp.name}</span>
                  </div>
                </td>
                <td className="td-email">{emp.email}</td>
                <td className="td-department">{emp.department}</td>
                <td className="td-designation">{emp.designation}</td>
                <td className="td-status">
                  <StatusBadge status={emp.status} />
                </td>
                <td className="td-action">
                  <div className="action-buttons-group">
                    <button
                      type="button"
                      className="table-action-btn edit-action-btn"
                      onClick={() => onEdit(emp)}
                      aria-label={`Edit ${emp.name}`}
                      title={`Edit ${emp.name}`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      className="table-action-btn delete-action-btn"
                      onClick={() => onDelete(emp)}
                      aria-label={`Delete ${emp.name}`}
                      title={`Delete ${emp.name}`}
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        <line x1="10" y1="11" x2="10" y2="17" />
                        <line x1="14" y1="11" x2="14" y2="17" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List (Screen 7) */}
      <div className="mobile-employee-cards-list">
        {employees.map((emp) => (
          <article key={emp.id} className="mobile-employee-card">
            <div className="mobile-card-main">
              <div className="mobile-card-left">
                <span className="initials-avatar" aria-hidden="true">
                  {getInitials(emp.name)}
                </span>
                <div className="mobile-card-meta">
                  <strong className="mobile-card-name">{emp.name}</strong>
                  <span className="mobile-card-sub">{emp.department}</span>
                </div>
              </div>
              <StatusBadge status={emp.status} />
            </div>

            <div className="mobile-card-actions">
              <button
                type="button"
                className="mobile-edit-btn"
                onClick={() => onEdit(emp)}
              >
                Edit
              </button>
              <button
                type="button"
                className="mobile-delete-btn"
                onClick={() => onDelete(emp)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination Bar (Matching UI Template Screen 2) */}
      {totalEmployeesCount > 0 && (
        <nav className="table-pagination-bar" aria-label="Table pagination">
          <span className="pagination-count-text">
            Showing {totalEmployeesCount === 0 ? 0 : startIndex + 1}–{endIndex} of{' '}
            {totalEmployeesCount} employees
          </span>

          <div className="pagination-controls">
            <button
              type="button"
              className="pagination-btn pagination-nav-btn"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Previous page"
            >
              Prev
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                type="button"
                className={`pagination-btn pagination-number-btn ${
                  currentPage === page ? 'active' : ''
                }`}
                onClick={() => onPageChange(page)}
                aria-current={currentPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            ))}

            <button
              type="button"
              className="pagination-btn pagination-nav-btn"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}
