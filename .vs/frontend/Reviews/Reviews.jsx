import React, { useState, useEffect, useContext } from 'react';
import './Reviews.css';
import { backend_url } from '../../App';
import { ShopContext } from '../../Context/ShopContext';
import toast, { Toaster } from 'react-hot-toast';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [userReview, setUserReview] = useState(null);
  
  const { products } = useContext(ShopContext);
  const token = localStorage.getItem('auth-token');

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${backend_url}/reviews/${productId}`);
      const data = await response.json();
      
      if (data.success) {
        setReviews(data.reviews);
        setAverageRating(data.averageRating);
        setTotalReviews(data.totalReviews);
        
        // Check if user has already reviewed this product
        if (token) {
          const userReview = data.reviews.find(review => {
            // We need to get the user ID from the token to check
            // For now, we'll check by user name (not ideal but works)
            return review.userName === localStorage.getItem('user-name');
          });
          setUserReview(userReview);
        }
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to leave a review', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
        },
        icon: '❌',
      });
      return;
    }

    if (!newReview.comment.trim()) {
      toast.error('Please enter a comment', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
        },
        icon: '❌',
      });
      return;
    }

    try {
      const response = await fetch(`${backend_url}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token,
        },
        body: JSON.stringify({
          productId,
          rating: newReview.rating,
          comment: newReview.comment.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Review added successfully!', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#4CAF50',
            color: '#fff',
          },
          icon: '✅',
        });
        
        setNewReview({ rating: 5, comment: '' });
        setShowReviewForm(false);
        fetchReviews(); // Refresh reviews
      } else {
        toast.error(data.error || 'Failed to add review', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#f44336',
            color: '#fff',
          },
          icon: '❌',
        });
      }
    } catch (error) {
      console.error('Error adding review:', error);
      toast.error('Failed to add review', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#f44336',
          color: '#fff',
        },
        icon: '❌',
      });
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <span
        key={index}
        className={`star ${index < rating ? 'filled' : ''}`}
      >
        ★
      </span>
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="reviews-loading">Loading reviews...</div>;
  }

  return (
    <div className="reviews-container">
      <Toaster />
      
      <div className="reviews-header">
        <h3>Customer Reviews</h3>
        <div className="reviews-summary">
          <div className="average-rating">
            <span className="rating-number">{averageRating.toFixed(1)}</span>
            <div className="stars">{renderStars(Math.round(averageRating))}</div>
          </div>
          <span className="total-reviews">({totalReviews} reviews)</span>
        </div>
      </div>

      {!userReview && token && (
        <div className="add-review-section">
          <button
            className="add-review-btn"
            onClick={() => setShowReviewForm(!showReviewForm)}
          >
            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
          </button>
          
          {showReviewForm && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="rating-input">
                <label>Rating:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-btn ${star <= newReview.rating ? 'active' : ''}`}
                      onClick={() => setNewReview({ ...newReview, rating: star })}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="comment-input">
                <label>Comment:</label>
                <textarea
                  value={newReview.comment}
                  onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  placeholder="Share your experience with this product..."
                  rows="4"
                  required
                />
              </div>
              
              <button type="submit" className="submit-review-btn">
                Submit Review
              </button>
            </form>
          )}
        </div>
      )}

      {userReview && (
        <div className="user-review-notice">
          <p>You have already reviewed this product</p>
        </div>
      )}

      <div className="reviews-list">
        {reviews.length === 0 ? (
          <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="review-item">
              <div className="review-header">
                <div className="reviewer-info">
                  <span className="reviewer-name">{review.userName}</span>
                  <div className="review-stars">{renderStars(review.rating)}</div>
                </div>
                <span className="review-date">{formatDate(review.date)}</span>
              </div>
              <p className="review-comment">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reviews;
