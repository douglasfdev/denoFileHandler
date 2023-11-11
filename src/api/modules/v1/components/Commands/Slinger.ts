import { FileService } from '$service/file/FileService.ts';
import {
  everyMinute
} from '$deps';

export class Slinger {
  constructor() {
    this.init();
  }

  private init() {
    this.handleDisareByMinute()
  }

  private handleDisareByMinute() {
    everyMinute(async () => {
      await new FileService().listenFiles();
    })
  }
}

export default new Slinger();
