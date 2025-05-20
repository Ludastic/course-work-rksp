import React, { useState } from 'react';
import { Review } from '../types';
import ReviewCard from './ReviewCard';
import { Filter, Search } from 'lucide-react';

interface ReviewListProps {
  reviews: Review[];
  onDelete: (id: number) => void;
  onVote?: (id: number, value: 1 | -1) => void;
  userVotes?: Record<number, 1 | -1>;
}

const ReviewList: React.FC<ReviewListProps> = ({ reviews, onDelete, onVote, userVotes }) => {
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'mostHelpful'>('date');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Sort and filter reviews
  const filteredReviews = reviews
    .filter(review => {
      // Filter by rating
      if (filterRating !== null && review.rating !== filterRating) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm.trim() !== '') {
        const term = searchTerm.toLowerCase();
        return (
          review.title.toLowerCase().includes(term) ||
          review.text.toLowerCase().includes(term) ||
          review.user.username.toLowerCase().includes(term)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'rating') {
        return b.rating - a.rating;
      } else if (sortBy === 'mostHelpful') {
        const bUp = (b.upvotes ?? 0), bDown = (b.downvotes ?? 0), aUp = (a.upvotes ?? 0), aDown = (a.downvotes ?? 0);
        return (bUp - bDown) - (aUp - aDown);
      } else {
        return 0;
      }
    });
  
  return (
    <div>
      <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Поиск отзывов..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Filter className="mr-2 h-5 w-5 text-gray-500" />
              <select
                className="border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'rating' | 'mostHelpful')}
              >
                <option value="date">Сначала новые</option>
                <option value="rating">По рейтингу</option>
                <option value="mostHelpful">Самые полезные</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-500">Оценка:</span>
              <select
                className="border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filterRating === null ? 'all' : filterRating}
                onChange={(e) => {
                  const value = e.target.value;
                  setFilterRating(value === 'all' ? null : Number(value));
                }}
              >
                <option value="all">Все</option>
                <option value="5">5 звезд</option>
                <option value="4">4 звезды</option>
                <option value="3">3 звезды</option>
                <option value="2">2 звезды</option>
                <option value="1">1 звезда</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      {filteredReviews.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 text-lg">Отзывы не найдены</p>
          <p className="text-gray-400 mt-2">Попробуйте изменить фильтры или поисковый запрос</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map(review => (
            <ReviewCard 
              key={review.id} 
              review={review} 
              onDelete={onDelete}
              onVote={onVote}
              votedValue={userVotes ? userVotes[review.id] : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;