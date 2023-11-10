import { PersonEnum } from "$common";
import { IPersonDTO } from "$common";

export class Person implements IPersonDTO{
  id!: string;
  name!: string;
  age!: number;
  sex!: PersonEnum;
  size!: number;
  weight!: number;
}
