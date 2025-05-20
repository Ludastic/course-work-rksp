import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  readOnly?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  value = 0,
  onChange,
  readOnly = false
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const handleMouseEnter = (rating: number) => {
    if (readOnly) return;
    setHoverRating(rating);
  };
  
  const handleMouseLeave = () => {
    setHoverRating(0);
  };
  
  const handleClick = (rating: number) => {
    if (readOnly) return;
    onChange?.(rating);
  };
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((rating) => {
        const isActive = (hoverRating || value) >= rating;
        
        return (
          <Star
            key={rating}
            size={readOnly ? 20 : 24}
            className={`
              transition-colors 
              ${isActive ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
              ${!readOnly && 'cursor-pointer'}
              ${readOnly ? 'mr-1' : 'mr-2'}
            `}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(rating)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;