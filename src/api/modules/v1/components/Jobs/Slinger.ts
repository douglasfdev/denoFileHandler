import { FileService } from '$service/file/FileService.ts';
import { PersonService } from "$service/person/PersonService.ts";
import {
  weekly,
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
  }

  private dispareFiles() {
    weekly(async () => await new FileService().listenFilesFromDB());
  }

  private disparePersonIntoQueue() {
    weekly(async () => await new PersonService().listenAndInsertPersonFromQueue());
  }

  private dispareFilesPayloadIntoQueue() {
    weekly(async () => await new FileService().handlerPersonFromObjectIntoSQS());
  }
}

