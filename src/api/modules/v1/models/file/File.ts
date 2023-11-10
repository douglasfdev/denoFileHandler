import { IFileDTO } from "$common";

export class File implements IFileDTO {
  id!: string;
  name!: string;
}
