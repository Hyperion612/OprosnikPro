import React from 'react';
import { useApp } from '../context';

export function Stats() {
  const { currentUser, surveys, responses } = useApp();

  if (!currentUser) return null;

  const userSurveys = surveys.filter(s => s.ownerId === currentUser.id);
  const userResponses = responses.filter(r => r.userId === currentUser.id);
  const totalResponsesToMySurveys = responses.filter(r => 
    userSurveys.some(s => s.id === r.surveyId)
  ).length;

  const publishedCount = userSurveys.filter(s => s.published).length;
  const draftCount = userSurveys.filter(s => !s.published).length;

  // Средняя оценка по всем рейтингам
  let totalRating = 0;
  let ratingCount = 0;
  userSurveys.forEach(survey => {
    const surveyResponses = responses.filter(r => r.surveyId === survey.id);
    survey.questions.forEach(q => {
      if (q.type === 'rating') {
        surveyResponses.forEach(r => {
          const val = r.answers[q.id];
          if (typeof val === 'number' && val >= 1 && val <= 5) {
            totalRating += val;
            ratingCount++;
          }
        });
      }
    });
  });
  const avgRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(1) : '—';

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">📈 Моя статистика</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Обзор вашей активности</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl font-extrabold text-indigo-500">{userSurveys.length}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Всего опросов</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl font-extrabold text-emerald-500">{publishedCount}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Опубликовано</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl font-extrabold text-amber-500">{totalResponsesToMySurveys}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ответов получено</div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center hover:shadow-lg transition-shadow">
          <div className="text-3xl font-extrabold text-amber-400">{avgRating}</div>
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Средний рейтинг ★</div>
        </div>
      </div>

      {/* My Surveys Overview */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Мои опросы</h2>
        {userSurveys.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">У вас пока нет опросов</p>
        ) : (
          <div className="space-y-3">
            {userSurveys.map(survey => {
              const surveyResponses = responses.filter(r => r.surveyId === survey.id);
              return (
                <div key={survey.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${survey.published ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{survey.title}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{survey.questions.length} вопросов</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-indigo-500">{surveyResponses.length} отв.</span>
                    <a href={`#/results/${survey.id}`} className="text-xs px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors">
                      Подробнее
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Activity */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Моя активность</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
            <div className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{userResponses.length}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Моих ответов</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
            <div className="text-2xl font-extrabold text-purple-600 dark:text-purple-400">{draftCount}</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Черновиков</div>
          </div>
          <div className="text-center p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
            <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {userSurveys.filter(s => s.isPublic).length}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Публичных</div>
          </div>
        </div>
      </div>
    </div>
  );
}
