import { FilenameEnum, IFileDTO } from "$common";
import { File } from "$models";
import { MySql } from '$db';

class FileRepository extends File {
  public table = 'tb_filename';
  private mysql: typeof MySql = MySql;

  public async handleCreate(file: string): Promise<IFileDTO> {
    return this.create(file);
  }

  private async create(file: string): Promise<IFileDTO> {
    const query = `
        INSERT INTO ${this.table} (
          id,
          name
        ) VALUES (
          UUID(),
          ?
        );
      `;

    return this.mysql.buildQuery(query, [file.replace(/\n/, "")]);
  }

  public async list(): Promise<Array<IFileDTO>> {
    return this.listAll();
  }

  private async listAll(): Promise<Array<IFileDTO>> {
    return this.mysql.buildQuery(`
      SELECT
        id,
        name,
        created_at
      FROM ${this.table};
    `);
  }

  public async pendingFiles(): Promise<Array<IFileDTO>> {
    return this.foundPending();
  }

  private async foundPending(): Promise<Array<IFileDTO>> {
    return this.mysql.buildQuery(
      `
        SELECT
          id,
          name,
          status
        FROM ${this.table}
        WHERE status = ?;
      `, [FilenameEnum.PENDING]
    );
  }

  public updatedAfterListenAll(id: string) {
    return this.updateStatusAfterListenAll(id);
  }

  private updateStatusAfterListenAll(id: string) {
    return this.mysql.buildQuery(
      `
        UPDATE ${this.table}
        SET status = ?
        WHERE id = ?;
      `, [FilenameEnum.LAUNCHED, id]
    );
  }
}

export default new FileRepository();
