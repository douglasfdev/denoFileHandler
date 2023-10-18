import { client } from "../../../db/connection.ts";
import { IUserDTO } from "../../../../common/interfaces/index.ts";

class Usuario {
  public table() {
    return "tb_usuario";
  }

  public async getUserByEmails(emails: Array<string>): Promise<IUserDTO> {
    return this.byUserEmails(emails);
  }

  private async byUserEmails(emails: Array<string>): Promise<IUserDTO> {
    return client.query(`
      SELECT id
      FROM ${this.table()}
      WHERE email IN ("${emails.join("','")}")
    `)
  }
}

export default new Usuario();
