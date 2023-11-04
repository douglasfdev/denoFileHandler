import { Status } from "https://deno.land/std@0.200.0/http/http_status.ts";
import { RouterContext } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { log } from "../../../../../common/logger.ts";
import { PersonService } from "../../services/index.ts";

class PersonController {
  public async listPersons(ctx: RouterContext<string>) {
    try {
      const data = ctx.request.body();
      const body = await data.value;

      await PersonService.listPerson();

      return body;
    } catch (er: Error | any | unknown) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        error: er.message,
      };
      log.error(er.message);
    }
  }
}

export default new PersonController();
