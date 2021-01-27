FROM node:lts-alpine
WORKDIR /usr/src/app
COPY . ./
RUN ls -l
RUN yarn
COPY server.js dist/server.js
WORKDIR /usr/src/app/dist
EXPOSE 8080
CMD [ "node", "server.js" ]