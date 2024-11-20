FROM node:20-alpine

WORKDIR /api

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 3000

USER node

CMD ["node", "index.js"]