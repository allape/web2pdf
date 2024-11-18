FROM alpine:3.20.3

RUN apk update && apk add poppler-utils

WORKDIR /output

CMD ["pdfunite"]

### build ###
# export docker_http_proxy=http://host.docker.internal:1080
# docker build --build-arg http_proxy=$docker_http_proxy --build-arg https_proxy=$docker_http_proxy -f docker.poppler-utils.Dockerfile -t allape/putils:latest .

### test ###
# docker run --rm allape/putils:latest pdfunite -v

### run ###
# docker run --rm -v "$(pwd)/output:/output" allape/putils:latest pdfunite /output/1.pdf /output/2.pdf ... /output/resume.pdf
