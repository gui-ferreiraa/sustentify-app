FROM node:23.11.0-alpine3.21 AS builder

WORKDIR /usr/src/web

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build:prod

FROM nginx:stable

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/web/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/web/dist/web/browser /usr/share/nginx/html

ENV API_BASE_URL=""
ENV ASSISTANT_BASE_URL=""
ENV APP_VERSION=""

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;"]
