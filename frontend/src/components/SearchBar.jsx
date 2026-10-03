import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = "Search events by title, topic, or organizer..." }) => {
  return (
    <div className="search-bar-wrapper">
      <Search size={18} className="search-bar-icon" />
      <input
        type="text"
        className="search-bar-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="search-clear-btn"
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
