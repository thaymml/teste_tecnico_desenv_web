FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3001

CMD ["node", "dist/server.js"]

