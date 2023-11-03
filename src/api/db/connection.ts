import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { mySqlConfig } from "../../common/mysql.config.ts";

export const client = await new Client().connect(mySqlConfig);

client.query(
  `
    CREATE TABLE IF NOT EXISTS tb_pessoa (
      id UUID DEFAULT DEFAULT(UUID()),
      name VARCHAR(255) NOT NULL,
      age INT NOT NULL,
      sex ENUM("M", "F", "O") NOT NULL,
      size DECIMAL(5,2) NOT NULL,
      weight DECIMAL(5,2) NOT NULL,
      PRIMARY KEY (id)
    )
  `
);
