import { Router } from "$deps";
import { FileController } from "$controllers";

const file = new Router();

file.post("uploadFile/", FileController.uploadCsv);
file.get("listAll/", FileController.listAllFiles);

export { file };
