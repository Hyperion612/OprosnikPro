import React, { useState } from 'react';
import { useApp } from '../context';
import { isValidEmail, isValidPassword } from '../utils';

export function Auth() {
  const { login, register, showToast } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (mode === 'register') {
        if (!name.trim()) throw new Error('Введите имя');
        if (!isValidEmail(email)) throw new Error('Некорректный email');
        if (!isValidPassword(password)) throw new Error('Пароль должен быть не менее 6 символов');
        await register(name, email, password);
        showToast('Регистрация успешна!', 'success');
      } else {
        if (!isValidEmail(email)) throw new Error('Некорректный email');
        if (!password) throw new Error('Введите пароль');
        await login(email, password);
        showToast('Добро пожаловать!', 'success');
      }
      window.location.hash = '#/home';
    } catch (err: any) {
      showToast(err.message || 'Ошибка', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 p-8">
        <div className="text-center mb-6">
          <div className="text-4xl mb-3">📊</div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">SurveyPro</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Платформа для создания опросов</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-full mb-6">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
              mode === 'login' 
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Вход
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-2.5 rounded-full text-sm font-semibold transition-all ${
              mode === 'register' 
                ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            Регистрация
          </button>
        </div>

        {/* Demo hint */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-3 mb-5 text-xs text-indigo-700 dark:text-indigo-300">
          <strong className="block mb-1">🔑 Демо-аккаунты:</strong>
          <div>Админ: <code className="bg-white/50 dark:bg-black/20 px-1 rounded">admin@survey.pro</code> / <code className="bg-white/50 dark:bg-black/20 px-1 rounded">admin123</code></div>
          <div>Юзер: <code className="bg-white/50 dark:bg-black/20 px-1 rounded">user@survey.pro</code> / <code className="bg-white/50 dark:bg-black/20 px-1 rounded">user123</code></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                placeholder="Ваше имя"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="email@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Минимум 6 символов"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-base hover:from-indigo-600 hover:to-purple-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/25"
          >
            {loading ? '⏳ Загрузка...' : mode === 'login' ? 'Войти' : 'Зарегистрироваться'}
          </button>
        </form>
      </div>
    </div>
  );
}
