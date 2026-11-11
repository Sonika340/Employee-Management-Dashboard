import React from 'react';

export default function StatusBadge({ status }) {
  const isActive = status === 'Active';

  return (
    <span className={`status-badge ${isActive ? 'status-active' : 'status-inactive'}`}>
      {status}
    </span>
  );
}
