# SurveyPro — Платформа для создания опросов

Современное SPA-приложение для создания, проведения и анализа опросов.

![Deploy](https://github.com/Hyperion612/Survey_Pro-v.2/actions/workflows/deploy.yml/badge.svg)

## ✨ Возможности

- 📝 Создание опросов с 3 типами вопросов (один вариант, рейтинг, текст)
- 🌐 Публичные ссылки для анонимного прохождения
- 📊 Визуализация результатов с графиками (Chart.js)
- 📥 Экспорт в CSV и JSON
- 🛡️ Админ-панель с управлением пользователями
- 🌙 Тёмная тема
- 🔍 Поиск и фильтрация опросов
- 📋 Дублирование опросов
- ⏱️ Таймер прохождения
- 📱 Адаптивный дизайн

## 🚀 Демо

**Админ:** admin@survey.pro / admin123  
**Пользователь:** user@survey.pro / user123

## 🛠️ Технологии

- React 18
- TypeScript
- Tailwind CSS
- Chart.js
- Vite
- GitHub Actions (автоматический деплой)

## 📦 Установка и запуск

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен-сборки
npm run preview
```

## 🌐 Деплой на GitHub Pages

### ⭐ Рекомендуемый способ: GitHub Actions (автоматический деплой)

**Самый простой и надёжный способ!** Автоматический деплой при каждом push в main.

🚀 **Быстрый старт (3 шага):** [QUICK_START.md](./QUICK_START.md)

1. Включите GitHub Pages: **Settings → Pages → Source: GitHub Actions**
2. Запушьте код в main: `git push origin main`
3. Дождитесь завершения workflow в разделе **Actions**
4. Откройте сайт: `https://ваш-username.github.io/имя-репозитория/`

📖 Подробная инструкция: [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md)

### Альтернативный способ: Ручной деплой

Если вам нужен ручной контроль над деплоем:

1. Соберите проект: `npm run build`
2. Загрузите содержимое папки `dist/` в репозиторий
3. Настройте GitHub Pages: Settings → Pages → Source: Deploy from a branch

📖 Подробная инструкция: [DEPLOY.md](./DEPLOY.md)  
📋 Чек-лист проверки: [CHECKLIST.md](./CHECKLIST.md)

## 🔧 Конфигурация

### Изменение базового пути

Если ваш сайт размещён не в корне домена, измените `base` в `vite.config.js`:

```javascript
export default defineConfig({
  base: '/repo-name/', // Замените на имя вашего репозитория
  // ...
});
```

Затем пересоберите проект: `npm run build`

## 📁 Структура проекта

```
src/
├── components/       # React-компоненты
│   ├── Admin.tsx
│   ├── Auth.tsx
│   ├── Builder.tsx
│   ├── Home.tsx
│   ├── Layout.tsx
│   ├── Results.tsx
│   ├── RunSurvey.tsx
│   └── Stats.tsx
├── App.tsx          # Главный компонент
├── context.tsx      # React Context
├── store.ts         # Хранилище данных
├── types.ts         # TypeScript типы
└── utils.ts         # Утилиты
```

## 🔒 Безопасность

- ✅ SHA-256 хэширование паролей с солью
- ✅ Валидация на клиенте
- ✅ Защита маршрутов по ролям
- ⚠️ Данные хранятся в localStorage (только для демо)

**Для продакшена рекомендуется:**
- Добавить бэкенд (Node.js + PostgreSQL)
- Использовать JWT для аутентификации
- Добавить серверную валидацию

## 📝 Лицензия

MIT

## 🤝 Вклад

Pull requests приветствуются!
