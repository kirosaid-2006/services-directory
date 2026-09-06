import React, { useState } from 'react';
import { Star } from 'lucide-react';

const StarRating = ({
  rating = 0,
  interactive = false,
  onRatingChange = () => {},
  size = 'w-5 h-5'
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="flex items-center gap-1" dir="ltr">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled =
          (hoverRating || Math.round(rating)) >= star;

        return (
          <button
            type={interactive ? 'button' : undefined}
            key={star}
            disabled={!interactive}
            onClick={() => interactive && onRatingChange(star)}
            onMouseEnter={() => interactive && setHoverRating(star)}
            onMouseLeave={() => interactive && setHoverRating(0)}
            className={`${
              interactive ? 'cursor-pointer transition-transform hover:scale-110' : 'cursor-default'
            } p-0.5 focus:outline-none`}
          >
            <Star
              className={`${size} ${
                isFilled
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-300 fill-slate-100'
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
