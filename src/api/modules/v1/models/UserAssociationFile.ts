import {
  IUserAssociationFile,
  IUserDTO
} from "../../../../common/interfaces/index.ts";
import { client } from "../../../db/connection.ts";
import { UserAssociationStatusEnum } from "../../../../common/enums/index.ts";
import UsuarioPassageiro from "./UsuarioPassageiro.ts";
import Coordinator from "./Coordinator.ts";
import Coordinated from "./Coordinated.ts";

class UserAssociationFile implements IUserAssociationFile {
  private passageiro: typeof UsuarioPassageiro;
  private coordinator: typeof Coordinator;
  private coordinated: typeof Coordinated;

  constructor(
      usuario: typeof UsuarioPassageiro,
      coordinator: typeof Coordinator,
      coordinated: typeof Coordinated
    ) {
    this.passageiro = usuario;
    this.coordinator = coordinator;
    this.coordinated = coordinated;
  }

  public table(): string {
    return "tb_associar_usuarios_arquivo";
  };

  public async getCoordinatorByEmails(emails: Array<string>): Promise<IUserDTO> {
    return this.byEmailCoordinator(emails);
  }

  public async getCoordinatedByEmails(emails: Array<string>): Promise<Partial<IUserDTO>> {
    return this.byEmailCoordinated(emails);
  }

  public async insertIntoWithCsvToCoordinator(file: string, idCliente: number) {
    return this.setCsvToCoordinator(file, idCliente);
  }

  private async setCsvToCoordinator(file: string, idCliente: number) {
    return client.execute(`
      INSERT INTO ${this.table()} (
        idCliente,
        caminhoArquivo,
        opcoes,
        processo,
        statusProcesso,
        dataProcesso,
        dataCriacao,
        dataAlteracao,
        categoria,
        dataHora
        ) VALUES (
          ?,
          ?,
          ?,
          ?,
          ?,
          NOW(),
          NOW(),
          ?,
          NOW(),
          NOW()
        )
    `, [
      idCliente,
      file,
      "",
      crypto.randomUUID(),
      UserAssociationStatusEnum.STATUS_ARQUIVO_PENDENTE,
    ])
  }

  private async byEmailCoordinator(emails: Array<string>): Promise<IUserDTO> {
    return this.coordinator.getCoordinatorByEmails(emails);;
  }

  private async byEmailCoordinated(emails: Array<string>): Promise<Partial<IUserDTO>> {
    return this.coordinated.getCoordinatedByEmails(emails);
  }
}

export default new UserAssociationFile(
  UsuarioPassageiro,
  Coordinator,
  Coordinated
);
