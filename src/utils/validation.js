/**
 * Validation utility functions for Employee Form
 */

export const validateField = (name, value) => {
  const trimmed = typeof value === 'string' ? value.trim() : value;

  switch (name) {
    case 'name':
      if (!trimmed) {
        return 'Employee name is required';
      }
      return '';

    case 'email':
      if (!trimmed) {
        return 'Email address is required';
      }
      // Standard email regex
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return 'Enter a valid email address, e.g. name@company.com';
      }
      return '';

    case 'phone':
      if (!trimmed) {
        return 'Phone number is required';
      }
      // Must be exactly 10 digits, numbers only
      if (!/^\d{10}$/.test(trimmed)) {
        return 'Phone number must be exactly 10 digits';
      }
      return '';

    case 'department':
      if (!trimmed) {
        return 'Department is required';
      }
      return '';

    case 'designation':
      if (!trimmed) {
        return 'Designation is required';
      }
      return '';

    case 'joiningDate':
      if (!trimmed) {
        return 'Joining date is required';
      }
      return '';

    case 'status':
      if (!trimmed) {
        return 'Status is required';
      }
      return '';

    default:
      return '';
  }
};

export const validateAllFields = (formData) => {
  const errors = {};
  const fields = ['name', 'email', 'phone', 'department', 'designation', 'joiningDate', 'status'];

  fields.forEach((field) => {
    const error = validateField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
};
