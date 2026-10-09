import React, { useState, useMemo } from 'react';
import { useApp } from '../context';
import { Modal } from './Layout';
import { formatDate } from '../utils';
import { Survey } from '../types';

export function Home() {
  const { currentUser, surveys, responses, deleteSurvey, duplicateSurvey, togglePublish, showToast } = useApp();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  if (!currentUser) return null;

  const userSurveys = surveys.filter(s => s.ownerId === currentUser.id);
  
  const filteredSurveys = useMemo(() => {
    return userSurveys.filter(s => {
      const matchSearch = s.title.toLowerCase().includes(search.toLowerCase()) ||
                          s.description.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === 'all' || 
                          (filter === 'published' && s.published) ||
                          (filter === 'draft' && !s.published);
      return matchSearch && matchFilter;
    });
  }, [userSurveys, search, filter]);

  const handleDelete = () => {
    if (deleteId) {
      deleteSurvey(deleteId);
      showToast('Опрос удалён', 'success');
      setDeleteId(null);
    }
  };

  const handleDuplicate = (id: string) => {
    duplicateSurvey(id);
    showToast('Опрос скопирован', 'success');
  };

  const handleTogglePublish = (id: string) => {
    togglePublish(id);
    showToast('Статус изменён', 'success');
  };

  const getResponseCount = (surveyId: string) => responses.filter(r => r.surveyId === surveyId).length;

  const getPublicLink = (survey: Survey) => {
    return `${window.location.origin}${window.location.pathname}#/survey/${survey.id}`;
  };

  const copyLink = (survey: Survey) => {
    navigator.clipboard.writeText(getPublicLink(survey));
    showToast('Ссылка скопирована!', 'success');
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">Мои опросы</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Управляйте своими опросами</p>
        </div>
        <a
          href="#/builder"
          className="px-5 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25 flex items-center gap-2"
        >
          <span>✨</span> Создать опрос
        </a>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-xl">
          {(['all', 'published', 'draft'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                filter === f 
                  ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              {f === 'all' ? 'Все' : f === 'published' ? '✅ Активные' : '📝 Черновики'}
            </button>
          ))}
        </div>
      </div>

      {/* Surveys Grid */}
      {filteredSurveys.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4">{search ? '🔍' : '📭'}</div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">
            {search ? 'Ничего не найдено' : 'Пока нет опросов'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {search ? 'Попробуйте изменить запрос' : 'Создайте свой первый опрос!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurveys.map((survey, idx) => (
            <div
              key={survey.id}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex gap-1.5 flex-wrap">
                  {survey.published ? (
                    <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full">✅ Активен</span>
                  ) : (
                    <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">📝 Черновик</span>
                  )}
                  {survey.isPublic && (
                    <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">🌐 Публичный</span>
                  )}
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
                  {getResponseCount(survey.id)} отв.
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1 line-clamp-1">{survey.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-3 line-clamp-2 flex-1">{survey.description}</p>

              <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 mb-4">
                <span>{survey.questions.length} вопр.</span>
                <span>·</span>
                <span>{formatDate(survey.updatedAt)}</span>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                <a
                  href={`#/run/${survey.id}`}
                  className="px-3 py-1.5 rounded-full bg-indigo-500 text-white text-xs font-semibold hover:bg-indigo-600 transition-colors"
                >
                  ▶ Пройти
                </a>
                <a
                  href={`#/results/${survey.id}`}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  📊 Результаты
                </a>
                <a
                  href={`#/edit/${survey.id}`}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  ✎ Изменить
                </a>
                {survey.isPublic && survey.published && (
                  <button
                    onClick={() => copyLink(survey)}
                    className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                    title="Копировать ссылку"
                  >
                    🔗
                  </button>
                )}
                <button
                  onClick={() => handleDuplicate(survey.id)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title="Дублировать"
                >
                  📋
                </button>
                <button
                  onClick={() => handleTogglePublish(survey.id)}
                  className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  title={survey.published ? 'Снять с публикации' : 'Опубликовать'}
                >
                  {survey.published ? '🔽' : '🔼'}
                </button>
                <button
                  onClick={() => setDeleteId(survey.id)}
                  className="px-3 py-1.5 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!deleteId}
        title="Удалить опрос?"
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        confirmText="Удалить"
        confirmVariant="danger"
      >
        <p>Это действие нельзя отменить. Все ответы будут удалены.</p>
      </Modal>
    </div>
  );
}
