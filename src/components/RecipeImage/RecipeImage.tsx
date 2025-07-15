import React from 'react';
import './RecipeImage.css';

interface RecipeImageProps {
  src: string;
  alt: string;
}

const RecipeImage: React.FC<RecipeImageProps> = ({ src, alt }) => (
  <div className="recipe-image-container">
    <img
      src={src}
      alt={alt}
      className="recipe-image"
      loading="lazy"
      onError={(e) => {
        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=No+Image';
      }}
    />
  </div>
);

export default RecipeImage;
