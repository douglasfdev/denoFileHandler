import { PersonEnum } from "../enums/index.ts";

export interface IPersonDTO {
  id: string;
  name: string;
  age: number;
  sex: PersonEnum;
  size: number;
  weight: number;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
};
