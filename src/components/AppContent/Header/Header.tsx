import React from 'react';
import './Header.css';

/**
 * Header component
 */
const Header: React.FC = () => (
  <header className="app-header">
    <h1>Recipe Finder</h1>
    <p>Find delicious recipes based on ingredients you have!</p>
  </header>
);

export default Header;
