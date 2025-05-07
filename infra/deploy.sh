source ./docker/.env

echo "Running docker"
cd ./docker && docker-compose -f docker-compose.server.yaml up -d

echo "Running a ngrok"
docker run --net=host -it -e NGROK_AUTHTOKEN=$NGROK_AUTHTOKEN ngrok/ngrok:latest http --url=$NGROK_DOMAIN http://localhost:8080