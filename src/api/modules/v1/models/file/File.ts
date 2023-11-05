import { IFileDTO } from "../../../../../common/interfaces/index.ts";

export class File implements IFileDTO {
  id!: string;
  name!: string;
}

export default new File();
