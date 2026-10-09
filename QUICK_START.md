# 🚀 Быстрый старт: Деплой за 3 шага

## Шаг 1: Включите GitHub Pages

1. Откройте ваш репозиторий на GitHub
2. Перейдите в **Settings** (Настройки)
3. В левом меню выберите **Pages**
4. В разделе **Source** выберите: **GitHub Actions**
5. Сохраните настройки

![GitHub Pages Settings](https://docs.github.com/assets/cb-61953/mw-1000/images/help/repository/actions-source-drop-down.webp)

## Шаг 2: Запушьте код

```bash
# Добавьте все файлы
git add .

# Закоммитьте
git commit -m "Setup GitHub Actions for auto-deploy"

# Запушьте в main
git push origin main
```

## Шаг 3: Дождитесь деплоя

1. Перейдите в раздел **Actions** вашего репозитория
2. Вы увидите запущенный workflow "Deploy to GitHub Pages"
3. Подождите 1-2 минуты
4. Когда появится зелёная галочка ✅ — сайт готов!

## ✅ Готово!

Ваш сайт доступен по адресу:
```
https://ваш-username.github.io/имя-репозитория/
```

## 🎯 Демо-аккаунты

- **Админ:** admin@survey.pro / admin123
- **Пользователь:** user@survey.pro / user123

## 🔄 Автоматический деплой

Теперь при каждом `git push` в main ветку сайт будет автоматически обновляться!

## 📊 Проверка статуса

- Перейдите в **Actions** для просмотра истории деплоев
- Зелёная галочка ✅ = успешно
- Красный крест ❌ = ошибка (кликните для просмотра логов)

## 🐛 Если что-то не работает

1. Проверьте, что в Settings → Pages выбрано **GitHub Actions** (не "Deploy from a branch")
2. Проверьте логи в Actions → последний запуск → build/deploy
3. Убедитесь, что workflow файл существует: `.github/workflows/deploy.yml`
4. Очистите кэш браузера: **Ctrl+Shift+R**

📖 Подробная помощь: [GITHUB_ACTIONS.md](./GITHUB_ACTIONS.md)

---

**Всё! Ваш сайт автоматически деплоится при каждом push!** 🎉
