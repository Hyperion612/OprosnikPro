# 📦 SurveyPro — Полный гайд по деплою

## 🎯 Что это?

SurveyPro — современное SPA-приложение для создания и проведения опросов с автоматическим деплоем через GitHub Actions.

## ✨ Возможности

- 📝 Создание опросов (один вариант, рейтинг, текст)
- 🌐 Публичные ссылки для анонимного прохождения
- 📊 Визуализация результатов (Chart.js)
- 📥 Экспорт в CSV и JSON
- 🛡️ Админ-панель
- 🌙 Тёмная тема
- 🔍 Поиск и фильтрация
- 📋 Дублирование опросов
- ⏱️ Таймер прохождения
- 📱 Адаптивный дизайн
- 🚀 Автоматический деплой через GitHub Actions

## 🚀 Быстрый старт (3 шага)

### 1. Включите GitHub Pages
Settings → Pages → Source: **GitHub Actions**

### 2. Запушьте код
```bash
git add .
git commit -m "Deploy"
git push origin main
```

### 3. Дождитесь деплоя
Перейдите в **Actions** и дождитесь зелёной галочки ✅

**Готово!** Сайт доступен по адресу: `https://ваш-username.github.io/имя-репозитория/`

📖 Подробная инструкция: [QUICK_START.md](./QUICK_START.md)

---

## 📚 Документация

### Деплой

| Файл | Описание | Когда использовать |
|------|----------|-------------------|
| [QUICK_START.md](./QUICK_START.md) | Быстрый старт (3 шага) | ⭐ **Начните отсюда!** |
| [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) | GitHub Actions (автодеплой) | Рекомендуемый способ |
| [DEPLOY.md](./DEPLOY.md) | Ручной деплой | Альтернативный способ |
| [CHECKLIST.md](./CHECKLIST.md) | Чек-лист проверки | Если что-то не работает |
| [COMMANDS.md](./COMMANDS.md) | Команды для деплоя | Шпаргалка команд |

### Разработка

| Файл | Описание |
|------|----------|
| [README.md](./README.md) | Основная информация о проекте |
| [DEPLOY.md](./DEPLOY.md) | Инструкция по деплою |

---

## 🛠️ Технологии

- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Графики:** Chart.js
- **Сборка:** Vite
- **Деплой:** GitHub Actions
- **Хостинг:** GitHub Pages

---

## 📦 Структура проекта

```
Survey_Pro-v.2/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── src/
│   ├── components/             # React компоненты
│   │   ├── Admin.tsx
│   │   ├── Auth.tsx
│   │   ├── Builder.tsx
│   │   ├── Home.tsx
│   │   ├── Layout.tsx
│   │   ├── Results.tsx
│   │   ├── RunSurvey.tsx
│   │   └── Stats.tsx
│   ├── App.tsx                 # Главный компонент
│   ├── context.tsx             # React Context
│   ├── store.ts                # Хранилище данных
│   ├── types.ts                # TypeScript типы
│   ├── utils.ts                # Утилиты
│   ├── main.tsx                # Точка входа
│   └── index.css               # Стили
├── public/
│   ├── 404.html                # Обработка 404
│   └── .nojekyll               # Отключение Jekyll
├── dist/                       # Сборка (после npm run build)
├── index.html                  # HTML шаблон
├── vite.config.js              # Конфигурация Vite
├── package.json                # Зависимости
├── README.md                   # Основная документация
├── QUICK_START.md              # Быстрый старт ⭐
├── GITHUB_ACTIONS.md           # GitHub Actions гайд
├── DEPLOY.md                   # Ручной деплой
├── CHECKLIST.md                # Чек-лист проверки
├── COMMANDS.md                 # Команды
└── SUMMARY.md                  # Этот файл
```

---

## 🎯 Демо-аккаунты

После деплоя используйте:

- **Админ:** admin@survey.pro / admin123
- **Пользователь:** user@survey.pro / user123

---

## 🔧 Локальная разработка

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для продакшена
npm run build

# Предпросмотр продакшен-сборки
npm run preview
```

---

## 🚀 Деплой

### ⭐ Рекомендуемый способ: GitHub Actions

**Автоматический деплой при каждом push в main**

1. Включите GitHub Pages: Settings → Pages → Source: **GitHub Actions**
2. Запушьте код: `git push origin main`
3. Дождитесь завершения workflow в Actions
4. Откройте сайт: `https://ваш-username.github.io/имя-репозитория/`

📖 [QUICK_START.md](./QUICK_START.md) | [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md)

### Альтернативный способ: Ручной деплой

Если нужен ручной контроль:

1. Соберите: `npm run build`
2. Загрузите `dist/` в репозиторий
3. Настройте GitHub Pages

📖 [DEPLOY.md](./DEPLOY.md) | [CHECKLIST.md](./CHECKLIST.md)

---

## 🐛 Решение проблем

### Белый экран

1. Проверьте, что GitHub Pages включён (Settings → Pages → GitHub Actions)
2. Проверьте логи в Actions
3. Очистите кэш: **Ctrl+Shift+R**
4. Проверьте в режиме инкогнито

📖 [CHECKLIST.md](./CHECKLIST.md)

### Ошибка деплоя

1. Откройте Actions → последний запуск
2. Проверьте логи build/deploy
3. Исправьте ошибку
4. Запушьте снова

📖 [COMMANDS.md](./COMMANDS.md)

---

## 📊 Мониторинг

### Проверка статуса деплоя

- Перейдите в **Actions** репозитория
- Зелёная галочка ✅ = успешно
- Красный крест ❌ = ошибка (кликните для логов)

### Проверка сайта

```bash
# Открыть Actions
open https://github.com/Hyperion612/Survey_Pro-v.2/actions

# Открыть сайт
open https://Hyperion612.github.io/Survey_Pro-v.2/
```

---

## 🎓 Что дальше?

1. ✅ Задеплойте проект (см. [QUICK_START.md](./QUICK_START.md))
2. ✅ Протестируйте все функции
3. ✅ Создайте свой первый опрос
4. ✅ Поделитесь ссылкой с друзьями
5. ✅ Добавьте новые функции!

---

## 📞 Поддержка

Если возникли проблемы:

1. Проверьте [CHECKLIST.md](./CHECKLIST.md)
2. Проверьте логи в Actions
3. Создайте Issue в репозитории

---

## 📄 Лицензия

MIT

---

**Удачи с вашим проектом!** 🚀

Создано с ❤️ для Hyperion612
