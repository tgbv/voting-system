FROM node:16

COPY . /app

WORKDIR /app

RUN npm ci

ENTRYPOINT [ "/app/entrypoint.bash" ]