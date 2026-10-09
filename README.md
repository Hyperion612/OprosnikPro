# SurveyPro — Платформа для создания опросов

Современное SPA-приложение для создания, проведения и анализа опросов.

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

### Быстрый способ

1. Соберите проект:
   ```bash
   npm run build
   ```

2. Загрузите содержимое папки `dist/` в репозиторий:
   ```bash
   cd dist
   git init
   git add .
   git commit -m "Deploy"
   git remote add origin https://github.com/username/repo-name.git
   git branch -M main
   git push -u origin main --force
   ```

3. Настройте GitHub Pages:
   - Settings → Pages
   - Source: Deploy from a branch → `main` / `/ (root)`
   - Save

4. Откройте сайт: `https://username.github.io/repo-name/`

### Подробная инструкция

См. [DEPLOY.md](./DEPLOY.md)

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
