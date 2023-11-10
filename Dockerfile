FROM denoland/deno:alpine-1.37.2

EXPOSE 8080

WORKDIR /www/deno/app

USER deno

COPY ./deno.json .

COPY . .

CMD ["deno", "task", "start", "--config", "deno.json", "src/main.ts"]
