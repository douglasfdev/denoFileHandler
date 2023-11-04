import { PersonEnum } from "../../../../../common/enums/PersonEnum.ts";
import { IPersonDTO } from "../../../../../common/interfaces/index.ts";

class Person implements IPersonDTO{
  id!: string;
  name!: string;
  age!: number;
  sex!: PersonEnum;
  size!: number;
  weight!: number;
}

export default new Person();
