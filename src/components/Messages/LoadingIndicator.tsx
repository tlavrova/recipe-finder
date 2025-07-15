import React from 'react';
import './LoadingIndicator.css';

/**
 * Loading indicator component
 */
const LoadingIndicator: React.FC = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading recipes...</p>
  </div>
);

export default LoadingIndicator;
