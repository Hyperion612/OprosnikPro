# 🔍 Чек-лист проверки деплоя

Если вы видите белый экран или ошибку 404, пройдите по этому чек-листу:

## ✅ Структура файлов на GitHub

Ваш репозиторий должен содержать:

```
├── index.html          ✅ Обязательно
├── 404.html            ✅ Обязательно
├── .nojekyll           ✅ Обязательно
└── assets/
    ├── index-XXXXX.js  ✅ Обязательно
    └── index-XXXXX.css ✅ Обязательно
```

**НЕ** должно быть:
- ❌ Вложенной папки `dist/`
- ❌ Отсутствия папки `assets/`
- ❌ Файлов с абсолютными путями (`/assets/...` вместо `./assets/...`)

## ✅ Проверка путей в index.html

Откройте `index.html` на GitHub и найдите строки:

```html
<script type="module" crossorigin src="./assets/index-XXXXX.js"></script>
<link rel="stylesheet" crossorigin href="./assets/index-XXXXX.css">
```

Пути должны начинаться с `./` (относительные), а не с `/` (абсолютные).

## ✅ Проверка консоли браузера

1. Откройте ваш сайт
2. Нажмите F12 (DevTools)
3. Перейдите во вкладку **Console**
4. Посмотрите ошибки:

### Ошибка: Failed to load resource 404

**Причина:** Неправильные пути к ассетам

**Решение:**
```bash
# Проверьте vite.config.js
cat vite.config.js

# Должно быть:
base: './',

# Пересоберите
npm run build

# Задеплойте заново
```

### Ошибка: Uncaught SyntaxError

**Причина:** Файл JS не загрузился или повреждён

**Решение:**
- Проверьте, что файл `assets/index-XXXXX.js` существует в репозитории
- Попробуйте очистить кэш браузера (Ctrl+Shift+R)

### Ошибка: Refused to execute script (MIME type)

**Причина:** GitHub Pages не правильно отдаёт MIME type

**Решение:**
- Убедитесь, что файл `.nojekyll` есть в корне репозитория
- Подождите 5 минут (GitHub Pages кэширует)

## ✅ Проверка GitHub Pages Settings

1. Откройте репозиторий на GitHub
2. Перейдите в **Settings** → **Pages**
3. Проверьте настройки:
   - **Source:** Deploy from a branch
   - **Branch:** `main` (или `gh-pages`)
   - **Folder:** `/ (root)`
4. Должна быть зелёная галочка: "Your site is live at..."

## ✅ Проверка URL

Правильный URL:
```
✅ https://username.github.io/repo-name/
✅ https://username.github.io/repo-name/index.html
```

Неправильный URL:
```
❌ https://username.github.io/ (без имени репозитория)
❌ https://username.github.io/repo-name/dist/ (с папкой dist)
```

## ✅ Очистка кэша

Если ничего не помогает:

1. **Очистите кэш браузера:**
   - Chrome: Ctrl+Shift+R (или Cmd+Shift+R на Mac)
   - Или: F12 → Network → Disable cache

2. **Очистите localStorage:**
   ```javascript
   // В консоли браузера (F12)
   localStorage.clear();
   location.reload();
   ```

3. **Попробуйте в режиме инкогнито:**
   - Ctrl+Shift+N (Chrome)
   - Cmd+Shift+N (Safari)

## ✅ Альтернативное решение: Абсолютные пути

Если относительные пути не работают, используйте абсолютные:

1. Откройте `vite.config.js`
2. Измените `base`:
   ```javascript
   export default defineConfig({
     base: '/repo-name/', // Замените на имя вашего репозитория
     // ...
   });
   ```
3. Пересоберите: `npm run build`
4. Задеплойте заново

## ✅ Проверка файла 404.html

Файл `404.html` должен содержать:

```html
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>SurveyPro</title>
  <script>
    sessionStorage.redirect = location.href;
  </script>
  <meta http-equiv="refresh" content="0;url=./">
</head>
<body>
  <p>Перенаправление...</p>
</body>
</html>
```

## 🆘 Если ничего не помогло

1. Создайте Issue в репозитории
2. Приложите:
   - Скриншот белого экрана
   - Скриншот консоли браузера (F12 → Console)
   - Скриншот настроек GitHub Pages
   - Ссылку на ваш репозиторий

## 📞 Быстрая помощь

Попробуйте эти команды:

```bash
# Пересобрать проект
npm run build

# Проверить содержимое dist/
ls -la dist/

# Проверить пути в index.html
grep -E "(script|link)" dist/index.html

# Задеплоить заново
./deploy.sh username repo-name
```
