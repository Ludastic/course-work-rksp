import React, { useState, useEffect } from 'react';
import { getReviews, deleteReview, voteReview } from '../services/api';
import { Review } from '../types';
import ReviewList from '../components/ReviewList';
import { MessageSquare, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomePage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userVotes, setUserVotes] = useState<Record<number, 1 | -1>>({});
  const { auth } = useAuth();
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const data = await getReviews();
        setReviews(data);
        // Set userVotes from review.votes if available
        if (auth.user) {
          const votes: Record<number, 1 | -1> = {};
          data.forEach(r => {
            if (r.votes) {
              const v = r.votes.find(vote => vote.userId === auth.user!.id);
              if (v) votes[r.id] = v.value;
            }
          });
          setUserVotes(votes);
        }
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
        setError('Failed to load reviews. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReviews();
  }, [auth.user]);
  
  const handleDeleteReview = async (id: number) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    try {
      await deleteReview(id);
      setReviews(reviews.filter(review => review.id !== id));
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Failed to delete review. Please try again.');
    }
  };
  
  const handleVote = async (id: number, value: 1 | -1) => {
    try {
      const updated = await voteReview(id, value);
      setReviews(reviews => reviews.map(r => r.id === id ? updated : r));
      setUserVotes(votes => ({ ...votes, [id]: value }));
    } catch (err) {
      alert('Ошибка при голосовании. Попробуйте позже.');
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div className="py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Customer Reviews</h1>
          <p className="text-gray-600">Discover what others are saying about our products and services.</p>
        </div>
        
        {auth.isAuthenticated && (
          <Link 
            to="/reviews/create"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Write a Review
          </Link>
        )}
      </div>
      
      {reviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm">
          <MessageSquare className="mx-auto h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-700">No reviews yet</h2>
          <p className="mt-2 text-gray-500">Be the first to share your experience!</p>
          
          {auth.isAuthenticated ? (
            <Link 
              to="/reviews/create"
              className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Write a Review
            </Link>
          ) : (
            <Link 
              to="/login"
              className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Login to Write a Review
            </Link>
          )}
        </div>
      ) : (
        <ReviewList
          reviews={reviews}
          onDelete={handleDeleteReview}
          onVote={handleVote}
          userVotes={userVotes}
        />
      )}
    </div>
  );
};

export default HomePage;