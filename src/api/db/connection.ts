import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { mySqlConfig } from "../../common/mysql.config.ts";

export const client = await new Client().connect(mySqlConfig);
