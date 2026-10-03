import React from 'react';
import { Filter as FilterIcon, RotateCcw } from 'lucide-react';

const CATEGORIES = [
  'Technical',
  'Cultural',
  'Sports',
  'Workshop',
  'Seminar',
  'Hackathon',
  'Club Activity',
  'Other',
];

const STATUSES = ['UPCOMING', 'ONGOING', 'COMPLETED', 'CANCELLED'];

const Filter = ({
  category,
  onCategoryChange,
  status,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onReset,
}) => {
  const hasActiveFilters = category || status || startDate || endDate;

  return (
    <div className="filter-container">
      <div className="filter-header-row">
        <div className="filter-heading">
          <FilterIcon size={16} />
          <span>Filter Events</span>
        </div>
        {hasActiveFilters && (
          <button onClick={onReset} className="filter-reset-btn" type="button">
            <RotateCcw size={14} />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      <div className="filter-fields-grid">
        {/* Category Filter */}
        <div className="filter-item">
          <label className="filter-label">Category</label>
          <select
            className="filter-select"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="filter-item">
          <label className="filter-label">Status</label>
          <select
            className="filter-select"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            <option value="">All Statuses</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>

        {/* Start Date */}
        <div className="filter-item">
          <label className="filter-label">From Date</label>
          <input
            type="date"
            className="filter-date-input"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
          />
        </div>

        {/* End Date */}
        <div className="filter-item">
          <label className="filter-label">To Date</label>
          <input
            type="date"
            className="filter-date-input"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default Filter;
