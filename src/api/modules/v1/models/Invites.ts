import { client } from "../../../db/connection.ts";

class ContaConvite {
  public table() {
    return 'tb_conta_convite';
  }

  public async getUserByInviteMails(emails: Array<string>): Promise<any> {
    return await this.byInviteUserEmails(emails)
  }

  private async byInviteUserEmails(emails: Array<string>): Promise<any> {
    return client.query(`
      SELECT idUsuario
      FROM ${this.table()}
      WHERE emailPlain IN (${emails.map((email) => `'${email}'`).join(",")})
      AND idUsuario <> ''
    `)
  }
}

export default new ContaConvite();
