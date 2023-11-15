import { FileService } from '$service/file/FileService.ts';
import { PersonService } from "$service/person/PersonService.ts";
import {
  everyMinute,
  hourly,
  cron,
  start,
} from '$deps';

export class Slinger {
  constructor() {
    this.init();
  }

  private init() {
    this.dispareFiles();
    this.disparePersonIntoQueue();
    this.dispareFilesPayloadIntoQueue();
    start();
    this.init();
  }

  private dispareFiles() {
    cron("* * * * * *", async () => await new FileService().listenFilesFromDB());
  }

  private disparePersonIntoQueue() {
    cron("* * * * * *", async () => await new PersonService().listenAndInsertPersonFromQueue());
  }

  private dispareFilesPayloadIntoQueue() {
    cron("* * * * * *", async () => await new FileService().handlerPersonFromObjectIntoSQS());
  }
}

export default new Slinger();
