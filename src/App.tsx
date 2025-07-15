import React from 'react';
import './App.css';
import AppContent from './components/AppContent/AppContent';
import { FavoritesProvider } from './context/FavoritesContext';

/**
 * Main App component that provides the context
 */
const App: React.FC = () => {
  return (
    <FavoritesProvider>
      <AppContent />
    </FavoritesProvider>
  );
};

export default App;
