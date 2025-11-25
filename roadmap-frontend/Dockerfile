FROM node:18-alpine

WORKDIR /app

# Копирование package files
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование остального кода
COPY . .

# Открытие порта
EXPOSE 3000

# Запуск dev сервера
CMD ["npm", "start"]