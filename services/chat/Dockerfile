FROM node:lts-slim

WORKDIR /usr/src/chat

COPY package*.json ./

RUN npm install

COPY ./prompt.txt ./
COPY ./server.js ./
COPY ./src ./src

EXPOSE ${PORT}

CMD [ "node", "server.js" ]