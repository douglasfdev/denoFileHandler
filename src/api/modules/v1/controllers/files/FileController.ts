import { RouterContext, Status } from "$deps";
import { log } from "$common";
import { IFileController, CSVType } from '$interfaces';
import { FileService } from "$services";


class Files implements IFileController {
  public async uploadCsv(ctx: RouterContext<string>): Promise<CSVType> {
    try {
      const formData = ctx.request.body({ type: "form-data" });
      const body = await formData.value.read();

      if (!body.files) {
       throw new Error("Doesn't have a file with csv format to upload");
      }
      const file = await FileService.handlerFilesPerson(body.files);

      ctx.response.status = Status.Created;
      return ctx.response.body = {
        message: "File upload with success!",
        file
      };
    // deno-lint-ignore no-explicit-any
    } catch (er: Error | any | unknown) {
      ctx.response.status = Status.BadRequest;
      log.error(er.message);
      ctx.response.body = {
        error: er.message,
      };
    }
  }

  public async listAllFiles(ctx: RouterContext<string>) {
    try {
      ctx.response.status = Status.OK;
      return ctx.response.body = await FileService.listFiles();
    } catch (er: Error | any | unknown) {
      ctx.response.status = Status.BadRequest;
      log.error(er.message);
      return ctx.response.body = {
        error: er.message,
      };
    }
  }

  public async listenFiles(ctx: RouterContext<string>) {
    try {
      ctx.response.status = Status.OK;
      return ctx.response.body = await FileService.listenFiles();
    } catch (er) {
      ctx.response.status = Status.BadRequest;
      log.error(er.message);
    }
  }
}

export default new Files();
