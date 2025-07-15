import React from 'react';
import './Instructions.css';

interface InstructionsProps {
  instructions: string;
}

const Instructions: React.FC<InstructionsProps> = ({ instructions }) => (
  <div className="instructions-container">
    <h3 className="instructions-title">Instructions</h3>
    <p className="instructions-text">{instructions}</p>
  </div>
);

export default Instructions;
