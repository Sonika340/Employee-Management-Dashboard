import React from 'react';
import StatusBadge from './StatusBadge';

export default function EmployeeTable({
  employees = [],
  onEdit,
  onDelete
}) {
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="employee-table-wrapper">
      {/* Desktop & Tablet Table */}
      <div className="table-responsive-container">
        <table className="employee-data-table">
          <thead>
            <tr>
              <th scope="col" className="th-name">
                Employee Name
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
    </div>
  );
}
