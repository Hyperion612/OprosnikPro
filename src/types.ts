export type QuestionType = 'single' | 'text' | 'rating';
export type UserRole = 'admin' | 'user';
export type ToastType = 'success' | 'error' | 'info';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: UserRole;
  createdAt: number;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  required: boolean;
  options: string[];
}

export interface Survey {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  questions: Question[];
  isPublic: boolean;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Response {
  id: string;
  surveyId: string;
  answers: Record<string, string | number>;
  userId: string | null;
  guest: string | null;
  createdAt: number;
  duration?: number;
}

export interface AppData {
  users: User[];
  surveys: Survey[];
  responses: Response[];
  session: string | null;
  version: number;
}

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}
