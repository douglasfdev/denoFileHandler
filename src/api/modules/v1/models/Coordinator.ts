import { client } from "../../../db/connection.ts";
import UsuarioPassageiro from "./UsuarioPassageiro.ts";
import { IUserDTO } from "../../../../common/interfaces/IUser.ts";

class Coordinator {
  private passageiro: typeof UsuarioPassageiro;
  constructor(
      passageiro: typeof UsuarioPassageiro
    ) {
    this.passageiro = passageiro;
  }

  public table() {
    return "tb_coordenador";
  }

  public async getCoordinatorByEmails(emails: Array<string>) {
    return this.byEmailCoordinator(emails);
  }

  private async byEmailCoordinator(emails: Array<string>): Promise<IUserDTO> {
    return client.query(`
      SELECT ${this.table()}.id, ${this.table()}.idCliente
      FROM ${this.table()}
      INNER JOIN ${this.passageiro.table()} ON ${this.passageiro.table()}.id = ${this.table()}.idUsuario
      WHERE ${this.passageiro.table()}.email IN ("${emails.join("','")}")
    `);
  }
}

export default new Coordinator(
  UsuarioPassageiro
);
