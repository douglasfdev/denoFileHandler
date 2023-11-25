import { FileService } from '$service/file/FileService.ts';
import { PersonService } from "$service/person/PersonService.ts";

export class Slinger {
  constructor() {
    this.init();
  }

  private init() {
    this.dispareFiles();
    this.disparePersonIntoQueue();
    this.dispareFilesPayloadIntoQueue();
  }

  private dispareFiles() {
    Deno.cron("Liten Files from Database!", "0 0 * * *", async () => await new FileService().listenFilesFromDB());
  }

  private disparePersonIntoQueue() {
    Deno.cron("Liten and insert persons from the AWS SQS queue!", "0 0 * * *", async () => await new PersonService().listenAndInsertPersonFromQueue());
  }

  private dispareFilesPayloadIntoQueue() {
    Deno.cron("Liten and insert persons from the AWS SQS queue!", "0 0 * * *", async () => await new FileService().handlerPersonFromObjectIntoSQS());
  }
}

