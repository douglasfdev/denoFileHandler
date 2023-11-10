import {
  Status,
  RouterContext
} from "$deps";
import { log } from "$common";
import { PersonService } from "$services";

class PersonController {
  public async listPersons(ctx: RouterContext<string>) {
    try {
      return ctx.response.body = await PersonService.listPerson();
    } catch (er: Error | any | unknown) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        error: er.message,
      };
      log.error(er.message);
    }
  }

  public create(ctx: RouterContext<string>) {
    try {
      const body = ctx.request.body();
      console.log(body);
    } catch (er) {
      ctx.response.status = Status.BadRequest;
      log.error(er.message);
      return ctx.response.body = {
        error: er.message,
      };
    }
  }
}

export default new PersonController();
