import { Context, Middleware } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { log } from "../../../common/logger.ts";

class LoggerMiddleware {
  public requestLogger: Middleware = async (ctx: Context, next: () => Promise<unknown>) => {
    log.info(`${ctx.request.method} request to "${ctx.request.url.pathname}" by ${ctx.request.headers.get("host")}`);
    await next();
  }
}

export default new LoggerMiddleware().requestLogger;
