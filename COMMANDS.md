# 📋 Команды для деплоя

## 🚀 Быстрый деплой (GitHub Actions)

### 1. Настройка (один раз)

```bash
# Клонируйте репозиторий (если ещё не клонировали)
git clone https://github.com/Hyperion612/Survey_Pro-v.2.git
cd Survey_Pro-v.2

# Установите зависимости
npm install
```

### 2. Деплой

```bash
# Добавьте все файлы
git add .

# Закоммитьте
git commit -m "Deploy with GitHub Actions"

# Запушьте в main
git push origin main
```

**Готово!** GitHub Actions автоматически задеплоит ваш сайт.

---

## 🔧 Полезные команды

### Локальная разработка

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

### Git команды

```bash
# Проверить статус
git status

# Добавить все изменения
git add .

# Закоммитить
git commit -m "Описание изменений"

# Запушить в main
git push origin main

# Создать новую ветку
git checkout -b feature-name

# Переключиться на main
git checkout main

# Слить ветку
git merge feature-name
```

### Проверка деплоя

```bash
# Открыть Actions в браузере
# (замените username и repo-name)
open https://github.com/Hyperion612/Survey_Pro-v.2/actions

# Открыть сайт в браузере
# (замените username и repo-name)
open https://Hyperion612.github.io/Survey_Pro-v.2/
```

---

## 🐛 Решение проблем

### Белый экран после деплоя

```bash
# 1. Проверьте, что GitHub Pages включён
# Settings → Pages → Source: GitHub Actions

# 2. Проверьте статус workflow
# Actions → последний запуск → проверьте логи

# 3. Очистите кэш браузера
# Ctrl+Shift+R (Windows/Linux)
# Cmd+Shift+R (Mac)

# 4. Проверьте в режиме инкогнито
```

### Ошибка деплоя

```bash
# 1. Проверьте логи в Actions
# Actions → последний запуск → build/deploy

# 2. Пересоберите локально
npm run build

# 3. Проверьте, что сборка успешна
ls -la dist/

# 4. Запушьте снова
git add .
git commit -m "Fix build"
git push origin main
```

### Откат к предыдущей версии

```bash
# 1. Найдите коммит, к которому хотите откатиться
git log

# 2. Откатитесь
git revert HEAD  # Отменить последний коммит
git push origin main

# Или используйте Actions → Re-run workflow
```

---

## 📊 Мониторинг

### Проверка статуса деплоя

```bash
# Через GitHub CLI (если установлен)
gh run list --workflow=deploy.yml

# Просмотр логов последнего запуска
gh run view --log

# Или просто откройте в браузере:
# https://github.com/Hyperion612/Survey_Pro-v.2/actions
```

### Проверка сайта

```bash
# Проверить, что сайт доступен
curl -I https://Hyperion612.github.io/Survey_Pro-v.2/

# Должен вернуть: HTTP/2 200
```

---

## 🎯 Демо-аккаунты

После деплоя используйте:

- **Админ:** admin@survey.pro / admin123
- **Пользователь:** user@survey.pro / user123

---

## 📚 Документация

- [QUICK_START.md](./QUICK_START.md) — Быстрый старт (3 шага)
- [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) — Подробная инструкция по GitHub Actions
- [DEPLOY.md](./DEPLOY.md) — Ручной деплой
- [CHECKLIST.md](./CHECKLIST.md) — Чек-лист проверки

---

**Удачи с деплоем!** 🚀
