import { mySqlConfig } from "../../../common/mysql.config.ts";
import { client } from "../connection.ts";

await client.connect(mySqlConfig);

client.query(
  `
    CREATE TABLE IF NOT EXISTS tb_pessoa (
      id VARCHAR(255) DEFAULT(UUID_TO_BIN(UUID())),
      name VARCHAR(255) NOT NULL,
      age INT NOT NULL,
      sex ENUM("M", "F", "O") NOT NULL,
      size DECIMAL(5,2) NOT NULL,
      weight DECIMAL(5,2) NOT NULL,
      PRIMARY KEY (id),
      INDEX idx_name (name),
      INDEX idx_age (age),
      INDEX idx_sex (sex),
      INDEX idx_size (size),
      INDEX idx_weight (weight)
    );
  `
);
