#!/bin/bash
set -e
if [ "$(id -u)" -ne 0 ]; then echo "Please run as root." >&2; exit 1; fi
CONTAINER=$(docker ps -a --filter ancestor="constellation-ui" --format "{{.ID}}")
IMAGE=$(docker ps -a --filter ancestor="constellation-ui" --format "{{.Image}}")
if [ "$CONTAINER" ]
then
	echo "Container FOUND"
	docker stop $CONTAINER
	docker rm $CONTAINER
	docker image rm $IMAGE
fi

if [ "$IMAGE" ]
then
	echo "Image FOUND"
	docker image rm $IMAGE
fi

docker build -t constellation-ui:latest .
# docker run  -d --restart unless-stopped -p 5000:5000 constellation
docker run -d --restart unless-stopped -p 80:80 constellation-ui:latest
