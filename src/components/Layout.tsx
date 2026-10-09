import React, { ReactNode, useState } from 'react';
import { useApp } from '../context';

export function Layout({ children }: { children: ReactNode }) {
  const { currentUser, logout, theme, toggleTheme, showToast } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <a href="#/" className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-xl no-underline">
            <span className="text-2xl">📊</span>
            <span>SurveyPro</span>
          </a>

          {currentUser && (
            <>
              <nav className="hidden md:flex gap-1 ml-4 flex-1">
                {currentUser.role === 'admin' && (
                  <a href="#/admin" className="nav-btn">🛡️ Админ</a>
                )}
                <a href="#/home" className="nav-btn">📝 Опросы</a>
                <a href="#/stats" className="nav-btn">📈 Статистика</a>
              </nav>

              <div className="hidden md:flex items-center gap-3 ml-auto">
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-lg"
                  title="Сменить тему"
                >
                  {theme === 'light' ? '🌙' : '☀️'}
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    currentUser.role === 'admin' 
                      ? 'bg-gradient-to-br from-amber-500 to-red-500' 
                      : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                  }`}>
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{currentUser.name}</span>
                  {currentUser.role === 'admin' && (
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full uppercase">admin</span>
                  )}
                </div>
                <button
                  onClick={() => { logout(); showToast('Вы вышли из системы', 'success'); }}
                  className="text-sm px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Выйти
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden ml-auto p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <svg className="w-6 h-6 text-slate-700 dark:text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && currentUser && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3 space-y-2">
            {currentUser.role === 'admin' && (
              <a href="#/admin" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">🛡️ Админ-панель</a>
            )}
            <a href="#/home" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">📝 Мои опросы</a>
            <a href="#/stats" className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">📈 Статистика</a>
            <button
              onClick={toggleTheme}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
            >
              {theme === 'light' ? '🌙 Тёмная тема' : '☀️ Светлая тема'}
            </button>
            <button
              onClick={() => { logout(); showToast('Вы вышли', 'success'); }}
              className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600"
            >
              🚪 Выйти
            </button>
          </div>
        )}
      </header>

      {/* Main */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
        <p>© 2025 SurveyPro · Данные хранятся локально в вашем браузере</p>
      </footer>

      {/* Toasts */}
      <Toasts />
    </div>
  );
}

function Toasts() {
  const { toasts, removeToast } = useApp();
  
  return (
    <div className="fixed top-20 right-4 z-[9999] flex flex-col gap-2" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-slide-in max-w-xs cursor-pointer ${
            toast.type === 'success' ? 'bg-emerald-500' :
            toast.type === 'error' ? 'bg-red-500' :
            'bg-slate-800'
          }`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}

export function Modal({ 
  open, 
  title, 
  children, 
  onClose, 
  onConfirm, 
  confirmText = 'Подтвердить',
  confirmVariant = 'danger'
}: { 
  open: boolean; 
  title: string; 
  children: ReactNode; 
  onClose: () => void; 
  onConfirm?: () => void;
  confirmText?: string;
  confirmVariant?: 'danger' | 'primary';
}) {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9998] p-4 animate-fade-in" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <div className="text-slate-600 dark:text-slate-300 mb-5">{children}</div>
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-medium">
            Отмена
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-full text-white font-medium transition-colors ${
                confirmVariant === 'danger' ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600'
              }`}
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
