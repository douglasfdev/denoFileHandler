import {
  Status,
  RouterContext
} from "$deps";
import { log } from "$common";
import { PersonService } from "$services";
import { SQS } from "$components";

class PersonController {
  public async listPersons(ctx: RouterContext<string>) {
    try {
      return ctx.response.body = await PersonService.listPerson();
    } catch (er: Error | any | unknown) {
      ctx.response.status = Status.BadRequest;
      log.error(er.message);

      return ctx.response.body = {
        error: er.message,
      };
    }
  }

  public async create(ctx: RouterContext<string>) {
    try {
      const body = ctx.request.body();
      const { filename } = await body.value;

      const person = await PersonService.create(filename);

      if (!person) {
        throw new Error("Person not created");
      }

      person.map(async person => {
        await SQS.handleQueue(person);
      })

      ctx.response.status = Status.Created;
      return ctx.response.body = person;
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
