import React from 'react';
import './CuisineSelector.css';
import { CuisineType } from '../../types/Recipe';

interface CuisineSelectorProps {
  cuisineTypes: CuisineType[];
  selectedCuisine: string | null;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

/**
 * Component for selecting cuisine type filters
 */
const CuisineSelector: React.FC<CuisineSelectorProps> = ({ cuisineTypes, selectedCuisine, onChange }) => (
  <div className="filter-section">
    <h3>Cuisine Type</h3>
    <select
      value={selectedCuisine || ''}
      onChange={onChange}
      className="cuisine-select"
      aria-label="Select cuisine type"
    >
      <option value="">All Cuisines</option>
      {cuisineTypes.map(cuisine => (
        <option key={cuisine} value={cuisine}>
          {cuisine}
        </option>
      ))}
    </select>
  </div>
);

export default CuisineSelector;
