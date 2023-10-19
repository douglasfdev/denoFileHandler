import { client } from "../../../db/connection.ts";
import { IUserDTO } from "../../../../common/interfaces/index.ts";

class Usuario {
  public table() {
    return "tb_perfil_passageiro";
  }

  public async getUserByEmails(emails: Array<string>) {
    return this.byUserEmails(emails);
  }

  private async byUserEmails(emails: Array<string>) {
    const query = await client.execute(`
      SELECT id, email
      FROM ${this.table()}
      WHERE email IN (${emails.map((email) => `'${email}'`).join(",")})
    `);

    const emailsFounded = query.rows?.map((row) => row.email) ?? [];
    const emailsNotFounded = emails.filter((email) => !emailsFounded.includes(email));
    const ids = query.rows?.map((row) => row.id) ?? [];

    return {
      emailsFounded,
      emailsNotFounded,
      ids
    };
  }
}

export default new Usuario();
