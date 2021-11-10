FROM node:12
# Based on deban stretch.

WORKDIR /app
COPY package*.json ./
RUN npm install

# build inputs (sources)
COPY src src
COPY views views
COPY ./*.js ./
COPY ./*.json ./
COPY ./*.yaml ./
COPY .babelrc .babelrc
COPY .eslintrc.json .eslintrc.json
COPY .glitch-assets .glitch-assets

# sanity checks to prevent data leaks
RUN rm -r ./.data 2>/dev/null || true
RUN rm -r ./.logs 2>/dev/null || true

# build
RUN npx webpack --mode production
RUN mkdir -p .data

ENTRYPOINT [ "node", "server.js" ]
