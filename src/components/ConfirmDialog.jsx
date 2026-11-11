import React, { useEffect } from 'react';

export default function ConfirmDialog({
  isOpen,
  employee,
  onConfirm,
  onCancel
}) {
  // Close dialog on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !employee) return null;

  return (
    <div
      className="dialog-backdrop"
      onClick={onCancel}
      role="presentation"
    >
      <div
        className="dialog-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-desc"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-icon-circle" aria-hidden="true">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#B42318"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </div>

        <h3 id="dialog-title" className="dialog-title">
          Delete employee?
        </h3>

        <p id="dialog-desc" className="dialog-message">
          Are you sure you want to delete <strong>{employee.name}</strong>? This
          record will be removed permanently and can’t be undone.
        </p>

        <div className="dialog-buttons">
          <button
            type="button"
            className="dialog-cancel-btn"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="dialog-delete-btn"
            onClick={() => onConfirm(employee.id)}
          >
            Yes, delete
          </button>
        </div>
      </div>
    </div>
  );
}
