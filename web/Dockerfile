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

ARG API_BASE_URL
ARG ASSISTANT_BASE_URL
ARG APP_VERSION
ARG CLOUDINARY_NAME

ENV API_BASE_URL=$API_BASE_URL
ENV ASSISTANT_BASE_URL=$ASSISTANT_BASE_URL
ENV APP_VERSION=$APP_VERSION
ENV CLOUDINARY_NAME=$CLOUDINARY_NAME

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;"]
