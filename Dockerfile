FROM node:latest

RUN apt-get update && apt-get install -y poppler-utils

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm i --no-audit

COPY . .

RUN npx puppeteer browsers install

CMD [ "npm", "run", "start" ]

### build ###
# export docker_http_proxy=http://host.docker.internal:1080
# docker build --build-arg http_proxy=$docker_http_proxy --build-arg https_proxy=$docker_http_proxy -f Dockerfile -t allape/web2pdf:latest .

### run ###
# docker run --rm -it -v "$(pwd)/output:/output" allape/web2pdf:latest
