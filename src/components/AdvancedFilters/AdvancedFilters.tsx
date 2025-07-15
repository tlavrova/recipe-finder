import React, { useState } from 'react';
import './AdvancedFilters.css';
import { CuisineType, DietaryPreference } from '../../types/Recipe';

// Import components from separate files
import FilterToggle from './FilterToggle';
import CuisineSelector from './CuisineSelector';
import DietaryOptions from './DietaryOptions';

interface AdvancedFiltersProps {
  onFilterChange: (cuisineType: string | null, dietaryPreferences: string[]) => void;
}

// Main component
const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedDietary, setSelectedDietary] = useState<string[]>([]);

  // Available filter options
  const cuisineTypes: CuisineType[] = [
    'Italian', 'Mexican', 'Chinese', 'Indian',
    'Japanese', 'Thai', 'Mediterranean', 'American',
    'French', 'Other'
  ];

  const dietaryPreferences: DietaryPreference[] = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free',
    'Low-Carb', 'Keto', 'Paleo', 'Nut-Free'
  ];

  // Event handlers
  const toggleExpand = () => {
    setIsExpanded(prevState => !prevState);
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

  // Check if any filters are active
  const hasActiveFilters = selectedCuisine || selectedDietary.length > 0;

  return (
    <div className="advanced-filters">
      <FilterToggle isExpanded={isExpanded} onClick={toggleExpand} />

      {isExpanded && (
        <div className="filters-container">
          <CuisineSelector
            cuisineTypes={cuisineTypes}
            selectedCuisine={selectedCuisine}
            onChange={handleCuisineChange}
          />

          <DietaryOptions
            preferences={dietaryPreferences}
            selectedPreferences={selectedDietary}
            onPreferenceToggle={handleDietaryChange}
          />

          {hasActiveFilters && (
            <button
              className="clear-filters-btn"
              onClick={clearFilters}
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedFilters;
