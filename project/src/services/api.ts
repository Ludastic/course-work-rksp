// import { Review, ReviewFormData } from '../types';

// const API_URL = 'http://localhost:8080/api'; // Would point to your Spring Boot backend

// // Helper to include auth token in requests
// const getAuthHeaders = () => {
//   const token = localStorage.getItem('authToken');
//   return {
//     'Authorization': `Basic ${token}`,
//     'Content-Type': 'application/json',
//   };
// };

// // Reviews API
// export const getReviews = async (): Promise<Review[]> => {
//   // In a real app, this would fetch from your Spring Boot backend
//   // For demo purposes, we're returning mock data
//   return mockReviews;
// };

// export const createReview = async (reviewData: ReviewFormData): Promise<Review> => {
//   // In a real app, this would be a POST request to your backend
//   const user = JSON.parse(localStorage.getItem('user') || '{}');
  
//   const newReview: Review = {
//     id: Math.floor(Math.random() * 10000),
//     ...reviewData,
//     createdAt: new Date().toISOString(),
//     user,
//   };
  
//   // Add to mock data for demo purposes
//   mockReviews.push(newReview);
  
//   return newReview;
// };

// export const updateReview = async (id: number, reviewData: ReviewFormData): Promise<Review> => {
//   // In a real app, this would be a PUT request to your backend
//   const reviewIndex = mockReviews.findIndex(r => r.id === id);
//   if (reviewIndex === -1) throw new Error('Review not found');
  
//   const updatedReview = {
//     ...mockReviews[reviewIndex],
//     ...reviewData,
//   };
  
//   mockReviews[reviewIndex] = updatedReview;
  
//   return updatedReview;
// };

// export const deleteReview = async (id: number): Promise<void> => {
//   // In a real app, this would be a DELETE request to your backend
//   const reviewIndex = mockReviews.findIndex(r => r.id === id);
//   if (reviewIndex === -1) throw new Error('Review not found');
  
//   mockReviews.splice(reviewIndex, 1);
// };

// // File upload API
// export const uploadFile = async (file: File): Promise<{ url: string }> => {
//   // In a real app, this would upload to your Spring Boot backend
//   // For demo purposes, we create a fake URL
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       // Use Pexels random image as a placeholder
//       const randomId = Math.floor(Math.random() * 1000);
//       resolve({ url: `https://images.pexels.com/photos/${randomId}/pexels-photo-${randomId}.jpeg` });
//     }, 500);
//   });
// };

// // Mock data for demonstration
// let mockReviews: Review[] = [
//   {
//     id: 1,
//     title: "Excellent Customer Service",
//     text: "I had a wonderful experience with the customer support team. They were very helpful and resolved my issue quickly.",
//     rating: 5,
//     photoUrl: "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg",
//     createdAt: "2023-06-15T08:30:00.000Z",
//     user: {
//       id: 1,
//       username: "john_doe",
//       role: "ROLE_USER"
//     }
//   },
//   {
//     id: 2,
//     title: "Great Product Quality",
//     text: "The product quality exceeded my expectations. Definitely worth the price!",
//     rating: 4,
//     createdAt: "2023-06-10T14:20:00.000Z",
//     user: {
//       id: 2,
//       username: "jane_smith",
//       role: "ROLE_USER"
//     }
//   },
//   {
//     id: 3,
//     title: "Room for Improvement",
//     text: "While the product is good, there are a few areas where it could be improved. The user interface could be more intuitive.",
//     rating: 3,
//     photoUrl: "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg",
//     createdAt: "2023-06-08T11:45:00.000Z",
//     user: {
//       id: 3,
//       username: "admin_user",
//       role: "ROLE_ADMIN"
//     }
//   }
// ];
import { Review, ReviewFormData } from '../types';

const API_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Reviews API
export const getReviews = async (): Promise<Review[]> => {
  const response = await fetch(`${API_URL}/reviews`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }

  return response.json();
};

export const createReview = async (reviewData: ReviewFormData): Promise<Review> => {
  // Create review request object with base64 photo data
  const reviewRequest = {
    title: reviewData.title,
    text: reviewData.text,
    rating: reviewData.rating,
    photoBase64: reviewData.photoBase64,
    photoContentType: reviewData.photoContentType
  };

  console.log('Sending review request:', {
    title: reviewRequest.title,
    hasPhoto: !!reviewRequest.photoBase64,
    photoType: reviewRequest.photoContentType
  });

  const response = await fetch(`${API_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewRequest)
  });

  console.log('Response status:', response.status);
  console.log('Response headers:', Object.fromEntries(response.headers.entries()));

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Error response:', errorText);
    let errorMessage = 'Failed to create review';
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  const text = await response.text();
  console.log('Response body:', text);

  if (!text) {
    throw new Error('Empty response from server');
  }

  try {
    const responseData = JSON.parse(text);
    console.log('Parsed response data:', {
      id: responseData.id,
      title: responseData.title,
      hasPhoto: !!responseData.photoBase64,
      photoContentType: responseData.photoContentType,
      photoSize: responseData.photoBase64 ? responseData.photoBase64.length : 0,
      createdAt: responseData.createdAt
    });
    return responseData;
  } catch (e) {
    console.error('Failed to parse response:', text);
    throw new Error('Invalid response format from server');
  }
};

export const updateReview = async (id: number, reviewData: ReviewFormData): Promise<Review> => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to update review');
  }

  return response.json();
};

export const deleteReview = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to delete review');
  }
};

// File upload API
export const uploadFile = async (file: File): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = 'Failed to upload file';
    
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch (e) {
      errorMessage = errorText || errorMessage;
    }
    
    throw new Error(errorMessage);
  }

  const text = await response.text();
  console.log('Response body:', text);

  if (!text) {
    throw new Error('Empty response from server');
  }

  try {
    const responseData = JSON.parse(text);
    console.log('Parsed response data:', {
      id: responseData.id,
      title: responseData.title,
      hasPhoto: !!responseData.photoBase64,
      photoContentType: responseData.photoContentType,
      photoSize: responseData.photoBase64 ? responseData.photoBase64.length : 0,
      createdAt: responseData.createdAt
    });
    return responseData;
  } catch (e) {
    console.error('Failed to parse response:', text);
    throw new Error('Invalid response format from server');
  }
};

export const voteReview = async (reviewId: number, value: 1 | -1): Promise<Review> => {
  const response = await fetch(`${API_URL}/reviews/${reviewId}/vote`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ value }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to vote on review');
  }
  return response.json();
};