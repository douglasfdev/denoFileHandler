FROM denoland/deno:1.38.1

EXPOSE 8080

WORKDIR /www/deno/app

USER deno

COPY ./deno.json ./deno.json

RUN mkdir -p /var/tmp/log

COPY . .

CMD ["deno", "task", "local"]
