import { client } from "../../../db/connection.ts";
import Coordinator from "./Coordinator.ts";
import UsuarioPassageiro from "./UsuarioPassageiro.ts";
import { IUserDTO } from "../../../../common/interfaces/IUser.ts";

class Coordinated {
  private passenger: typeof UsuarioPassageiro
  private coordinator: typeof Coordinator

  constructor(
    passenger: typeof UsuarioPassageiro,
    coordinator: typeof Coordinator
  ) {
    this.passenger = passenger
    this.coordinator = coordinator
  }

  public table() {
    return "tb_usuario_coordenador"
  }

  public async getCoordinatedByEmails(emails: Array<string>): Promise<Partial<IUserDTO>> {
    return this.byEmailCoordinated(emails);
  }

  private async byEmailCoordinated(emails: Array<string>): Promise<Partial<IUserDTO>> {
    return client.query(`
      SELECT ${this.table()}.id, ${this.table}.idCoordenador
      FROM ${this.table()}
      INNER JOIN ${this.passenger.table()} ON ${this.passenger.table()}.id = ${this.table()}.idUsuario
      WHERE ${this.passenger.table()}.email IN ("${emails.join("','")}")
    `)
  }
}

export default new Coordinated(
  UsuarioPassageiro,
  Coordinator
);
