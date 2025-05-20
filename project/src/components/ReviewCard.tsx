import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Review } from '../types';
import StarRating from './ui/StarRating';
import Button from './ui/Button';
import { Edit, Trash2 } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
  onDelete: (id: number) => void;
  onVote?: (id: number, value: 1 | -1) => void;
  votedValue?: 1 | -1 | undefined;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onDelete, onVote, votedValue }) => {
  const { auth, isAdmin } = useAuth();
  
  const canModify = isAdmin() || auth.user?.id === review.user.id;
  const canVote = auth.isAuthenticated && (votedValue === undefined);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ru-RU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getImageUrl = (review: Review): string | undefined => {
    if (!review.photoBase64) return undefined;
    // If it's already a URL, return as is
    if (review.photoBase64.startsWith('http')) return review.photoBase64;
    // Create a data URL with the correct content type
    return `data:${review.photoContentType || 'image/jpeg'};base64,${review.photoBase64}`;
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      {review.photoBase64 && (
        <div className="h-48 overflow-hidden">
          <img 
            src={getImageUrl(review)} 
            alt={review.title} 
            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
            {review.title}
          </h3>
          <div className="flex-shrink-0">
            <StarRating value={review.rating} readOnly />
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-3">{review.text}</p>
        
        <div className="flex justify-between items-center text-sm text-gray-500">
          <div className="flex items-center">
            <span className="mr-2 font-medium">{review.user.username}</span>
            {review.user.role === 'ROLE_ADMIN' && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800">
                Админ
              </span>
            )}
          </div>
          <span>{formatDate(review.createdAt)}</span>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex space-x-2 items-center">
            <button
              className={`px-2 py-1 rounded ${votedValue === 1 ? 'bg-green-200' : 'bg-gray-100'} text-green-700`}
              disabled={!canVote}
              title={auth.isAuthenticated ? 'Полезно' : 'Войдите, чтобы голосовать'}
              onClick={() => onVote && onVote(review.id, 1)}
            >
              ▲ {review.upvotes ?? 0}
            </button>
            <button
              className={`px-2 py-1 rounded ${votedValue === -1 ? 'bg-red-200' : 'bg-gray-100'} text-red-700`}
              disabled={!canVote}
              title={auth.isAuthenticated ? 'Бесполезно' : 'Войдите, чтобы голосовать'}
              onClick={() => onVote && onVote(review.id, -1)}
            >
              ▼ {review.downvotes ?? 0}
            </button>
          </div>
          <span className="text-xs text-gray-400">{(review.upvotes ?? 0) - (review.downvotes ?? 0)} полезно</span>
        </div>
        
        {canModify && (
          <div className="mt-4 flex justify-end space-x-2">
            <Link to={`/reviews/edit/${review.id}`}>
              <Button variant="outline" size="sm" className="flex items-center">
                <Edit size={16} className="mr-1" />
                Редактировать
              </Button>
            </Link>
            <Button 
              variant="danger" 
              size="sm" 
              className="flex items-center"
              onClick={() => onDelete(review.id)}
            >
              <Trash2 size={16} className="mr-1" />
              Удалить
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;