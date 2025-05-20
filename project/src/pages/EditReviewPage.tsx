import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getReviews, updateReview } from '../services/api';
import { Review, ReviewFormData } from '../types';
import ReviewForm from '../components/ReviewForm';
import { useAuth } from '../context/AuthContext';

const EditReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const reviewId = Number(id);
  const navigate = useNavigate();
  const { auth, isAdmin } = useAuth();
  
  const [review, setReview] = useState<Review | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const reviews = await getReviews();
        const foundReview = reviews.find(r => r.id === reviewId);
        
        if (!foundReview) {
          setError('Review not found');
        } else {
          // Check if user has permission to edit this review
          if (foundReview.user.id !== auth.user?.id && !isAdmin()) {
            setError('You do not have permission to edit this review');
            return;
          }
          
          setReview(foundReview);
        }
      } catch (err) {
        console.error('Failed to fetch review:', err);
        setError('Failed to load review data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReview();
  }, [reviewId, auth.user?.id, isAdmin]);
  
  const handleSubmit = async (formData: ReviewFormData) => {
    await updateReview(reviewId, formData);
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error || !review) {
    return (
      <div className="py-8 text-center">
        <div className="max-w-3xl mx-auto bg-white shadow-sm rounded-lg p-6">
          <h1 className="text-xl font-semibold text-red-600 mb-4">{error || 'Review not found'}</h1>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Go back to reviews
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Review</h1>
          <p className="text-gray-600">Update your review details below.</p>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-6">
          <ReviewForm initialData={review} onSubmit={handleSubmit} isEditing />
        </div>
      </div>
    </div>
  );
};

export default EditReviewPage;