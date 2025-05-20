export interface Vote {
  userId: number;
  value: 1 | -1;
}

export interface Review {
  id: number;
  title: string;
  text: string;
  rating: number;
  photoBase64?: string;
  photoContentType?: string;
  createdAt: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
  upvotes: number;
  downvotes: number;
  votes?: Vote[];
}

export interface ReviewFormData {
  title: string;
  text: string;
  rating: number;
  photoBase64: string | File | undefined;
  photoContentType: string | undefined;
} 