import { FileService } from '$service/file/FileService.ts';
import { PersonService } from "$service/person/PersonService.ts";
import {
  everyMinute,
  every15Minute,
  start
} from '$deps';

export class Slinger {
  constructor() {
    this.init();
  }

  private init() {
    // this.handleDisareByMinute();
    this.handleDispareByFiftyMinute();
    start();
  }

  private handleDisareByMinute() {
    everyMinute(async () => {
      await new FileService().listenFiles();
    });
  }

  private handleDispareByFiftyMinute() {
    everyMinute(async () => {
      await new PersonService().listenAndInsertPersonFromQueue();
    });
  }
}

export default new Slinger();
