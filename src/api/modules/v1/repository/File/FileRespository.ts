import { IFileDTO } from "../../../../../common/interfaces/index.ts";
import { client } from "../../../../db/connection.ts";
import { File } from "../../models/file/File.ts";

class FileRepository extends File {
  public table: string = 'tb_filename';

  public async handleCreate(file: string): Promise<IFileDTO> {
    return this.create(file);
  }

  private async create(file: string): Promise<IFileDTO> {
    const q = `
        INSERT INTO ${this.table} (
          id,
          name
        ) VALUES (
          UUID(),
          ?
        );
      `;

    return await client.query(q, [file.replace(/\n/, "")]);
  }

  public async list(): Promise<Array<IFileDTO>> {
    return this.listAll();
  }

  private async listAll(): Promise<Array<IFileDTO>> {
    return client.query(`
      SELECT
        id,
        name,
        created_at
      FROM ${this.table};
    `);
  }
}

export default new FileRepository();
