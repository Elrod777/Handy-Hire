import React, { useState } from 'react';
import '../styles/reviewform.css';

const ReviewForm = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ rating, review_text: reviewText });
    setRating(5);
    setReviewText('');
  };

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <div className="rating-input">
        <label>Rating: </label>
        <select value={rating} onChange={(e) => setRating(parseInt(e.target.value))}>
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>{r} Stars</option>
          ))}
        </select>
      </div>
      <textarea
        value={reviewText}
        onChange={(e) => setReviewText(e.target.value)}
        placeholder="Write your review..."
        rows="4"
      />
      <button type="submit">Submit Review</button>
    </form>
  );
};

export default ReviewForm;