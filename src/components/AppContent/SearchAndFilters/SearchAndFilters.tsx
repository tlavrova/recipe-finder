import React from 'react';
import './SearchAndFilters.css';
import SearchBar from '../../SearchBar/SearchBar';
import AdvancedFilters from '../../AdvancedFilters/AdvancedFilters';

interface SearchAndFiltersProps {
  onSearch: (ingredients: string[]) => Promise<void>;
  onFilterChange: (cuisine: string | null, dietary: string[]) => void;
  showFavorites: boolean;
  onToggleFavorites: () => void;
}

/**
 * Search and filters UI component
 */
const SearchAndFilters: React.FC<SearchAndFiltersProps> = ({
  onSearch,
  onFilterChange,
  showFavorites,
  onToggleFavorites
}) => (
  <>
    <SearchBar onSearch={onSearch} />
    <AdvancedFilters onFilterChange={onFilterChange} />

    <div className="favorites-toggle-container">
      <button
        className={`favorites-toggle-btn ${showFavorites ? 'active' : ''}`}
        onClick={onToggleFavorites}
      >
        {showFavorites ? 'Show All Recipes' : 'Show Favorites'}
      </button>
    </div>
  </>
);

export default SearchAndFilters;
