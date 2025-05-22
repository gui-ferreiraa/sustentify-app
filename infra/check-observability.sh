#!/bin/bash

# Verificar e criar a network se não existir
NETWORK_NAME="observability_net"

echo "Checking if network $NETWORK_NAME exists..."

if ! docker network ls --filter name="^${NETWORK_NAME}$" --format '{{.Name}}' | grep -w "$NETWORK_NAME" > /dev/null; then
  echo "Network $NETWORK_NAME does not exist. Creating..."
  docker network create --driver bridge "$NETWORK_NAME"
else
  echo "Network $NETWORK_NAME already exists."
fi

# Iniciar os serviços
echo "Starting services with docker-compose..."
cd ./docker || { echo "Directory ./docker not found!"; exit 1; }
docker-compose -f observability.yaml up -d

echo "Waiting 5 seconds for containers to start..."
sleep 5

echo "Checking container statuses..."

# Obter os IDs dos containers gerenciados por este compose
containers=$(docker-compose -f observability.yaml ps -q)

if [ -z "$containers" ]; then
  echo "No containers found."
  exit 1
fi

all_running=true

for container in $containers; do
  status=$(docker inspect -f '{{.State.Running}}' "$container")
  name=$(docker inspect -f '{{.Name}}' "$container" | sed 's#/##')
  if [ "$status" != "true" ]; then
    echo "Container $name is not running."
    all_running=false
  else
    echo "Container $name is running."
  fi
done

if $all_running; then
  echo "All containers are running!"
  exit 0
else
  echo "Some containers are not running."
  exit 2
fi
