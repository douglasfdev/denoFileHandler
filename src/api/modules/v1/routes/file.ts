import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import FileController from "../files/FileController.ts";

const file = new Router();

file.post("uploadFile/", FileController.uploadCsv)

export { file };
