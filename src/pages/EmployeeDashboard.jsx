import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import DashboardCard from '../components/DashboardCard';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import EmployeeTable from '../components/EmployeeTable';
import EmptyState from '../components/EmptyState';
import EmployeeForm from '../components/EmployeeForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { departments, employees as initialEmployees } from '../data/employees';

export default function EmployeeDashboard() {
  // Bonus: Load from localStorage on initialization with fallback
  const [employeeList, setEmployeeList] = useState(() => {
    try {
      const savedData = localStorage.getItem('employee_dashboard_data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load employees from localStorage', e);
    }
    return initialEmployees;
  });

  // Active navigation view ('dashboard' | 'employees' | 'departments' | 'reports' | 'settings')
  const [activeTab, setActiveTab] = useState('dashboard');

  // Form mode state (null = list view, 'add' = new employee, 'edit' = edit employee)
  const [formMode, setFormMode] = useState(null);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [formSuccessMessage, setFormSuccessMessage] = useState(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Bonus: Sort by name state ('asc' | 'desc')
  const [sortOrder, setSortOrder] = useState('asc');

  // Bonus: Pagination state (5 records per page)
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Delete modal dialog state
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Mobile navigation drawer toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // ---------------- Bonus: Sync to localStorage on changes ---------------- //
  useEffect(() => {
    try {
      localStorage.setItem('employee_dashboard_data', JSON.stringify(employeeList));
    } catch (e) {
      console.error('Failed to save employees to localStorage', e);
    }
  }, [employeeList]);

  // ---------------- Reset pagination on filter or sort change ---------------- //
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDept, selectedStatus, sortOrder]);

  // ---------------- Derived Metrics ---------------- //
  const totalEmployees = employeeList.length;
  const activeEmployees = employeeList.filter((emp) => emp.status === 'Active').length;
  const inactiveEmployees = employeeList.filter((emp) => emp.status === 'Inactive').length;

  // Live Department counts calculated using reduce (Bonus: updates live on add/edit/delete)
  const deptCounts = departments.map((dept) => {
    const count = employeeList.reduce(
      (acc, emp) => (emp.department === dept ? acc + 1 : acc),
      0
    );
    return { name: dept, count };
  });
  const maxDeptCount = Math.max(...deptCounts.map((d) => d.count), 1);

  // Recently added (top 4 newest by joiningDate)
  const recentEmployees = [...employeeList]
    .sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate))
    .slice(0, 4);

  // ---------------- Combined Filter & Sort Logic ---------------- //
  // Search + Department + Status combined in ONE derived filtered list
  const filteredEmployees = employeeList.filter((emp) => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === '' || emp.name.toLowerCase().includes(query);
    const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || emp.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  // Sort filtered employees by name A-Z / Z-A
  const sortedEmployees = [...filteredEmployees].sort((a, b) => {
    const comparison = a.name.localeCompare(b.name);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Pagination slicing (5 records per page)
  const totalFilteredRecords = sortedEmployees.length;
  const totalPages = Math.ceil(totalFilteredRecords / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalFilteredRecords);
  const paginatedEmployees = sortedEmployees.slice(startIndex, endIndex);

  // ---------------- Navigation & View Handlers ---------------- //
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setFormMode(null);
    setEmployeeToEdit(null);
    setFormSuccessMessage(null);
  };

  const handleOpenAddForm = () => {
    setActiveTab('employees');
    setFormMode('add');
    setEmployeeToEdit(null);
    setFormSuccessMessage(null);
  };

  const handleOpenEditForm = (emp) => {
    setActiveTab('employees');
    setFormMode('edit');
    setEmployeeToEdit(emp);
    setFormSuccessMessage(null);
  };

  const handleCancelForm = () => {
    setFormMode(null);
    setEmployeeToEdit(null);
    setFormSuccessMessage(null);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedDept('All');
    setSelectedStatus('All');
  };

  const handleToggleSort = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // ---------------- CRUD Operations ---------------- //
  const handleSaveEmployee = (empData) => {
    if (formMode === 'add') {
      // New employee id = highest existing id + 1
      const newId =
        employeeList.length > 0
          ? Math.max(...employeeList.map((e) => e.id)) + 1
          : 1;

      const newEmployee = {
        ...empData,
        id: newId
      };

      setEmployeeList([newEmployee, ...employeeList]);
      setFormMode(null);
      setEmployeeToEdit(null);
    } else if (formMode === 'edit') {
      setEmployeeList((prevList) =>
        prevList.map((emp) => (emp.id === empData.id ? { ...emp, ...empData } : emp))
      );
      setEmployeeToEdit({ ...empData });
      setFormSuccessMessage('Employee details updated successfully');
    }
  };

  const handleRequestDelete = (emp) => {
    setEmployeeToDelete(emp);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = (id) => {
    setEmployeeList((prevList) => prevList.filter((emp) => emp.id !== id));
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);

    // If deleting the currently edited employee, return to table view
    if (employeeToEdit && employeeToEdit.id === id) {
      setFormMode(null);
      setEmployeeToEdit(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setEmployeeToDelete(null);
  };

  // ---------------- Helpers ---------------- //
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getInitials = (name) => {
    if (!name) return '';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Current page title
  const getHeaderTitle = () => {
    if (activeTab === 'dashboard') return 'Dashboard';
    if (formMode === 'add') return 'Employees';
    if (formMode === 'edit') return 'Employees';
    if (activeTab === 'employees') return 'Employees';
    return activeTab.charAt(0).toUpperCase() + activeTab.slice(1);
  };

  return (
    <div className="app-container">
      {/* Sidebar with responsive mobile drawer support */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      <main className="main-content">
        <Header
          title={getHeaderTitle()}
          onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
          onAddEmployee={activeTab === 'employees' && !formMode ? handleOpenAddForm : null}
        />

        {/* 1. DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <>
            <section className="summary-cards-grid" aria-label="Employee summary counts">
              <DashboardCard
                title="Total Employees"
                count={totalEmployees}
                type="total"
              />
              <DashboardCard
                title="Active Employees"
                count={activeEmployees}
                type="active"
              />
              <DashboardCard
                title="Inactive Employees"
                count={inactiveEmployees}
                type="inactive"
              />
            </section>

            <div className="dashboard-panels-grid">
              {/* Department Count Progress Bars (Live counts) */}
              <section className="dashboard-panel" aria-labelledby="dept-breakdown-title">
                <div className="panel-header">
                  <h2 id="dept-breakdown-title" className="panel-title">
                    Department-wise employee count
                  </h2>
                </div>
                <div className="dept-bars-list">
                  {deptCounts.map((dept) => {
                    const fillPercentage = (dept.count / maxDeptCount) * 100;
                    return (
                      <div key={dept.name} className="dept-bar-item">
                        <div className="dept-bar-info">
                          <span className="dept-name">{dept.name}</span>
                          <span className="dept-count">{dept.count}</span>
                        </div>
                        <div
                          className="dept-progress-track"
                          role="progressbar"
                          aria-valuenow={dept.count}
                          aria-valuemin="0"
                          aria-valuemax={maxDeptCount}
                          aria-label={`${dept.name} employee count`}
                        >
                          <div
                            className="dept-progress-fill"
                            style={{ width: `${fillPercentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Recently Added Panel */}
              <section className="dashboard-panel" aria-labelledby="recent-employees-title">
                <div className="panel-header">
                  <h2 id="recent-employees-title" className="panel-title">
                    Recently added
                  </h2>
                  <button
                    type="button"
                    className="panel-action-link"
                    onClick={() => {
                      setActiveTab('employees');
                      setFormMode(null);
                    }}
                  >
                    View all employees
                  </button>
                </div>

                <ul className="recent-employees-list">
                  {recentEmployees.map((emp) => (
                    <li key={emp.id} className="recent-employee-item">
                      <div className="recent-employee-left">
                        <div className="initials-avatar">{getInitials(emp.name)}</div>
                        <div className="recent-employee-meta">
                          <span className="recent-employee-name">{emp.name}</span>
                          <span className="recent-employee-sub">
                            {emp.designation} · {emp.department}
                          </span>
                        </div>
                      </div>
                      <time className="recent-employee-date" dateTime={emp.joiningDate}>
                        {formatDate(emp.joiningDate)}
                      </time>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="add-employee-panel-btn"
                  onClick={handleOpenAddForm}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span>+ Add Employee</span>
                </button>
              </section>
            </div>
          </>
        )}

        {/* 2. EMPLOYEES VIEW: FORM (ADD / EDIT) */}
        {activeTab === 'employees' && formMode !== null && (
          <EmployeeForm
            mode={formMode}
            employeeToEdit={employeeToEdit}
            employeesList={employeeList}
            departments={departments}
            onSave={handleSaveEmployee}
            onCancel={handleCancelForm}
            onSelectEmployee={handleOpenEditForm}
            onAddNew={handleOpenAddForm}
            onRequestDelete={handleRequestDelete}
            successMessage={formSuccessMessage}
          />
        )}

        {/* 3. EMPLOYEES VIEW: LISTING, SEARCH, FILTERS, SORT & PAGINATION */}
        {activeTab === 'employees' && formMode === null && (
          <section className="employees-page-container" aria-label="Employees Directory">
            {/* Mobile Compact Metric Tiles (Screen 7) */}
            <div className="mobile-metric-tiles-bar" aria-label="Summary overview">
              <div className="mobile-metric-tile">
                <span className="mobile-metric-label">Total</span>
                <strong className="mobile-metric-value">{totalEmployees}</strong>
              </div>
              <div className="mobile-metric-tile">
                <span className="mobile-metric-label">Active</span>
                <strong className="mobile-metric-value">{activeEmployees}</strong>
              </div>
              <div className="mobile-metric-tile">
                <span className="mobile-metric-label">Inactive</span>
                <strong className="mobile-metric-value">{inactiveEmployees}</strong>
              </div>
            </div>

            {/* Desktop Top Header Bar with "+ Add Employee" button */}
            <div className="employees-top-bar">
              <div className="employees-filter-controls-row">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                />
                <FilterBar
                  departments={departments}
                  selectedDept={selectedDept}
                  onDeptChange={setSelectedDept}
                  selectedStatus={selectedStatus}
                  onStatusChange={setSelectedStatus}
                  onClearFilters={handleClearFilters}
                />
              </div>

              <button
                type="button"
                className="desktop-add-employee-btn"
                onClick={handleOpenAddForm}
              >
                + Add Employee
              </button>
            </div>

            {/* Content: Empty State OR Paginated Employee Table */}
            {sortedEmployees.length === 0 ? (
              <EmptyState
                searchQuery={searchQuery}
                selectedDept={selectedDept}
                selectedStatus={selectedStatus}
                onClearFilters={handleClearFilters}
                onAddEmployee={handleOpenAddForm}
              />
            ) : (
              <EmployeeTable
                employees={paginatedEmployees}
                totalEmployeesCount={totalFilteredRecords}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                startIndex={startIndex}
                endIndex={endIndex}
                sortOrder={sortOrder}
                onToggleSort={handleToggleSort}
                onEdit={handleOpenEditForm}
                onDelete={handleRequestDelete}
              />
            )}
          </section>
        )}

        {/* 4. PLACEHOLDER VIEWS */}
        {activeTab !== 'dashboard' && activeTab !== 'employees' && (
          <section className="dashboard-panel">
            <h2 className="panel-title">{getHeaderTitle()}</h2>
            <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>
              This section is a placeholder for future features.
            </p>
          </section>
        )}
      </main>

      {/* Confirmation Dialog for Delete */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        employee={employeeToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}
