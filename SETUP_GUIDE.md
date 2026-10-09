# 🎯 Настройка GitHub Actions за 5 минут

## 📋 Что вам нужно

- ✅ Репозиторий на GitHub
- ✅ Код проекта (уже в репозитории)
- ✅ 5 минут времени

---

## 🚀 Пошаговая инструкция

### 1️⃣ Откройте настройки репозитория

Перейдите в ваш репозиторий на GitHub и нажмите **Settings** (Настройки) в правом верхнем углу.

![Settings](https://docs.github.com/assets/cb-61953/mw-1000/images/help/repository/repo-actions-settings.webp)

---

### 2️⃣ Перейдите в раздел Pages

В левом меню найдите и нажмите **Pages**.

![Pages](https://docs.github.com/assets/cb-61953/mw-1000/images/help/repository/pages-tab.webp)

---

### 3️⃣ Выберите источник деплоя

В разделе **Build and deployment** → **Source** выберите:

**⚠️ ВАЖНО:** Выберите **GitHub Actions** (НЕ "Deploy from a branch")

![Source](https://docs.github.com/assets/cb-61953/mw-1000/images/help/repository/actions-source-drop-down.webp)

---

### 4️⃣ Запушьте код

Откройте терминал в папке проекта и выполните:

```bash
git add .
git commit -m "Настройка GitHub Actions"
git push origin main
```

---

### 5️⃣ Дождитесь деплоя

1. Вернитесь в репозиторий на GitHub
2. Нажмите на вкладку **Actions** (вверху)
3. Вы увидите запущенный workflow "Deploy to GitHub Pages"
4. Подождите 1-2 минуты
5. Когда появится зелёная галочка ✅ — сайт готов!

![Actions](https://docs.github.com/assets/cb-61953/mw-1000/images/help/repository/actions-tab.webp)

---

### 6️⃣ Откройте сайт

Ваш сайт доступен по адресу:

```
https://ваш-username.github.io/Survey_Pro-v.2/
```

**Замените:**
- `ваш-username` — ваш username на GitHub
- `Survey_Pro-v.2` — имя вашего репозитория

---

## ✅ Проверка

### Сайт работает?

Откройте сайт в браузере. Вы должны увидеть:
- ✅ Форму входа
- ✅ Логотип SurveyPro
- ✅ Поля для email и пароля

### Демо-аккаунты

- **Админ:** admin@survey.pro / admin123
- **Пользователь:** user@survey.pro / user123

---

## 🔄 Автоматическое обновление

Теперь при каждом `git push` в main:

1. GitHub Actions автоматически запускается
2. Собирает проект
3. Деплоит на GitHub Pages
4. Ваш сайт обновляется!

**Никаких ручных действий!** 🎉

---

## 🐛 Если что-то не работает

### Белый экран?

1. Проверьте, что в Settings → Pages выбрано **GitHub Actions**
2. Проверьте логи в Actions (есть ли ошибки?)
3. Очистите кэш браузера: **Ctrl+Shift+R**
4. Попробуйте в режиме инкогнито

### Ошибка деплоя?

1. Перейдите в Actions
2. Кликните на последний запуск
3. Разверните шаги build/deploy
4. Посмотрите ошибку
5. Исправьте и запушьте снова

### Сайт не открывается?

1. Подождите 2-3 минуты (GitHub Pages кэширует)
2. Проверьте URL: `https://username.github.io/repo-name/`
3. Убедитесь, что репозиторий публичный

---

## 📚 Дополнительная помощь

- [QUICK_START.md](./QUICK_START.md) — Краткая инструкция
- [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md) — Подробное руководство
- [CHECKLIST.md](./CHECKLIST.md) — Чек-лист проверки
- [INSTRUCTION_RU.md](./INSTRUCTION_RU.md) — Инструкция на русском

---

## 🎓 Что дальше?

1. ✅ Задеплойте проект (вы уже здесь!)
2. ✅ Протестируйте все функции
3. ✅ Создайте свой первый опрос
4. ✅ Поделитесь ссылкой с друзьями
5. ✅ Добавьте новые функции!

---

**Поздравляю! Ваш сайт автоматически деплоится!** 🚀🎉
