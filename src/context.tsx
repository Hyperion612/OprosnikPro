import React, { createContext, useContext, useSyncExternalStore, useState, useCallback, ReactNode } from 'react';
import { dataStore } from './store';
import { User, Survey, Response, Question, Toast as ToastType } from './types';
import { uid } from './utils';

interface AppContextType {
  // Данные
  currentUser: User | null;
  surveys: Survey[];
  responses: Response[];
  users: User[];
  
  // Auth
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  
  // Surveys
  createSurvey: (data: { title: string; description: string; questions: Question[]; isPublic: boolean; published: boolean }) => Survey;
  updateSurvey: (id: string, data: { title: string; description: string; questions: Question[]; isPublic: boolean; published: boolean }) => void;
  deleteSurvey: (id: string) => void;
  duplicateSurvey: (id: string) => void;
  togglePublish: (id: string) => void;
  getSurvey: (id: string) => Survey | undefined;
  getResponses: (surveyId: string) => Response[];
  addResponse: (surveyId: string, answers: Record<string, string | number>, meta?: { userId?: string | null; guest?: string | null; duration?: number }) => void;
  
  // Admin
  deleteUser: (userId: string) => void;
  
  // Toast
  toasts: ToastType[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(
    (cb) => dataStore.subscribe(cb),
    () => dataStore.getState(),
    () => dataStore.getState()
  );
  
  const [toasts, setToasts] = useState<ToastType[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const currentUser = state.session ? state.users.find(u => u.id === state.session) || null : null;
  
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = uid();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);
  
  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', next);
      document.documentElement.dataset.theme = next;
      return next;
    });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    await dataStore.login(email, password);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await dataStore.register(name, email, password);
  }, []);

  const logout = useCallback(() => {
    dataStore.logout();
  }, []);

  const createSurvey = useCallback((data: { title: string; description: string; questions: Question[]; isPublic: boolean; published: boolean }) => {
    const user = dataStore.currentUser();
    if (!user) throw new Error('Не авторизован');
    return dataStore.createSurvey(data, user.id);
  }, []);

  const updateSurvey = useCallback((id: string, data: { title: string; description: string; questions: Question[]; isPublic: boolean; published: boolean }) => {
    dataStore.updateSurvey(id, data);
  }, []);

  const deleteSurvey = useCallback((id: string) => {
    dataStore.deleteSurvey(id);
  }, []);

  const duplicateSurvey = useCallback((id: string) => {
    const user = dataStore.currentUser();
    if (!user) throw new Error('Не авторизован');
    dataStore.duplicateSurvey(id, user.id);
  }, []);

  const togglePublish = useCallback((id: string) => {
    dataStore.togglePublish(id);
  }, []);

  const getSurvey = useCallback((id: string) => {
    return dataStore.getSurvey(id);
  }, []);

  const getResponses = useCallback((surveyId: string) => {
    return dataStore.getResponses(surveyId);
  }, []);

  const addResponse = useCallback((surveyId: string, answers: Record<string, string | number>, meta?: { userId?: string | null; guest?: string | null; duration?: number }) => {
    dataStore.addResponse(surveyId, answers, meta);
  }, []);

  const deleteUser = useCallback((userId: string) => {
    dataStore.deleteUser(userId);
  }, []);

  const value: AppContextType = {
    currentUser,
    surveys: state.surveys,
    responses: state.responses,
    users: state.users,
    login,
    register,
    logout,
    createSurvey,
    updateSurvey,
    deleteSurvey,
    duplicateSurvey,
    togglePublish,
    getSurvey,
    getResponses,
    addResponse,
    deleteUser,
    toasts,
    showToast,
    removeToast,
    theme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
