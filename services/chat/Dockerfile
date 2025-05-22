FROM node:lts-slim

WORKDIR /usr/src/chat

COPY package*.json ./

RUN npm install

COPY ./main.js ./
COPY ./src ./src

EXPOSE ${PORT}

CMD [ "node", "main.js" ]