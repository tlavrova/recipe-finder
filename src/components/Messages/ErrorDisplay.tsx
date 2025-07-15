import React from 'react';
import './ErrorDisplay.css';

interface ErrorDisplayProps {
  message: string;
}

/**
 * Error display component
 */
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => (
  <div className="error-container">
    <p>{message}</p>
    <button onClick={() => window.location.reload()}>Try Again</button>
  </div>
);

export default ErrorDisplay;
