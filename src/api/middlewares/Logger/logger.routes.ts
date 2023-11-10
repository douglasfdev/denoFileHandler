import {
  Context,
  Middleware
} from "$deps";
import { log } from "$common";

class LoggerMiddleware {
  public requestLogger: Middleware = async (ctx: Context, next: () => Promise<unknown>) => {
    log.info(`${ctx.request.method} request to "${ctx.request.url.pathname}" by ${ctx.request.headers.get("host")}`);
    await next();
  }
}

export default new LoggerMiddleware().requestLogger;
