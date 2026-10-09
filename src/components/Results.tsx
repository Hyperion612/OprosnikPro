import React, { useEffect, useRef } from 'react';
import { useApp } from '../context';
import { calculateSurveyStats, exportCSV, exportJSON, formatDate } from '../utils';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface ResultsProps {
  surveyId: string;
}

export function Results({ surveyId }: ResultsProps) {
  const { currentUser, getSurvey, getResponses, showToast } = useApp();
  const survey = getSurvey(surveyId);
  const responses = getResponses(surveyId);

  if (!survey) {
    return (
      <div className="text-center py-16 animate-fade-in">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200">Опрос не найден</h2>
        <a href="#/home" className="inline-block mt-4 px-5 py-2 rounded-full bg-indigo-500 text-white font-semibold">Назад</a>
      </div>
    );
  }

  const stats = calculateSurveyStats(survey, responses);

  const handleExportCSV = () => {
    exportCSV(survey, responses);
    showToast('CSV экспортирован', 'success');
  };

  const handleExportJSON = () => {
    exportJSON(survey, responses);
    showToast('JSON экспортирован', 'success');
  };

  const palette = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#84cc16'];

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <a href="#/home" className="text-sm text-indigo-500 hover:text-indigo-600 mb-1 inline-block">← Назад к опросам</a>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{survey.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Результаты опроса</p>
        </div>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700">
            📥 CSV
          </button>
          <button onClick={handleExportJSON} className="px-4 py-2 rounded-full border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700">
            📥 JSON
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-2xl p-6 mb-6 text-center">
        <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Всего ответов</p>
        <p className="text-4xl font-extrabold text-indigo-700 dark:text-indigo-300 my-2">{stats.total}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {survey.questions.length} вопросов · Создан {formatDate(survey.createdAt)}
        </p>
      </div>

      {/* Questions Stats */}
      <div className="space-y-4">
        {stats.questionsStats.map((qs, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <span className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm font-bold">
                {idx + 1}
              </span>
              <h3 className="font-bold text-slate-900 dark:text-white">{qs.question.text}</h3>
              {qs.question.type === 'text' && (
                <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">Текст</span>
              )}
              {qs.question.type === 'rating' && 'average' in qs && (
                <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">
                  Среднее: {qs.average} ★
                </span>
              )}
              {qs.question.type === 'single' && (
                <span className="text-[10px] font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full">Один вариант</span>
              )}
            </div>

            {/* Text answers */}
            {qs.question.type === 'text' && 'texts' in qs && qs.texts && (
              <div>
                {qs.texts.length > 0 ? (
                  <div className="space-y-2">
                    {qs.texts.slice(0, 20).map((t, i) => (
                      <div key={i} className="bg-slate-50 dark:bg-slate-700 rounded-xl p-3 text-sm text-slate-700 dark:text-slate-200 border-l-3 border-l-indigo-400">
                        {t}
                      </div>
                    ))}
                    {qs.texts.length > 20 && (
                      <p className="text-xs text-slate-400 mt-2">...и ещё {qs.texts.length - 20} ответов</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Пока нет ответов</p>
                )}
              </div>
            )}

            {/* Rating */}
            {qs.question.type === 'rating' && 'counts' in qs && qs.counts && qs.percents && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {['1 ★', '2 ★', '3 ★', '4 ★', '5 ★'].map((label, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 dark:text-slate-300 w-8">{label}</span>
                      <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                          style={{ width: `${qs.percents![i]}%` }}
                        >
                          {qs.percents![i] > 15 && <span className="text-[10px] text-white font-bold">{qs.percents![i]}%</span>}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 w-16 text-right">
                        {qs.percents![i]}% <span className="text-slate-400 font-normal">({qs.counts![i]})</span>
                      </span>
                    </div>
                  ))}
                  <p className="text-xs text-slate-400 mt-2">Оценили: {'ratingsCount' in qs ? qs.ratingsCount : 0} из {qs.total}</p>
                </div>
                <div className="h-52">
                  <Bar
                    data={{
                      labels: ['1 ★', '2 ★', '3 ★', '4 ★', '5 ★'],
                      datasets: [{
                        data: qs.counts,
                        backgroundColor: ['#ef4444', '#f59e0b', '#eab308', '#84cc16', '#10b981'],
                        borderRadius: 8,
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
                    }}
                  />
                </div>
              </div>
            )}

            {/* Single choice */}
            {qs.question.type === 'single' && 'counts' in qs && qs.counts && qs.percents && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {qs.question.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <span className="text-sm text-slate-600 dark:text-slate-300 w-32 truncate" title={opt}>{opt}</span>
                      <div className="flex-1 h-6 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                          style={{ width: `${qs.percents![i]}%` }}
                        >
                          {qs.percents![i] > 15 && <span className="text-[10px] text-white font-bold">{qs.percents![i]}%</span>}
                        </div>
                      </div>
                      <span className="text-sm font-bold text-slate-600 dark:text-slate-300 w-16 text-right">
                        {qs.percents![i]}% <span className="text-slate-400 font-normal">({qs.counts![i]})</span>
                      </span>
                    </div>
                  ))}
                  <p className="text-xs text-slate-400 mt-2">Ответили: {qs.total}</p>
                </div>
                <div className="h-52">
                  <Doughnut
                    data={{
                      labels: qs.question.options,
                      datasets: [{
                        data: qs.counts,
                        backgroundColor: qs.question.options.map((_, i) => palette[i % palette.length]),
                        borderWidth: 2,
                        borderColor: '#fff',
                      }],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { position: 'bottom', labels: { boxWidth: 12, font: { size: 11 } } },
                      },
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Responses Table */}
      {responses.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">📋 Все ответы</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700">
                  <th className="px-3 py-2 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">#</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Дата</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Время</th>
                  <th className="px-3 py-2 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase">Источник</th>
                  {survey.questions.map((q, i) => (
                    <th key={i} className="px-3 py-2 text-left font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase whitespace-nowrap">
                      В{i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[...responses].sort((a, b) => b.createdAt - a.createdAt).map((r, idx) => (
                  <tr key={r.id} className="border-t border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-3 py-2 text-slate-400">{idx + 1}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300 whitespace-nowrap">{formatDate(r.createdAt)}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{r.duration ? `${r.duration}с` : '—'}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{r.guest ? '🔗 Гость' : '👤 Юзер'}</td>
                    {survey.questions.map((q, qi) => {
                      const v = r.answers[q.id];
                      let display = '—';
                      if (v !== undefined && v !== null && v !== '') {
                        if (q.type === 'single') display = q.options[v as number] ?? '—';
                        else if (q.type === 'rating') display = v + ' ★';
                        else display = String(v);
                      }
                      return <td key={qi} className="px-3 py-2 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">{display}</td>;
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
