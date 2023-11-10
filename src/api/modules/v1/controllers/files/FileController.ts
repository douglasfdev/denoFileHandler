import { RouterContext, Status } from "$deps";
import { log, IFileController } from "$common";
import { FileService } from "$services";


class Files implements IFileController {
  public async uploadCsv(ctx: RouterContext<string>): Promise<void> {
    try {
      const formData = ctx.request.body({ type: "form-data" });
      const body = await formData.value.read();

      if (body.files) {
       await FileService.handlerFilesPerson(body.files);

        ctx.response.status = Status.Created;
        ctx.response.body = {
          message: "File upload with success!",
        };
      }
    // deno-lint-ignore no-explicit-any
    } catch (er: Error | any | unknown) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        error: er.message,
      };
      log.error(er.message);
    }
  }

  public async listAllFiles(ctx: RouterContext<string>) {
    try {
      ctx.response.status = Status.OK;
      ctx.response.body = await FileService.listFiles();
    } catch (er: Error | any | unknown) {
      ctx.response.status = Status.BadRequest;
      ctx.response.body = {
        error: er.message,
      };
      log.error(er.message);
    }
  }
}

export default new Files();
