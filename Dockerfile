#stage 1
FROM node:14.21.2-alpine as node
# FROM node:lts-alpine as node
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod

#stage 2
FROM nginx:alpine
COPY --from=node /app/dist/constellation-ui /usr/share/nginx/html