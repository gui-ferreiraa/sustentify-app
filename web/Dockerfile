FROM node:23.11.0-alpine3.21 AS builder

WORKDIR /usr/src/web

COPY package*.json ./

RUN npm install

COPY . .

ARG NG_SUS_API_BASE_URL
ARG NG_SUS_ASSISTANT_BASE_URL
ARG NG_SUS_APP_VERSION
ARG NG_SUS_MAKE_REQUEST

ENV NG_SUS_API_BASE_URL=$NG_SUS_API_BASE_URL
ENV NG_SUS_ASSISTANT_BASE_URL=$NG_SUS_ASSISTANT_BASE_URL
ENV NG_SUS_APP_VERSION=$NG_SUS_APP_VERSION
ENV NG_SUS_MAKE_REQUEST=$NG_SUS_MAKE_REQUEST

RUN npm run build:prod

FROM nginx:stable

RUN rm /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/web/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/src/web/dist/web/browser /usr/share/nginx/html

EXPOSE 80

CMD [ "nginx", "-g", "daemon off;"]
