# web2pdf

A CLI running in docker to export web pages into a PDF file.

### Build
```shell
docker build --build-arg https_proxy=http://host.docker.internal:1080 -t allape/web2pdf:latest .
```

### Run
```shell
docker run --rm -v "$(pwd)/output:/output:z" allape/web2pdf node /app/index.js /output/resume.pdf http://host.docker.internal:3000/index http://host.docker.internal:3000/prfile http://host.docker.internal:3000/career
open output/resume.pdf

alias web2pdf="docker run --rm -v \"\$(pwd)/output:/output:z\" allape/web2pdf node /app/index.js /output/resume.pdf"
web2pdf http://host.docker.internal:3000/index http://host.docker.internal:3000/prfile http://host.docker.internal:3000/career
open output/resume.pdf
```
