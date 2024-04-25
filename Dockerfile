FROM node:latest

RUN apt-get update && apt-get install -y poppler-utils

WORKDIR /app

RUN npm install -g playwright && \
    npx playwright install-deps && \
    npx playwright install chromium

RUN mkdir -p output

COPY package.json .
COPY package-lock.json .
RUN npm i

COPY index.js .

CMD [ "node", "/app/index.js" ]

# docker build -t allape/web2pdf .
