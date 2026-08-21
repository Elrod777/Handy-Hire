import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as handypeopleService from '../services/handypeopleService';
import * as reviewsService from '../services/reviewsService';
import '../styles/handypersonprofile.css';

const HandypersonProfile = () => {
  const { id } = useParams();
  const [handyperson, setHandyperson] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const handypersonData = await handypeopleService.getHandypersonById(id);
        setHandyperson(handypersonData);
        const reviewsData = await reviewsService.getHandypersonReviews(id);
        setReviews(reviewsData);
      } catch (err) {
        setError('Error fetching handyperson data');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!handyperson) return <div className="error">Handyperson not found</div>;

  return (
    <div className="handyperson-profile">
      <div className="profile-header">
        {handyperson.profile_picture_url && (
          <img src={handyperson.profile_picture_url} alt={handyperson.first_name} className="profile-pic" />
        )}
        <div className="profile-info">
          <h1>{handyperson.first_name} {handyperson.last_name}</h1>
          <p className="rating">
            ⭐ {handyperson.average_rating ? handyperson.average_rating.toFixed(1) : 'No ratings'} 
            ({handyperson.total_reviews || 0} reviews)
          </p>
          {handyperson.bio && <p className="bio">{handyperson.bio}</p>}
        </div>
      </div>

      <div className="profile-content">
        {handyperson.specialties && handyperson.specialties.length > 0 && (
          <section className="specialties">
            <h2>Specialties</h2>
            <div className="specialty-badges">
              {handyperson.specialties.map((spec, idx) => (
                <span key={idx} className="specialty-badge">
                  {spec.specialty}
                  {spec.experience_years && ` (${spec.experience_years} yrs)`}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="reviews">
          <h2>Reviews ({reviews.length})</h2>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="review">
                <div className="review-header">
                  <strong>{review.first_name}</strong>
                  <span className="rating">{'⭐'.repeat(review.rating)}</span>
                </div>
                <p>{review.review_text}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default HandypersonProfile;