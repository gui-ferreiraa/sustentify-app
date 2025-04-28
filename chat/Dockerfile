FROM node:lts-slim

WORKDIR /usr/src/chat

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE ${PORT}

CMD [ "node", "main.js" ]