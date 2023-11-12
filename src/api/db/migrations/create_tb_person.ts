
import { Client } from "$deps";
import { mySqlConfig } from "$common";

export class Migration_Tb_Person {
  private connection: Client = new Client();

  constructor() {
    this.connection.connect(mySqlConfig);
    this.migration_tb_person();
  }

  private migration_tb_person() {
    return this.connection.query(
    `
      CREATE TABLE IF NOT EXISTS tb_person (
        id VARCHAR(255) DEFAULT(UUID_TO_BIN(UUID())),
        name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        sex VARCHAR(255) NOT NULL,
        size DECIMAL(5,2) NOT NULL,
        weight DECIMAL(5,2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        deleted_at TIMESTAMP DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX idx_id (id),
        INDEX idx_name (name),
        INDEX idx_age (age),
        INDEX idx_sex (sex),
        INDEX idx_size (size),
        INDEX idx_weight (weight)
      );
    `
    );
  }
}

new Migration_Tb_Person();
