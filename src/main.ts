import {
  Application,
  oakCors,
  CorsOptions
} from "$deps";
import { routing } from "$routes";
import { LoggerRoutes } from "$middlewares";
import { log, env } from "$common";
import { Slinger as Command } from "$component/Commands/Slinger.ts";
import "$migrations";

class App {
  public app: Application;
  public commands: Command;

  private corsOptions: CorsOptions = {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    optionsSuccessStatus: 200,
  };

  constructor() {
    this.app = new Application();
    this.middlewares();
    this.init();
    this.routes();
    this.commands = new Command();
  }

  private middlewares() {
    this.app.use(oakCors(this.corsOptions));
    this.app.use(LoggerRoutes);
  }

  private routes() {
    this.app.use(routing)
  }

  private init() {
    this.app.listen({ port: Number(env.PORT) });
    this.app.addEventListener("listen", ({ hostname, port, secure }) => {
      log.info(`Database: ${env.MYSQL_DATABASE}`);
      log.success(`Server is listening on ${secure ? "https" : "http"}://${hostname}:${port}`);
      log.success(`Server is running on ${hostname}:${port}`)
    });
  }
}

export default new App().app;
