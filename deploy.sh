#!/bin/bash

# Скрипт для деплоя на GitHub Pages
# Использование: ./deploy.sh username repo-name

set -e

USERNAME=$1
REPO=$2

if [ -z "$USERNAME" ] || [ -z "$REPO" ]; then
  echo "❌ Использование: ./deploy.sh <username> <repo-name>"
  echo "Пример: ./deploy.sh john survey-pro"
  exit 1
fi

echo "🚀 Начинаем деплой на GitHub Pages..."
echo ""

# Сборка проекта
echo "📦 Собираем проект..."
npm run build

# Переходим в папку dist
cd dist

# Инициализируем git
echo "🔧 Инициализируем git..."
git init
git add .
git commit -m "Deploy to GitHub Pages"

# Добавляем remote
echo "🔗 Добавляем remote..."
git branch -M main
git remote add origin https://github.com/$USERNAME/$REPO.git

# Пушим в репозиторий
echo "📤 Загружаем файлы на GitHub..."
git push -u origin main --force

# Возвращаемся в корень
cd ..

echo ""
echo "✅ Деплой завершён!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Откройте https://github.com/$USERNAME/$REPO/settings/pages"
echo "2. В разделе 'Source' выберите:"
echo "   - Branch: main"
echo "   - Folder: / (root)"
echo "3. Нажмите Save"
echo "4. Подождите 1-2 минуты"
echo ""
echo "🌐 Ваш сайт будет доступен по адресу:"
echo "   https://$USERNAME.github.io/$REPO/"
echo ""
