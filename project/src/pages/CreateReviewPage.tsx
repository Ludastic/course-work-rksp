import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createReview } from '../services/api';
import { ReviewFormData } from '../types';
import ReviewForm from '../components/ReviewForm';

const CreateReviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  
  const handleSubmit = async (formData: ReviewFormData) => {
    try {
      setError(null);
      console.log('Submitting review with data:', {
        title: formData.title,
        hasPhoto: !!formData.photoBase64,
        photoType: formData.photoContentType
      });
      
      const response = await createReview(formData);
      console.log('Review created successfully:', response);
      
      // Navigate back to home page after successful creation
      navigate('/');
    } catch (err) {
      console.error('Failed to create review:', err);
      setError(err instanceof Error ? err.message : 'Failed to create review');
    }
  };
  
  return (
    <div className="py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Write a Review</h1>
          <p className="text-gray-600">Share your experience with our products or services.</p>
        </div>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-600">{error}</p>
          </div>
        )}
        
        <div className="bg-white shadow-sm rounded-lg p-6">
          <ReviewForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

export default CreateReviewPage;