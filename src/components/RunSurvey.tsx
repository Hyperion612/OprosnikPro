import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context';
import { Survey, Question } from '../types';

interface RunSurveyProps {
  surveyId: string;
}

export function RunSurvey({ surveyId }: RunSurveyProps) {
  const { currentUser, getSurvey, addResponse, showToast } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [guestName, setGuestName] = useState('');
  const survey = getSurvey(surveyId);

  if (!survey || !survey.published) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="text-5xl mb-4">⛔</div>
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">Опрос недоступен</h2>
        <p className="text-slate-500 dark:text-slate-400">Этот опрос не опубликован или был удалён</p>
        <a href="#/" className="inline-block mt-4 px-5 py-2 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600">
          На главную
        </a>
      </div>
    );
  }

  const questions = survey.questions;
  const currentQ = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;
  const isLast = currentIdx === questions.length - 1;

  const setAnswer = (qId: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const canProceed = () => {
    if (!currentQ.required) return true;
    const val = answers[currentQ.id];
    if (val === undefined || val === null || val === '') return false;
    if (currentQ.type === 'single' && typeof val === 'number' && val < 0) return false;
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) {
      showToast('Ответьте на обязательный вопрос', 'error');
      return;
    }
    if (isLast) {
      handleSubmit();
    } else {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const handleSubmit = () => {
    if (!canProceed()) {
      showToast('Ответьте на обязательный вопрос', 'error');
      return;
    }
    const duration = Math.round((Date.now() - startTime) / 1000);
    addResponse(surveyId, answers, {
      userId: currentUser?.id || null,
      guest: currentUser ? null : (guestName || 'Аноним'),
      duration,
    });
    setSubmitted(true);
    showToast('Спасибо за ответ!', 'success');
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 animate-fade-in">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-2">Спасибо!</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Ваши ответы успешно сохранены</p>
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Время прохождения:</p>
          <p className="text-2xl font-bold text-indigo-500">{Math.round((Date.now() - startTime) / 1000)} сек</p>
        </div>
        <a href="#/" className="inline-block px-5 py-2.5 rounded-full bg-indigo-500 text-white font-semibold hover:bg-indigo-600 transition-colors">
          На главную
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{survey.title}</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">{survey.description}</p>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 min-w-[60px]">
          {currentIdx + 1} / {questions.length}
        </span>
        <div className="flex-1 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Guest name (if not logged in) */}
      {!currentUser && currentIdx === 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 mb-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Ваше имя (необязательно)</label>
          <input
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Аноним"
          />
        </div>
      )}

      {/* Question */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 mb-6 animate-slide-in">
        <div className="flex items-start gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold shrink-0">
            {currentIdx + 1}
          </span>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {currentQ.text}
              {currentQ.required && <span className="text-red-500 ml-1">*</span>}
            </h2>
          </div>
        </div>

        {/* Single choice */}
        {currentQ.type === 'single' && (
          <div className="space-y-2">
            {currentQ.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setAnswer(currentQ.id, idx)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3 ${
                  answers[currentQ.id] === idx
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                    : 'border-slate-200 dark:border-slate-600 hover:border-indigo-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                  answers[currentQ.id] === idx ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300 dark:border-slate-500'
                }`}>
                  {answers[currentQ.id] === idx && <span className="w-2 h-2 rounded-full bg-white" />}
                </span>
                <span className="text-slate-700 dark:text-slate-200">{opt}</span>
              </button>
            ))}
          </div>
        )}

        {/* Rating */}
        {currentQ.type === 'rating' && (
          <div>
            <div className="flex gap-2 mb-3">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  onClick={() => setAnswer(currentQ.id, n)}
                  className={`text-4xl transition-all hover:scale-110 ${
                    (answers[currentQ.id] as number) >= n ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {answers[currentQ.id] ? `${answers[currentQ.id]} из 5` : 'Нажмите на звезду для оценки'}
            </p>
          </div>
        )}

        {/* Text */}
        {currentQ.type === 'text' && (
          <textarea
            value={(answers[currentQ.id] as string) || ''}
            onChange={(e) => setAnswer(currentQ.id, e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            rows={4}
            placeholder="Ваш ответ..."
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-3">
        <button
          onClick={handlePrev}
          disabled={currentIdx === 0}
          className="px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Назад
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg shadow-indigo-500/25"
        >
          {isLast ? '✅ Отправить' : 'Далее →'}
        </button>
      </div>
    </div>
  );
}
