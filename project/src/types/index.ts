export type User = {
  id: number;
  username: string;
  role: 'ROLE_USER' | 'ROLE_ADMIN';
};

export type Vote = {
  userId: number;
  value: 1 | -1;
};

export type Review = {
  id: number;
  title: string;
  text: string;
  rating: number;
  photoBase64?: string;
  photoContentType?: string;
  createdAt: string;
  user: User;
  upvotes: number;
  downvotes: number;
  votes?: Vote[];
};

export type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
};

export type ReviewFormData = {
  title: string;
  text: string;
  rating: number;
  photoBase64?: string;
  photoContentType?: string;
};