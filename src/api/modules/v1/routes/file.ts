import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { FileController } from "../controllers/index.ts";

const file = new Router();

file.post("uploadFile/", FileController.uploadCsv);
file.get("listAll/", FileController.listAllFiles);

export { file };
