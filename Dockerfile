FROM denoland/deno:alpine-1.37.2

EXPOSE 8080

WORKDIR /www/deno/app

USER deno

COPY deps.ts .
RUN deno cache deps.ts

COPY . .

RUN deno cache src/main.ts

CMD ["run", "--allow-all", "main.ts"]