source ./docker/.env

# echo "Running docker"
# cd ./docker && \
#     docker-compose -f docker-compose.web.yaml up -d && \
#     docker-compose -f docker-compose.server.yaml up --build -d

echo "Running a ngrok"
docker run --rm --name ngrok --net=host -it -e NGROK_AUTHTOKEN=$NGROK_AUTHTOKEN ngrok/ngrok:latest http --url=$NGROK_DOMAIN http://localhost:8080
# docker run --rm --name ngrok --net=host -it -e NGROK_AUTHTOKEN=$NGROK_AUTHTOKEN ngrok/ngrok:latest http 8080