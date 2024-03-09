FROM node:latest

RUN apt-get update && apt-get install -y poppler-utils

WORKDIR /app

RUN mkdir -p output

COPY index.js .
COPY package.json .
COPY package-lock.json .

RUN npm i && \
    npx playwright install-deps && \
    npx playwright install chromium

CMD [ "node", "/app/index.js" ]
