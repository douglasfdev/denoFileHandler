import { FileService } from '$service/file/FileService.ts';
import { PersonService } from "$service/person/PersonService.ts";
import {
  everyMinute,
  every15Minute,
} from '$deps';

export class Slinger {
  constructor() {
    this.init();
  }

  private init() {
    this.handleDisareByMinute();
    this.handleDispareByFiftyMinute();
  }

  private handleDisareByMinute() {
    everyMinute(async () => {
      await new FileService().listenFiles();
    });
  }

  private handleDispareByFiftyMinute() {
    every15Minute(async () => {
      await new PersonService().listenAndInsertIntoQueue();
    });
  }
}

export default new Slinger();
