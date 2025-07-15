import React from 'react';
import './AdvancedFilters.css';
import { DietaryPreference } from '../../types/Recipe';

interface DietaryOptionsProps {
  preferences: DietaryPreference[];
  selectedPreferences: string[];
  onPreferenceToggle: (preference: string) => void;
}

/**
 * Component for selecting dietary preference filters
 */
const DietaryOptions: React.FC<DietaryOptionsProps> = ({
  preferences,
  selectedPreferences,
  onPreferenceToggle
}) => (
  <div className="filter-section">
    <h3>Dietary Preferences</h3>
    <div className="dietary-options">
      {preferences.map(preference => (
        <label key={preference} className="dietary-option">
          <input
            type="checkbox"
            checked={selectedPreferences.includes(preference)}
            onChange={() => onPreferenceToggle(preference)}
            aria-label={preference}
          />
          <span>{preference}</span>
        </label>
      ))}
    </div>
  </div>
);

export default DietaryOptions;
