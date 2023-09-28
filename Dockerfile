FROM node:20-alpine3.17
WORKDIR /app
COPY . .
RUN npm install
CMD ["node","app.js"]
EXPOSE 5000