import React, { useState, useEffect } from 'react';
import { validateField, validateAllFields } from '../utils/validation';

export default function EmployeeForm({
  mode = 'add', // 'add' | 'edit'
  employeeToEdit = null,
  employeesList = [],
  departments = [],
  onSave,
  onCancel,
  onSelectEmployee,
  onAddNew,
  onRequestDelete,
  successMessage = null
}) {
  const isEdit = mode === 'edit' && Boolean(employeeToEdit);
  const currentEmployeeId = isEdit ? employeeToEdit?.id : null;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    joiningDate: '',
    status: 'Active'
  });

  const [errors, setErrors] = useState({});

  // Sync state when employeeToEdit or mode changes
  useEffect(() => {
    if (isEdit && employeeToEdit) {
      setFormData({
        name: employeeToEdit.name || '',
        email: employeeToEdit.email || '',
        phone: employeeToEdit.phone || '',
        department: employeeToEdit.department || '',
        designation: employeeToEdit.designation || '',
        joiningDate: employeeToEdit.joiningDate || '',
        status: employeeToEdit.status || 'Active'
      });
      setErrors({});
    } else if (mode === 'add') {
      setFormData({
        name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        joiningDate: '',
        status: 'Active'
      });
      setErrors({});
    }
  }, [isEdit, employeeToEdit, mode]);

  // Handle controlled input changes & live error clearing
  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    // Live validation on change: clears error when valid, or shows duplicate email error
    const fieldError = validateField(
      field,
      value,
      employeesList,
      currentEmployeeId
    );

    setErrors((prev) => {
      const next = { ...prev };
      if (!fieldError) {
        delete next[field];
      } else if (prev[field] || field === 'email') {
        next[field] = fieldError;
      }
      return next;
    });
  };

  const handleBlur = (field) => {
    const fieldError = validateField(
      field,
      formData[field],
      employeesList,
      currentEmployeeId
    );
    if (fieldError) {
      setErrors((prev) => ({ ...prev, [field]: fieldError }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formErrors = validateAllFields(
      formData,
      employeesList,
      currentEmployeeId
    );

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    onSave({
      ...formData,
      id: isEdit ? employeeToEdit.id : undefined
    });
  };

  // Helper for initials
  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formattedEmployeeId = isEdit
    ? `EMP-${String(employeeToEdit.id).padStart(3, '0')}`
    : '';

  return (
    <div className="employee-form-screen-container">
      {/* Success Notification Banner (Screen 5) */}
      {successMessage && (
        <aside className="form-success-banner" role="status" aria-live="polite">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{successMessage}</span>
        </aside>
      )}

      <div className="form-dual-layout">
        {/* Left Sidepanel with Employee List (Screens 4 & 5) */}
        <aside className="form-left-sidebar" aria-label="Quick Employee Selector">
          <button
            type="button"
            className="form-sidebar-add-btn"
            onClick={onAddNew}
          >
            + Add Employee
          </button>

          <ul className="form-sidebar-employee-list">
            {employeesList.map((emp) => {
              const isSelected = isEdit && employeeToEdit?.id === emp.id;
              return (
                <li key={emp.id} className="form-sidebar-item">
                  <button
                    type="button"
                    className={`form-sidebar-emp-btn ${isSelected ? 'selected' : ''}`}
                    onClick={() => onSelectEmployee(emp)}
                  >
                    <span className="initials-avatar" aria-hidden="true">
                      {getInitials(emp.name)}
                    </span>
                    <span className="form-sidebar-emp-name">{emp.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Right Form Main Area */}
        <section className="form-card-container" aria-labelledby="form-heading">
          {/* Mobile Back Header */}
          <div className="mobile-form-header">
            <button
              type="button"
              className="mobile-back-btn"
              onClick={onCancel}
              aria-label="Back to employee list"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="mobile-form-title">
              {isEdit ? 'Edit Employee' : 'New Employee'}
            </h2>
          </div>

          {/* Desktop Form Header */}
          <div className="form-card-header">
            <h2 id="form-heading" className="form-title">
              {isEdit ? 'Edit Employee' : 'New Employee'}
            </h2>
            {isEdit && (
              <span className="form-emp-id-chip">
                Employee ID: {formattedEmployeeId}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} noValidate className="employee-form-grid">
            {/* Row 1: Employee Name & Email Address */}
            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="field-name" className="form-label">
                  Employee Name <span className="req-star">*</span>
                </label>
                <input
                  id="field-name"
                  type="text"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Enter full name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  onBlur={() => handleBlur('name')}
                />
                {errors.name && <span className="field-error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="field-email" className="form-label">
                  Email Address <span className="req-star">*</span>
                </label>
                <input
                  id="field-email"
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="name@company.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => handleBlur('email')}
                />
                {errors.email && <span className="field-error-text">{errors.email}</span>}
              </div>
            </div>

            {/* Row 2: Phone Number & Department */}
            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="field-phone" className="form-label">
                  Phone Number <span className="req-star">*</span>
                </label>
                <input
                  id="field-phone"
                  type="tel"
                  className={`form-input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                />
                {errors.phone && <span className="field-error-text">{errors.phone}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="field-dept" className="form-label">
                  Department <span className="req-star">*</span>
                </label>
                <select
                  id="field-dept"
                  className={`form-select ${errors.department ? 'input-error' : ''}`}
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  onBlur={() => handleBlur('department')}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <span className="field-error-text">{errors.department}</span>
                )}
              </div>
            </div>

            {/* Row 3: Designation & Joining Date */}
            <div className="form-row-2col">
              <div className="form-group">
                <label htmlFor="field-designation" className="form-label">
                  Designation <span className="req-star">*</span>
                </label>
                <input
                  id="field-designation"
                  type="text"
                  className={`form-input ${errors.designation ? 'input-error' : ''}`}
                  placeholder="Enter designation"
                  value={formData.designation}
                  onChange={(e) => handleChange('designation', e.target.value)}
                  onBlur={() => handleBlur('designation')}
                />
                {errors.designation && (
                  <span className="field-error-text">{errors.designation}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="field-joiningDate" className="form-label">
                  Joining Date <span className="req-star">*</span>
                </label>
                <input
                  id="field-joiningDate"
                  type="date"
                  className={`form-input ${errors.joiningDate ? 'input-error' : ''}`}
                  value={formData.joiningDate}
                  onChange={(e) => handleChange('joiningDate', e.target.value)}
                  onBlur={() => handleBlur('joiningDate')}
                />
                {errors.joiningDate && (
                  <span className="field-error-text">{errors.joiningDate}</span>
                )}
              </div>
            </div>

            {/* Row 4: Employee Status (Radio) */}
            <div className="form-group form-status-group">
              <fieldset className="status-fieldset">
                <legend className="form-label">
                  Employee Status <span className="req-star">*</span>
                </legend>
                <div className="status-radio-options">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="status"
                      value="Active"
                      checked={formData.status === 'Active'}
                      onChange={(e) => handleChange('status', e.target.value)}
                    />
                    <span>Active</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="status"
                      value="Inactive"
                      checked={formData.status === 'Inactive'}
                      onChange={(e) => handleChange('status', e.target.value)}
                    />
                    <span>Inactive</span>
                  </label>
                </div>
              </fieldset>
              {errors.status && <span className="field-error-text">{errors.status}</span>}
            </div>

            {/* Bottom Form Actions */}
            <div className="form-actions-row">
              {isEdit ? (
                <button
                  type="button"
                  className="form-delete-link"
                  onClick={() => onRequestDelete(employeeToEdit)}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span>Delete employee</span>
                </button>
              ) : (
                <div />
              )}

              <div className="form-buttons-right">
                <button
                  type="button"
                  className="form-cancel-btn"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="form-submit-btn"
                >
                  {isEdit ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
