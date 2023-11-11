import { log, mySqlConfig } from "$common";
import { Client } from '$deps';

export class MySql {
  private static connection: Client = new Client();
  private static connectionAttempts = 0;

  constructor() {
    MySql.build();
  }

  private static async build() {
    return MySql.connection.connect(mySqlConfig);
  }

  public static async buildQuery(sql: string, params?: Array<any>) {
    try {
      const init = await MySql.build();
      const query = await init.query(sql, params);

      if (!query.length) {
        throw new Error("Does'nt have data for this query");
      }

      await init.close();

      return query;
    } catch (e) {
      if (e instanceof Deno.errors.ConnectionRefused){
        log.error(e.message);
        throw new Error(`connection refused ${e.message}`)
      }
    }
  }

}
