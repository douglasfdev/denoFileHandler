import { Slinger } from "$component/Jobs/Slinger.ts";

export class Commands {
  private slingerArg = 0;

  constructor() {
    this.init();
  }

  private init() {
    return this.slinger();
  }

  private async slinger() {
    const command = Deno.args[this.slingerArg];

    if (command !== '--slinger') return;

    new Slinger();
  }
}

export default new Commands();