import { mySqlConfig } from "$common";
import { Client } from "$deps";

export class Migration_Tb_Filename {
  private connection: Client = new Client();

  constructor() {
    this.connection.connect(mySqlConfig);
    this.migration_tb_filename();
  }

  private migration_tb_filename() {
    return this.connection.query(
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
  }
}

new Migration_Tb_Filename();
