import { ExecuteResult } from "https://deno.land/x/mysql@v2.12.1/mod.ts";
import { IUserDTO } from "./IUser.ts";

export interface IUserAssociationFile {
  table(): string;
  getCoordinatorByEmails(emails: Array<string>): Promise<IUserDTO>;
  getCoordinatedByEmails(emails: Array<string>): Promise<Partial<IUserDTO>>;
  insertIntoWithCsvToCoordinator(file: string, idCliente :number): Promise<ExecuteResult>;
}
