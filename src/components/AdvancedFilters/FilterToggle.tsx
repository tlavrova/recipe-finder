import React from 'react';
import './FilterToggle.css';

interface FilterToggleProps {
  isExpanded: boolean;
  onClick: () => void;
}

/**
 * Toggle button component for showing/hiding advanced filters
 */
const FilterToggle: React.FC<FilterToggleProps> = ({ isExpanded, onClick }) => (
  <button
    className="advanced-filters-toggle"
    onClick={onClick}
    aria-expanded={isExpanded}
  >
    {isExpanded ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
    <span className={`arrow-icon ${isExpanded ? 'up' : 'down'}`}></span>
  </button>
);

export default FilterToggle;
