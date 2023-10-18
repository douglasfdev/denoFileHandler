import { Application } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { routing } from "./api/modules/v1/routes/index.ts";
import { type CorsOptions } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import loggerRoutes from "./api/middlewares/Logger/logger.routes.ts";


class App {
  public app: Application;
  private corsOptions: CorsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 200,
  }

  constructor() {
    this.app = new Application();
    this.middlewares();
    this.routes();
  }

  private middlewares() {
    this.app.use(oakCors(this.corsOptions));
    this.app.use(loggerRoutes);
  }

  private routes() {
    this.app.use(routing)
  }
}

export default new App().app;
