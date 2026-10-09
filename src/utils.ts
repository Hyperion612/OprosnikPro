import { User, Question, Survey, Response } from './types';

// Генерация уникального ID
export const uid = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
};

// Экранирование HTML
export const escapeHtml = (s: string | number | null | undefined): string => {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c] || c));
};

// Форматирование даты
export const formatDate = (ts: number): string => {
  return new Date(ts).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Улучшенное хэширование паролей с солью
export const hashPassword = async (password: string, salt: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// Генерация соли
export const generateSalt = (): string => {
  return crypto.getRandomValues(new Uint8Array(16)).reduce(
    (str, byte) => str + byte.toString(16).padStart(2, '0'),
    ''
  );
};

// Валидация email
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Валидация пароля
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Очистка имени файла
export const sanitizeFilename = (name: string): string => {
  return String(name).replace(/[^\wа-яА-ЯёЁ\-]+/gi, '_').slice(0, 60) || 'survey';
};

// Debounce
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Подсчёт статистики для опроса
export const calculateSurveyStats = (survey: Survey, responses: Response[]) => {
  const total = responses.length;
  
  const questionsStats = survey.questions.map((q) => {
    if (q.type === 'text') {
      const texts = responses
        .map((r) => r.answers[q.id])
        .filter((v) => typeof v === 'string' && (v as string).trim());
      return { question: q, total, texts: texts as string[] };
    }
    
    if (q.type === 'rating') {
      const ratings = responses
        .map((r) => r.answers[q.id])
        .filter((v) => typeof v === 'number' && v >= 1 && v <= 5) as number[];
      const counts = [0, 0, 0, 0, 0];
      ratings.forEach((r) => counts[r - 1]++);
      const percents = counts.map((c) => total ? Math.round((c / total) * 100) : 0);
      const average = ratings.length
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(2)
        : '0.00';
      return { question: q, total, counts, percents, average, ratingsCount: ratings.length };
    }
    
    // single choice
    const counts = new Array(q.options.length).fill(0);
    responses.forEach((r) => {
      const a = r.answers[q.id];
      if (typeof a === 'number' && a >= 0 && a < counts.length) counts[a]++;
    });
    const percents = counts.map((c) => total ? Math.round((c / total) * 100) : 0);
    return { question: q, total, counts, percents };
  });
  
  return { survey, total, questionsStats, responses };
};

// Экспорт в CSV
export const exportCSV = (survey: Survey, responses: Response[]) => {
  if (!responses.length) return;
  
  const headers = ['ID', 'Дата', 'Источник', 'Время (сек)'];
  survey.questions.forEach((q, i) => headers.push(`В${i + 1}: ${q.text.replace(/\s+/g, ' ').slice(0, 80)}`));
  
  const sorted = [...responses].sort((a, b) => a.createdAt - b.createdAt);
  const rows = sorted.map((r) => {
    const source = r.guest ? 'Гость' : 'Пользователь';
    const row = [r.id, formatDate(r.createdAt), source, r.duration || ''];
    survey.questions.forEach((q) => {
      const v = r.answers[q.id];
      if (v === undefined || v === null || v === '') row.push('');
      else if (q.type === 'single') row.push(q.options[v as number] || '');
      else if (q.type === 'rating') row.push(v + ' из 5');
      else row.push(String(v).replace(/\r?\n/g, ' '));
    });
    return row;
  });
  
  const escapeCsv = (val: any): string => {
    const s = String(val ?? '');
    if ( /[",;\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
    return s;
  };
  
  const csv = [headers, ...rows].map((r) => r.map(escapeCsv).join(';')).join('\r\n');
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, `${sanitizeFilename(survey.title)}-answers-${Date.now()}.csv`);
};

// Экспорт в JSON
export const exportJSON = (survey: Survey, responses: Response[]) => {
  const data = {
    survey: {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      questions: survey.questions,
    },
    responses: responses.map((r) => ({
      id: r.id,
      createdAt: new Date(r.createdAt).toISOString(),
      source: r.guest ? 'guest' : 'user',
      duration: r.duration,
      answers: r.answers,
    })),
    exportedAt: new Date().toISOString(),
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `${sanitizeFilename(survey.title)}-${Date.now()}.json`);
};

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
