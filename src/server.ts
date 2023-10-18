import { log } from "./common/logger.ts";
import { env } from "./common/env.config.ts"
import app from "./main.ts";

app.listen({ port: 8080 });
app.addEventListener("listen", ({ hostname, port, secure }) => {
  log.info(`Database: ${env.DB_NAME}`);
  log.success(`Server is listening on ${secure ? "https": "http"}://${hostname}:${port}`);
  log.success(`Server is running on ${hostname}:${port}`)
})
