FROM node:12

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir .data
RUN npx webpack --mode production

ENTRYPOINT [ "node", "server.js" ]
