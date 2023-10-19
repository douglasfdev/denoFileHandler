FROM denoland/deno:alpine-1.37.2

EXPOSE 8080

WORKDIR /www/deno/app

USER deno

COPY . .

RUN deno cache src/server.ts

CMD ["run", "--allow-all", "start"]