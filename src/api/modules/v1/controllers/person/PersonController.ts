import {
  Status,
  RouterContext
} from "$deps";
import { log } from "$common";
import { PersonService } from "$services";

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
