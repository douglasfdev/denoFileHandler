import { Router } from "$deps";
import { FileController } from "$controllers";

const file = new Router();

file.post("uploadFile/", FileController.uploadCsv);
file.get("listAllFiles/", FileController.listAllFiles);
file.get("listenAllFiles/", FileController.listenFiles)
file.get("listAllObjectsBuckets/", FileController.listAllObjectsBuckets)

export { file };
