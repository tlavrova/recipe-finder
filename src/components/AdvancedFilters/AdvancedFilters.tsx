import React, { useState } from 'react';
import './AdvancedFilters.css';
import { CuisineType, DietaryPreference } from '../../types/Recipe';

interface AdvancedFiltersProps {
  onFilterChange: (cuisineType: string | null, dietaryPreferences: string[]) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  const cuisineTypes: CuisineType[] = [
    'Italian', 'Mexican', 'Chinese', 'Indian',
    'Japanese', 'Thai', 'Mediterranean', 'American',
    'French', 'Other'
  ];

  const dietaryPreferences: DietaryPreference[] = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
    'Low-Carb', 'Keto', 'Paleo', 'Nut-Free'
  ];

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleCuisineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value === '' ? null : event.target.value;
    setSelectedCuisine(value);
    onFilterChange(value, selectedDietary);
  };

  const handleDietaryChange = (preference: string) => {
    const updatedPreferences = selectedDietary.includes(preference)
      ? selectedDietary.filter(item => item !== preference)
      : [...selectedDietary, preference];

    setSelectedDietary(updatedPreferences);
    onFilterChange(selectedCuisine, updatedPreferences);
  };

  const clearFilters = () => {
    setSelectedCuisine(null);
    setSelectedDietary([]);
    onFilterChange(null, []);
  };

  return (
    <div className="advanced-filters">
      <button
        className="advanced-filters-toggle"
        onClick={toggleExpand}
        aria-expanded={isExpanded}
      >
        {isExpanded ? 'Hide Advanced Filters' : 'Show Advanced Filters'}
        <span className={`arrow-icon ${isExpanded ? 'up' : 'down'}`}></span>
      </button>

      {isExpanded && (
        <div className="filters-container">
          <div className="filter-section">
            <h3>Cuisine Type</h3>
            <select
              value={selectedCuisine || ''}
              onChange={handleCuisineChange}
              className="cuisine-select"
            >
              <option value="">All Cuisines</option>
              {cuisineTypes.map(cuisine => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h3>Dietary Preferences</h3>
            <div className="dietary-options">
              {dietaryPreferences.map(preference => (
                <label key={preference} className="dietary-option">
                  <input
                    type="checkbox"
                    checked={selectedDietary.includes(preference)}
                    onChange={() => handleDietaryChange(preference)}
                  />
                  <span>{preference}</span>
                </label>
              ))}
            </div>
          </div>

          {(selectedCuisine || selectedDietary.length > 0) && (
            <button className="clear-filters-btn" onClick={clearFilters}>
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
