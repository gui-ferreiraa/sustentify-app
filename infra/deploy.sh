source ./docker/.env

echo "Running a ngrok..."

# SPRING SERVER
# cd ./docker && docker-compose -f server.yaml up -d
# docker run --rm --name ngrok --net=host -it -e NGROK_AUTHTOKEN=$NGROK_AUTHTOKEN ngrok/ngrok:latest http --url=$NGROK_DOMAIN http://localhost:8080

# NODE CHAT ASSISTANT
cd ./docker && docker-compose -f assistant.yaml up -d
docker run --rm --name ngrok --net=host -it -e NGROK_AUTHTOKEN=$NGROK_AUTHTOKEN ngrok/ngrok:latest http --url=$NGROK_DOMAIN http://localhost:8090