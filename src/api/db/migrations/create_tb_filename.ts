import { mySqlConfig } from "../../../common/mysql.config.ts";
import { client } from "../connection.ts";

await client.connect(mySqlConfig);

client.query(
  `
    CREATE TABLE IF NOT EXISTS tb_filename (
      id VARCHAR(255) DEFAULT(UUID_TO_BIN(UUID())),
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP DEFAULT NULL,
      PRIMARY KEY (id),
      INDEX idx_id (id),
      INDEX idx_name (name)
    );
  `
);
