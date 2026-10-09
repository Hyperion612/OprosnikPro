import { useState } from 'react';

type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';
type Category = 'security' | 'architecture' | 'ux' | 'performance' | 'code-quality' | 'features';

interface Issue {
  id: number;
  title: string;
  severity: Severity;
  category: Category;
  description: string;
  code?: string;
  suggestion: string;
  improvedCode?: string;
}

const issues: Issue[] = [
  {
    id: 1,
    title: 'Крайне слабое хэширование паролей',
    severity: 'critical',
    category: 'security',
    description: 'Функция hashPassword использует простой алгоритм djb2, который легко обратим и не предназначен для хранения паролей. Любой злоумышленник может подобрать пароль за миллисекунды.',
    code: `const hashPassword = (pwd) => {
  let h = 0;
  for (let i = 0; i < pwd.length; i++) {
    h = ((h << 5) - h) + pwd.charCodeAt(i);
    h |= 0;
  }
  return 'h' + Math.abs(h).toString(36) + '_' + pwd.length;
};`,
    suggestion: 'Используйте Web Crypto API с PBKDF2 или bcrypt. Для клиентского хранилища — хотя бы SHA-256 с солью. Но лучше — никогда не хранить пароли на клиенте.',
    improvedCode: `// Используйте Web Crypto API
async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: encoder.encode(salt), iterations: 100000, hash: 'SHA-256' },
    keyMaterial, 256
  );
  return btoa(String.fromCharCode(...new Uint8Array(bits)));
}`
  },
  {
    id: 2,
    title: 'Данные хранятся только в localStorage',
    severity: 'critical',
    category: 'security',
    description: 'Все данные (пользователи, опросы, ответы) хранятся в localStorage браузера. Это означает: 1) Данные доступны любому JS-коду на странице (XSS-атака). 2) Данные теряаются при очистке кэша. 3) Нет синхронизации между устройствами. 4) Любой может подделать данные.',
    suggestion: 'Для production-приложения необходим бэкенд с базой данных (PostgreSQL, MongoDB) и API. Минимум — добавьте шифрование данных перед сохранением в localStorage.',
    improvedCode: `// Минимальное улучшение: шифрование данных
class SecureStorage {
  async save(data) {
    const json = JSON.stringify(data);
    const encoded = btoa(unescape(encodeURIComponent(json)));
    // Добавьте реальное шифрование через Web Crypto API
    localStorage.setItem(this.KEY, encoded);
  }
}`
  },
  {
    id: 3,
    title: 'Весь код в одном файле (~600 строк)',
    severity: 'high',
    category: 'architecture',
    description: 'Весь JavaScript-код находится в одном файле app.js. Это затрудняет поддержку, тестирование и масштабирование. Нет разделения на модули, компоненты или слои.',
    suggestion: 'Разделите код на модули: storage.js, auth.js, router.js, views/, components/, utils/. Используйте ES-модули или сборщик (Vite, Webpack).',
    improvedCode: `// Структура проекта:
// src/
//   ├── core/
//   │   ├── storage.ts    — работа с данными
//   │   ├── router.ts     — навигация
//   │   └── auth.ts       — аутентификация
//   ├── views/
//   │   ├── Home.tsx
//   │   ├── Builder.tsx
//   │   ├── Results.tsx
//   │   └── Admin.tsx
//   ├── components/
//   │   ├── SurveyCard.tsx
//   │   ├── QuestionBlock.tsx
//   │   └── Toast.tsx
//   └── types/
//       └── index.ts`
  },
  {
    id: 4,
    title: 'Нет TypeScript',
    severity: 'high',
    category: 'code-quality',
    description: 'Код написан на чистом JavaScript без типизации. Это приводит к ошибкам, которые можно обнаружить только в runtime. Нет автодополнения в IDE, нет проверки типов при компиляции.',
    suggestion: 'Мигрируйте на TypeScript. Определите интерфейсы для User, Survey, Question, Response. Это предотвратит множество ошибок.',
    improvedCode: `interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'admin' | 'user';
  createdAt: number;
}

interface Question {
  id: string;
  type: 'single' | 'text' | 'rating';
  text: string;
  required: boolean;
  options: string[];
}

interface Survey {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  questions: Question[];
  isPublic: boolean;
  published: boolean;
  createdAt: number;
  updatedAt: number;
}`
  },
  {
    id: 5,
    title: 'Нет тестов',
    severity: 'high',
    category: 'code-quality',
    description: 'В проекте полностью отсутствуют тесты. Нет unit-тестов для логики, нет интеграционных тестов для views, нет E2E-тестов для критических сценариев.',
    suggestion: 'Добавьте Vitest для unit-тестов, React Testing Library для компонентов, Playwright для E2E. Начните с тестирования критической логики: auth, storage, router.',
    improvedCode: `// Пример теста с Vitest
import { describe, it, expect, beforeEach } from 'vitest';
import { Data } from './core/data';

describe('Data.register', () => {
  beforeEach(() => localStorage.clear());

  it('создаёт пользователя с корректными данными', () => {
    const user = Data.register('Иван', 'test@test.com', 'pass123');
    expect(user.email).toBe('test@test.com');
    expect(user.role).toBe('user');
  });

  it('бросает ошибку при дублирующем email', () => {
    Data.register('Иван', 'test@test.com', 'pass123');
    expect(() => Data.register('Пётр', 'test@test.com', 'pass456'))
      .toThrow('уже существует');
  });
});`
  },
  {
    id: 6,
    title: 'Нет защиты от XSS при динамической вставке',
    severity: 'high',
    category: 'security',
    description: 'Хотя есть функция escapeHtml, она не используется во всех местах. Например, в некоторых местах innerHTML используется с данными, которые не проходят через escapeHtml. Также нет Content Security Policy.',
    suggestion: 'Добавьте CSP-заголовки. Убедитесь, что ВСЕ пользовательские данные проходят через escapeHtml. Рассмотрите использование textContent вместо innerHTML.',
    improvedCode: `// Добавьте CSP в HTML:
// <meta http-equiv="Content-Security-Policy" 
//   content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;">

// Всегда экранируйте:
function safeHtml(strings, ...values) {
  return strings.reduce((result, str, i) => 
    result + str + (values[i] ? escapeHtml(values[i]) : ''), '');
}`
  },
  {
    id: 7,
    title: 'Нет обработки ошибок на уровне приложения',
    severity: 'medium',
    category: 'code-quality',
    description: 'Ошибки обрабатываются только через try/catch в отдельных местах. Нет глобального обработчика ошибок, нет Error Boundary, нет логирования.',
    suggestion: 'Добавьте глобальный обработчик ошибок (window.onerror), Error Boundary для React-компонентов, систему логирования.',
    improvedCode: `// Глобальный обработчик ошибок
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Отправка в систему мониторинга (Sentry, etc.)
  ErrorLogger.capture(event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise:', event.reason);
  ErrorLogger.capture(event.reason);
});`
  },
  {
    id: 8,
    title: 'Нет debounce для автосохранения',
    severity: 'medium',
    category: 'performance',
    description: 'При каждом изменении вопроса в конструкторе происходит полный перерендер всех вопросов (renderQuestions()). Это неэффективно при большом количестве вопросов.',
    suggestion: 'Используйте debounce для сохранения, виртуализацию для длинных списков, и мемоизацию для тяжёлых вычислений.',
    improvedCode: `// Debounce для сохранения
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const debouncedSave = debounce(() => Data._persist(), 500);

// Используйте React state вместо прямого DOM-манипулирования
// Это позволит React оптимизировать рендеринг`
  },
  {
    id: 9,
    title: 'Нет валидации на стороне сервера',
    severity: 'high',
    category: 'security',
    description: 'Вся валидация происходит только на клиенте. Злоумышленник может отправить любые данные, обойдя все проверки. Нет ограничения длины текстовых полей на уровне хранения.',
    suggestion: 'При появлении бэкенда — дублируйте ВСЕ проверки на сервере. Добавьте sanitization для текстовых полей, ограничение размера данных.',
    improvedCode: `// На сервере (пример Express):
app.post('/api/surveys', (req, res) => {
  const { title, questions } = req.body;
  
  if (!title || title.length > 120) {
    return res.status(400).json({ error: 'Invalid title' });
  }
  if (!Array.isArray(questions) || questions.length > 30) {
    return res.status(400).json({ error: 'Too many questions' });
  }
  // ... дополнительная валидация
});`
  },
  {
    id: 10,
    title: 'Нет accessibility (a11y)',
    severity: 'medium',
    category: 'ux',
    description: 'Отсутствуют ARIA-атрибуты для большинства элементов. Нет управления фокусом при навигации. Нет skip-links. Кнопки без текстовых лейблов для скринридеров.',
    suggestion: 'Добавьте role, aria-label, aria-live для динамического контента. Реализуйте keyboard navigation. Добавьте skip-link.',
    improvedCode: `<!-- Skip link -->
<a href="#app" class="skip-link">Перейти к содержимому</a>

<!-- Кнопки с aria-label -->
<button aria-label="Удалить вопрос" class="btn-icon">✕</button>

<!-- Toast с aria-live -->
<div class="toast-container" aria-live="polite" aria-atomic="true">
</div>

<!-- Прогресс-бар -->
<div role="progressbar" aria-valuenow="\${progress}" 
     aria-valuemin="0" aria-valuemax="100">
</div>`
  },
  {
    id: 11,
    title: 'Нет темной темы',
    severity: 'low',
    category: 'ux',
    description: 'Приложение поддерживает только светлую тему. Многие пользователи предпочитают тёмную тему, особенно при работе в вечернее время.',
    suggestion: 'Используйте CSS custom properties для темизации. Добавьте переключатель темы с сохранением в localStorage.',
    improvedCode: `/* Тёмная тема через CSS-переменные */
[data-theme="dark"] {
  --bg: #0f172a;
  --surface: #1e293b;
  --text: #f1f5f9;
  --text-muted: #94a3b8;
  --border: #334155;
}

/* Переключатель */
<button onclick="toggleTheme()">🌓</button>

<script>
function toggleTheme() {
  const current = document.documentElement.dataset.theme;
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  localStorage.setItem('theme', next);
}
</script>`
  },
  {
    id: 12,
    title: 'Нет offline-режима и Service Worker',
    severity: 'low',
    category: 'performance',
    description: 'Приложение не работает без интернета (Chart.js загружается с CDN). Нет Service Worker для кеширования ресурсов.',
    suggestion: 'Добавьте Service Worker для кеширования статики. Рассмотрите PWA-манифест для установки как приложения.',
    improvedCode: `// sw.js
const CACHE = 'surveypro-v1';
const ASSETS = ['/', '/index.html', '/app.js', '/style.css'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});

// Регистрация
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}`
  },
  {
    id: 13,
    title: 'Нет пагинации и поиска в списках',
    severity: 'medium',
    category: 'features',
    description: 'Списки опросов и ответов отображаются целиком без пагинации, фильтрации или поиска. При большом количестве данных это приведёт к проблемам с производительностью и UX.',
    suggestion: 'Добавьте пагинацию (по 10-20 элементов), поиск по названию, фильтрацию по статусу и дате.',
    improvedCode: `// Пример пагинации
function Pagination({ total, page, perPage, onChange }) {
  const pages = Math.ceil(total / perPage);
  return (
    <div className="pagination">
      <button disabled={page === 1} onClick={() => onChange(page - 1)}>←</button>
      <span>{page} / {pages}</span>
      <button disabled={page === pages} onClick={() => onChange(page + 1)}>→</button>
    </div>
  );
}`
  },
  {
    id: 14,
    title: 'Нет системы уведомлений',
    severity: 'low',
    category: 'features',
    description: 'Пользователи не получают уведомлений о новых ответах на их опросы. Нет email-уведомлений, нет push-уведомлений.',
    suggestion: 'Добавьте email-уведомления (через SendGrid/Mailgun) или push-уведомления через Web Push API.',
    improvedCode: `// Web Push API
if ('Notification' in window && Notification.permission === 'granted') {
  new Notification('Новый ответ!', {
    body: 'На ваш опрос "Удовлетворённость" ответили',
    icon: '/icon.png',
    badge: '/badge.png'
  });
}

// Запрос разрешения
Notification.requestPermission();`
  },
  {
    id: 15,
    title: 'Нет README и документации',
    severity: 'medium',
    category: 'code-quality',
    description: 'В репозитории нет README.md, нет описания проекта, нет инструкций по установке и запуску. Нет документации API.',
    suggestion: 'Добавьте README.md с описанием проекта, скриншотами, инструкциями по установке, описанием архитектуры.',
    improvedCode: `# SurveyPro v4.2

Приложение для создания и проведения опросов.

## Возможности
- ✅ Создание опросов с 3 типами вопросов
- ✅ Публичные ссылки для анонимного прохождения
- ✅ Визуализация результатов (Chart.js)
- ✅ Экспорт в CSV/JSON
- ✅ Админ-панель
- ✅ Адаптивный дизайн

## Установка
\`\`\`bash
npm install
npm run dev
\`\`\`

## Демо
- Админ: admin@survey.pro / admin123
- Пользователь: user@survey.pro / user123`
  },
  {
    id: 16,
    title: 'Нет защиты от CSRF и rate limiting',
    severity: 'medium',
    category: 'security',
    description: 'Нет CSRF-токенов для форм. Нет ограничения количества попыток входа (brute-force). Нет rate limiting для API.',
    suggestion: 'Добавьте CSRF-токены, rate limiting (максимум 5 попыток входа за 15 минут), CAPTCHA после нескольких неудачных попыток.',
    improvedCode: `// Rate limiting для логина
const loginAttempts = new Map();

function checkRateLimit(email) {
  const attempts = loginAttempts.get(email) || { count: 0, firstAttempt: Date.now() };
  
  if (Date.now() - attempts.firstAttempt > 15 * 60 * 1000) {
    attempts.count = 0;
    attempts.firstAttempt = Date.now();
  }
  
  if (attempts.count >= 5) {
    throw new Error('Слишком много попыток. Подождите 15 минут.');
  }
  
  attempts.count++;
  loginAttempts.set(email, attempts);
}`
  },
  {
    id: 17,
    title: 'Использование innerHTML для рендеринга',
    severity: 'medium',
    category: 'architecture',
    description: 'Весь UI строится через innerHTML с шаблонными строками. Это опасно (XSS), неэффективно (полный перерендер) и сложно поддерживать.',
    suggestion: 'Мигрируйте на React/Vue/Svelte. Эти фреймворки обеспечивают безопасный рендеринг, виртуальный DOM и компонентный подход.',
    improvedCode: `// React-компонент вместо innerHTML
function SurveyCard({ survey, onRun, onEdit, onResults }) {
  return (
    <div className="survey-card">
      <div className="survey-badges">
        <Badge type="public">🌐 Опубликован</Badge>
        {survey.isMine && <Badge>✎ Мой</Badge>}
      </div>
      <h3>{survey.title}</h3>
      <p className="desc">{survey.description}</p>
      <div className="survey-actions">
        <Button onClick={() => onRun(survey.id)}>Пройти</Button>
        <Button onClick={() => onResults(survey.id)}>📊</Button>
        <Button onClick={() => onEdit(survey.id)}>✎</Button>
      </div>
    </div>
  );
}`
  },
  {
    id: 18,
    title: 'Нет версионирования данных (миграции)',
    severity: 'low',
    category: 'architecture',
    description: 'Ключ хранилища "surveypro_v4" предполагает версионирование, но нет механизма миграции данных между версиями. При изменении структуры данных пользователи потеряют информацию.',
    suggestion: 'Добавьте систему миграций: сохраняйте версию схемы данных и автоматически мигрируйте при обновлении.',
    improvedCode: `const MIGRATIONS = [
  {
    version: 5,
    migrate(data) {
      // Добавляем новое поле
      data.surveys = data.surveys.map(s => ({
        ...s,
        allowMultiple: false // новое поле
      }));
      return data;
    }
  }
];

function migrateData(data) {
  const currentVersion = data.version || 4;
  const migrations = MIGRATIONS.filter(m => m.version > currentVersion);
  
  return migrations.reduce((d, m) => {
    console.log(\`Migrating to v\${m.version}\`);
    return m.migrate(d);
  }, data);
}`
  }
];

