import React from 'react';

const SearchFilter = ({ searchTerm, onSearch, statusFilter, onStatusFilter }) => {
  return (
    <div className="search-filter">
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button
              className="clear-search"
              onClick={() => onSearch('')}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="filter-container">
        <label htmlFor="status-filter" className="filter-label">
          Status:
        </label>
        <select
          id="status-filter"
          value={statusFilter}
          onChange={(e) => onStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="development">Development</option>
          <option value="maintenance">Maintenance</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

export default SearchFilter;
