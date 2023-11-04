import { RouterContext } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { log } from "../../../../../common/logger.ts";
import { Status } from "https://deno.land/std@0.200.0/http/http_status.ts";
import { FileService } from "../../services/index.ts";
import { IFileController } from "../../../../../common/interfaces/index.ts";


class Files implements IFileController {
  public async uploadCsvCoordinator(ctx: RouterContext<string>): Promise<void> {
    try {
      const formData = ctx.request.body({ type: "form-data" });
      const body = await formData.value.read();

      if (body.files) {
       await FileService.handlerFilesCoordinator(body.files);

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
}

export default new Files();