const categoryLabels: Record<Category, string> = {
  'security': '🔒 Безопасность',
  'architecture': '🏗️ Архитектура',
  'ux': '🎨 UX/UI',
  'performance': '⚡ Производительность',
  'code-quality': '📝 Качество кода',
  'features': '✨ Функциональность'
};

const severityLabels: Record<Severity, { label: string; color: string; bg: string }> = {
  'critical': { label: 'Критический', color: 'text-red-700', bg: 'bg-red-100 border-red-200' },
  'high': { label: 'Высокий', color: 'text-orange-700', bg: 'bg-orange-100 border-orange-200' },
  'medium': { label: 'Средний', color: 'text-yellow-700', bg: 'bg-yellow-100 border-yellow-200' },
  'low': { label: 'Низкий', color: 'text-blue-700', bg: 'bg-blue-100 border-blue-200' },
  'info': { label: 'Инфо', color: 'text-gray-700', bg: 'bg-gray-100 border-gray-200' }
};

function CodeBlock({ code, title }: { code: string; title?: string }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 my-3">
      {title && (
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700">
          {title}
        </div>
      )}
      <pre className="bg-slate-900 text-slate-100 p-4 overflow-x-auto text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function IssueCard({ issue, isExpanded, onToggle }: { issue: Issue; isExpanded: boolean; onToggle: () => void }) {
  const sev = severityLabels[issue.severity];
  
  return (
    <div className={`border rounded-2xl overflow-hidden transition-all duration-200 ${isExpanded ? 'shadow-lg border-indigo-200' : 'shadow-sm border-slate-200 hover:shadow-md hover:border-slate-300'}`}>
      <button
        onClick={onToggle}
        className="w-full text-left p-5 flex items-start gap-4 hover:bg-slate-50 transition-colors"
      >
        <div className={`shrink-0 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${sev.bg} ${sev.color} border`}>
          {issue.id}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${sev.bg} ${sev.color}`}>
              {sev.label}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {categoryLabels[issue.category]}
            </span>
          </div>
          <h3 className="font-bold text-slate-900 text-lg">{issue.title}</h3>
        </div>
        <svg className={`w-5 h-5 text-slate-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-slate-100">
          <div className="mt-4">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <span className="text-red-500">⚠️</span> Проблема
            </h4>
            <p className="text-slate-600 leading-relaxed">{issue.description}</p>
            
            {issue.code && <CodeBlock code={issue.code} title="Текущий код" />}
          </div>
          
          <div className="mt-5">
            <h4 className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <span className="text-green-500">💡</span> Рекомендация
            </h4>
            <p className="text-slate-600 leading-relaxed">{issue.suggestion}</p>
            
            {issue.improvedCode && <CodeBlock code={issue.improvedCode} title="Пример улучшения" />}
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div className={`rounded-2xl p-5 border ${color} flex items-center gap-4`}>
      <div className="text-3xl">{icon}</div>
      <div>
        <div className="text-2xl font-extrabold">{value}</div>
        <div className="text-sm font-medium opacity-75">{label}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<Severity | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');

  const toggleIssue = (id: number) => {
    setExpandedIssues(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpandedIssues(new Set(issues.map(i => i.id)));
  const collapseAll = () => setExpandedIssues(new Set());

  const filteredIssues = issues.filter(i => {
    if (filter !== 'all' && i.severity !== filter) return false;
    if (categoryFilter !== 'all' && i.category !== categoryFilter) return false;
    return true;
  });

  const counts = {
    critical: issues.filter(i => i.severity === 'critical').length,
    high: issues.filter(i => i.severity === 'high').length,
    medium: issues.filter(i => i.severity === 'medium').length,
    low: issues.filter(i => i.severity === 'low').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-slate-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl">
              🔍
            </div>
            <div>
              <h1 className="font-extrabold text-xl text-slate-900">Code Review</h1>
              <p className="text-xs text-slate-500">SurveyPro v4.2</p>
            </div>
          </div>
          <a
            href="https://github.com/Hyperion612/Survey_Pro-v.2"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
            GitHub
          </a>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Project Overview */}
        <section className="mb-10">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <div className="flex items-start gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl shrink-0">
                📊
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">SurveyPro v4.2</h2>
                <p className="text-slate-500 mt-1">SPA для создания и проведения опросов</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xl">📁</span>
                <div>
                  <div className="text-sm font-bold text-slate-900">3 файла</div>
                  <div className="text-xs text-slate-500">HTML + CSS + JS</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xl">📏</span>
                <div>
                  <div className="text-sm font-bold text-slate-900">~650 строк JS</div>
                  <div className="text-xs text-slate-500">Один файл</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xl">🛠️</span>
                <div>
                  <div className="text-sm font-bold text-slate-900">Vanilla JS</div>
                  <div className="text-xs text-slate-500">Без фреймворков</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-xl">📦</span>
                <div>
                  <div className="text-sm font-bold text-slate-900">Chart.js</div>
                  <div className="text-xs text-slate-500">CDN зависимость</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
              <h3 className="font-bold text-green-800 mb-2 flex items-center gap-2">
                ✅ Что сделано хорошо
              </h3>
              <ul className="text-green-700 space-y-1 text-sm">
                <li>• Красивый и современный UI с анимациями</li>
                <li>• Адаптивный дизайн для мобильных устройств</li>
                <li>• Полноценный роутинг на hash-based навигации</li>
                <li>• Разделение ролей (admin/user) с защитой маршрутов</li>
                <li>• Экспорт данных в CSV и JSON</li>
                <li>• Визуализация результатов с графиками</li>
                <li>• Публичные ссылки для анонимного прохождения</li>
                <li>• Демо-данные для быстрого старта</li>
                <li>• Escape HTML для защиты от XSS (частично)</li>
                <li>• Модальные окна и toast-уведомления</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Summary Stats */}
        <section className="mb-8">
          <h2 className="text-xl font-extrabold text-slate-900 mb-4">📋 Сводка по замечаниям</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard icon="🔴" label="Критических" value={counts.critical} color="bg-red-50 border-red-200 text-red-800" />
            <SummaryCard icon="🟠" label="Высоких" value={counts.high} color="bg-orange-50 border-orange-200 text-orange-800" />
            <SummaryCard icon="🟡" label="Средних" value={counts.medium} color="bg-yellow-50 border-yellow-200 text-yellow-800" />
            <SummaryCard icon="🔵" label="Низких" value={counts.low} color="bg-blue-50 border-blue-200 text-blue-800" />
          </div>
        </section>

        {/* Priority Roadmap */}
        <section className="mb-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-slate-900 mb-4">🗺️ Дорожная карта улучшений</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-sm">1</div>
                  <div className="w-0.5 flex-1 bg-red-200 mt-2"></div>
                </div>
                <div className="pb-6">
                  <h3 className="font-bold text-slate-900">Немедленно (критическая безопасность)</h3>
                  <p className="text-sm text-slate-600 mt-1">Заменить хэширование паролей на PBKDF2/argon2. Добавить CSP-заголовки. Усилить валидацию XSS.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-sm">2</div>
                  <div className="w-0.5 flex-1 bg-orange-200 mt-2"></div>
                </div>
                <div className="pb-6">
                  <h3 className="font-bold text-slate-900">Срочно (1-2 недели)</h3>
                  <p className="text-sm text-slate-600 mt-1">Миграция на TypeScript. Разделение на модули. Добавление тестов. Настройка линтера и форматтера.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-yellow-500 text-white flex items-center justify-center font-bold text-sm">3</div>
                  <div className="w-0.5 flex-1 bg-yellow-200 mt-2"></div>
                </div>
                <div className="pb-6">
                  <h3 className="font-bold text-slate-900">Важно (2-4 недели)</h3>
                  <p className="text-sm text-slate-600 mt-1">Миграция на React. Добавление бэкенда. Пагинация и поиск. Accessibility.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm">4</div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Желательно (1-2 месяца)</h3>
                  <p className="text-sm text-slate-600 mt-1">PWA и offline-режим. Тёмная тема. Система уведомлений. Документация. CI/CD.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900">
              🔎 Замечания <span className="text-slate-400 font-normal text-base">({filteredIssues.length})</span>
            </h2>
            <div className="flex gap-2 flex-wrap">
              <button onClick={expandAll} className="text-xs px-3 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold hover:bg-indigo-200 transition-colors">
                Раскрыть все
              </button>
              <button onClick={collapseAll} className="text-xs px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition-colors">
                Свернуть все
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={() => setFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors border ${filter === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              Все
            </button>
            {(['critical', 'high', 'medium', 'low'] as Severity[]).map(sev => (
              <button
                key={sev}
                onClick={() => setFilter(sev)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors border ${filter === sev ? severityLabels[sev].bg + ' ' + severityLabels[sev].color : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                {severityLabels[sev].label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors border ${categoryFilter === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
            >
              Все категории
            </button>
            {(Object.keys(categoryLabels) as Category[]).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors border ${categoryFilter === cat ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
              >
                {categoryLabels[cat]}
              </button>
            ))}
          </div>
        </section>

        {/* Issues List */}
        <section className="space-y-3 mb-12">
          {filteredIssues.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              isExpanded={expandedIssues.has(issue.id)}
              onToggle={() => toggleIssue(issue.id)}
            />
          ))}
        </section>

        {/* Final Verdict */}
        <section className="mb-12">
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 sm:p-8 text-white">
            <h2 className="text-2xl font-extrabold mb-4">📊 Итоговая оценка</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-5xl font-black">6.5</div>
                  <div className="text-lg opacity-80">/ 10</div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>UI/Дизайн</span><span>8/10</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{width: '80%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Функциональность</span><span>7/10</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{width: '70%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Безопасность</span><span>3/10</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{width: '30%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Архитектура</span><span>5/10</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{width: '50%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Качество кода</span><span>5/10</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white rounded-full" style={{width: '50%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
                <h3 className="font-bold text-lg mb-3">💬 Заключение</h3>
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  Проект демонстрирует хорошие навыки фронтенд-разработки: красивый UI, продуманный UX, работающий функционал. 
                  Видно, что автор уделяет внимание деталям — анимации, адаптивность, визуализация данных.
                </p>
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  Однако для production-использования необходимо серьёзно усилить безопасность (особенно хэширование паролей), 
                  перейти на модульную архитектуру с TypeScript, добавить тесты и бэкенд.
                </p>
                <p className="text-white/90 text-sm leading-relaxed">
                  <strong>Главный совет:</strong> Мигрируйте на React + TypeScript + бэкенд (Node.js/Express + PostgreSQL). 
                  Это решит 80% выявленных проблем и подготовит проект к масштабированию.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-slate-400 pb-8">
          Code Review сгенерирован для проекта{' '}
          <a href="https://github.com/Hyperion612/Survey_Pro-v.2" className="text-indigo-500 hover:underline" target="_blank" rel="noopener noreferrer">
            SurveyPro v4.2
          </a>
        </footer>
      </main>
    </div>
  );
}
