import React, { useState, useEffect } from 'react';
import { useApp } from '../context';
import { Question, QuestionType } from '../types';
import { uid } from '../utils';

interface BuilderProps {
  surveyId?: string;
}

export function Builder({ surveyId }: BuilderProps) {
  const { currentUser, getSurvey, createSurvey, updateSurvey, showToast } = useApp();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPublic, setIsPublic] = useState(true);
  const [published, setPublished] = useState(false);

  useEffect(() => {
    if (surveyId) {
      const survey = getSurvey(surveyId);
      if (survey) {
        setTitle(survey.title);
        setDescription(survey.description);
        setQuestions(survey.questions);
        setIsPublic(survey.isPublic);
        setPublished(survey.published);
      }
    }
  }, [surveyId, getSurvey]);

  if (!currentUser) return null;

  const addQuestion = (type: QuestionType) => {
    const newQ: Question = {
      id: uid(),
      type,
      text: '',
      required: true,
      options: type === 'single' ? ['', ''] : [],
    };
    setQuestions([...questions, newQ]);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    const idx = questions.findIndex(q => q.id === id);
    if (idx === -1) return;
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === questions.length - 1) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    const newQuestions = [...questions];
    [newQuestions[idx], newQuestions[newIdx]] = [newQuestions[newIdx], newQuestions[idx]];
    setQuestions(newQuestions);
  };

  const addOption = (qId: string) => {
    const q = questions.find(q => q.id === qId);
    if (q) updateQuestion(qId, { options: [...q.options, ''] });
  };

  const updateOption = (qId: string, optIdx: number, value: string) => {
    const q = questions.find(q => q.id === qId);
    if (q) {
      const newOpts = [...q.options];
      newOpts[optIdx] = value;
      updateQuestion(qId, { options: newOpts });
    }
  };

  const removeOption = (qId: string, optIdx: number) => {
    const q = questions.find(q => q.id === qId);
    if (q && q.options.length > 2) {
      updateQuestion(qId, { options: q.options.filter((_, i) => i !== optIdx) });
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      showToast('Введите название опроса', 'error');
      return;
    }
    if (questions.length === 0) {
      showToast('Добавьте хотя бы один вопрос', 'error');
      return;
    }
    const invalidQ = questions.find(q => !q.text.trim());
    if (invalidQ) {
      showToast('Заполните текст всех вопросов', 'error');
      return;
    }
    const invalidOpts = questions.find(q => q.type === 'single' && q.options.some(o => !o.trim()));
    if (invalidOpts) {
      showToast('Заполните все варианты ответов', 'error');
      return;
    }

    const data = { title, description, questions, isPublic, published };
    if (surveyId) {
      updateSurvey(surveyId, data);
      showToast('Опрос обновлён!', 'success');
    } else {
      createSurvey(data);
      showToast('Опрос создан!', 'success');
    }
    window.location.hash = '#/home';
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {surveyId ? '✎ Редактирование' : '✨ Новый опрос'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            {surveyId ? 'Измените параметры опроса' : 'Создайте свой опрос'}
          </p>
        </div>
        <a href="#/home" className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 text-sm">
          ← Назад
        </a>
      </div>

      {/* Basic Info */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Название</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Например: Опрос удовлетворённости"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Описание</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={3}
            placeholder="Краткое описание вашего опроса..."
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">🌐 Публичный опрос</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700 dark:text-slate-300">✅ Опубликовать сразу</span>
          </label>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4 mb-6">
        {questions.map((q, idx) => (
          <div key={q.id} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 border-l-4 border-l-indigo-500">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
                  {idx + 1}
                </span>
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">
                  {q.type === 'single' ? 'Один вариант' : q.type === 'rating' ? 'Рейтинг' : 'Текст'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => moveQuestion(q.id, 'up')} disabled={idx === 0} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-500">↑</button>
                <button onClick={() => moveQuestion(q.id, 'down')} disabled={idx === questions.length - 1} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30 text-slate-500">↓</button>
                <button onClick={() => removeQuestion(q.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">✕</button>
              </div>
            </div>

            <input
              type="text"
              value={q.text}
              onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-3"
              placeholder="Текст вопроса..."
            />

            {q.type === 'single' && (
              <div className="space-y-2">
                {q.options.map((opt, optIdx) => (
                  <div key={optIdx} className="flex gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => updateOption(q.id, optIdx, e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={`Вариант ${optIdx + 1}`}
                    />
                    {q.options.length > 2 && (
                      <button onClick={() => removeOption(q.id, optIdx)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 text-sm">✕</button>
                    )}
                  </div>
                ))}
                <button onClick={() => addOption(q.id)} className="text-sm text-indigo-500 hover:text-indigo-600 font-medium">
                  + Добавить вариант
                </button>
              </div>
            )}

            {q.type === 'rating' && (
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map(n => (
                  <span key={n} className="text-2xl text-amber-400">★</span>
                ))}
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">Оценка от 1 до 5</span>
              </div>
            )}

            {q.type === 'text' && (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                💬 Открытый текстовый ответ
              </div>
            )}

            <label className="flex items-center gap-2 mt-3 cursor-pointer">
              <input
                type="checkbox"
                checked={q.required}
                onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                className="w-4 h-4 rounded border-slate-300 text-indigo-500 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-600 dark:text-slate-400">Обязательный вопрос</span>
            </label>
          </div>
        ))}
      </div>

      {/* Add Question Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => addQuestion('single')} className="px-4 py-2 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors text-sm font-medium">
          + Один вариант
        </button>
        <button onClick={() => addQuestion('rating')} className="px-4 py-2 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors text-sm font-medium">
          + Рейтинг ★
        </button>
        <button onClick={() => addQuestion('text')} className="px-4 py-2 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-colors text-sm font-medium">
          + Текст 💬
        </button>
      </div>

      {/* Save Button */}
      <div className="flex gap-3">
        <button onClick={handleSave} className="px-6 py-3 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25">
          💾 {surveyId ? 'Сохранить' : 'Создать опрос'}
        </button>
        <a href="#/home" className="px-6 py-3 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          Отмена
        </a>
      </div>
    </div>
  );
}
