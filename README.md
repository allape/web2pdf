# web2pdf

A CLI running in docker to export web pages into a PDF file.

### Dockerized

⚠️: The font in PDF will be Roboto. 

```shell
docker build --build-arg https_proxy=http://host.docker.internal:1080 -t allape/web2pdf:latest .
```

### Run

```shell
npx puppeteer browsers install
npm run start -- --head --url [page1] --url [page2]
```

### Merge PDF

See [docker.poppler-utils.Dockerfile](docker.poppler-utils.Dockerfile).
