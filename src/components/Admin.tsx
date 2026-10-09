import React, { useState } from 'react';
import { useApp } from '../context';
import { Modal } from './Layout';
import { formatDate } from '../utils';

export function Admin() {
  const { currentUser, users, surveys, responses, deleteUser, deleteSurvey, showToast } = useApp();
  const [tab, setTab] = useState<'overview' | 'users' | 'surveys'>('overview');
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteSurveyId, setDeleteSurveyId] = useState<string | null>(null);

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="text-5xl mb-4">⛔</div>
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Доступ запрещён</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Эта страница доступна только администраторам</p>
        <a href="#/home" className="inline-block mt-4 px-5 py-2 rounded-full bg-indigo-500 text-white font-semibold">На главную</a>
      </div>
    );
  }

  const totalResponses = responses.length;
  const publishedSurveys = surveys.filter(s => s.published).length;

  const handleDeleteUser = () => {
    if (deleteUserId) {
      if (deleteUserId === currentUser.id) {
        showToast('Нельзя удалить самого себя', 'error');
        setDeleteUserId(null);
        return;
      }
      deleteUser(deleteUserId);
      showToast('Пользователь удалён', 'success');
      setDeleteUserId(null);
    }
  };

  const handleDeleteSurvey = () => {
    if (deleteSurveyId) {
      deleteSurvey(deleteSurveyId);
      showToast('Опрос удалён', 'success');
      setDeleteSurveyId(null);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">🛡️ Админ-панель</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Управление платформой</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-700 rounded-full mb-6 w-fit">
        {(['overview', 'users', 'surveys'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              tab === t ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {t === 'overview' ? '📊 Обзор' : t === 'users' ? '👥 Пользователи' : '📝 Опросы'}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center">
              <div className="text-3xl font-extrabold text-indigo-500">{users.length}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Пользователей</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center">
              <div className="text-3xl font-extrabold text-purple-500">{surveys.length}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Опросов</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center">
              <div className="text-3xl font-extrabold text-emerald-500">{totalResponses}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Ответов</div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 text-center">
              <div className="text-3xl font-extrabold text-amber-500">{publishedSurveys}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 mt-1">Опубликовано</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Последние ответы</h2>
            {responses.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-center py-4">Пока нет ответов</p>
            ) : (
              <div className="space-y-2">
                {[...responses].sort((a, b) => b.createdAt - a.createdAt).slice(0, 10).map(r => {
                  const survey = surveys.find(s => s.id === r.surveyId);
                  return (
                    <div key={r.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{survey?.title || 'Удалённый опрос'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{r.guest ? '🔗 Гость' : '👤 Пользователь'} · {formatDate(r.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Users */}
      {tab === 'users' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700">
                  <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Имя</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Роль</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Опросов</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Действия</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const userSurveysCount = surveys.filter(s => s.ownerId === user.id).length;
                  return (
                    <tr key={user.id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                            user.role === 'admin' ? 'bg-gradient-to-br from-amber-500 to-red-500' : 'bg-gradient-to-br from-indigo-500 to-purple-500'
                          }`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-slate-900 dark:text-white">{user.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.email}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' 
                            : 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{userSurveysCount}</td>
                      <td className="px-4 py-3">
                        {user.id !== currentUser.id && (
                          <button
                            onClick={() => setDeleteUserId(user.id)}
                            className="text-xs px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                          >
                            Удалить
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Surveys */}
      {tab === 'surveys' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700">
                  <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Название</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Владелец</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Статус</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Ответов</th>
                  <th className="px-4 py-3 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Действия</th>
                </tr>
              </thead>
              <tbody>
                {surveys.map(survey => {
                  const owner = users.find(u => u.id === survey.ownerId);
                  const surveyResponses = responses.filter(r => r.surveyId === survey.id).length;
                  return (
                    <tr key={survey.id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900 dark:text-white">{survey.title}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{owner?.name || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          survey.published 
                            ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' 
                            : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                        }`}>
                          {survey.published ? '✅ Активен' : '📝 Черновик'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{surveyResponses}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          <a href={`#/results/${survey.id}`} className="text-xs px-2 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors">
                            📊
                          </a>
                          <button
                            onClick={() => setDeleteSurveyId(survey.id)}
                            className="text-xs px-2 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-medium hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        open={!!deleteUserId}
        title="Удалить пользователя?"
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDeleteUser}
        confirmText="Удалить"
        confirmVariant="danger"
      >
        <p>Все опросы и ответы этого пользователя будут удалены.</p>
      </Modal>

      <Modal
        open={!!deleteSurveyId}
        title="Удалить опрос?"
        onClose={() => setDeleteSurveyId(null)}
        onConfirm={handleDeleteSurvey}
        confirmText="Удалить"
        confirmVariant="danger"
      >
        <p>Все ответы на этот опрос будут удалены.</p>
      </Modal>
    </div>
  );
}
