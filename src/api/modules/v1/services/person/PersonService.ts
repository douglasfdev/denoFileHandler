import { PersonRepository } from "$repositories";
import {
  IPersonDTO,
  log
} from "$common";
import {
  S3,
} from "$components";

export class PersonService {
  private personRepository: typeof PersonRepository;
  private s3: typeof S3;

  constructor() {
    this.personRepository = PersonRepository;
    this.s3 = S3;
  }

  public async listPerson() {
    return this.personRepository.listPersons();
  }

  public async create(filename: string): Promise<Array<Partial<IPersonDTO>>> {
    return this.createPerson(filename);
  }

  private async createPerson(
      filename: string
  ): Promise<Array<Partial<IPersonDTO>>> {
    if (!filename) {
      throw new Error(`Archive is required`);
    }

    const person: Array<Partial<IPersonDTO>> = [];
    const readS3 = await this.s3.readFileFromS3(filename) as Array<string>;

    for (const result of readS3) {
      const [name, age, sex, size, weight] = result.split(",");
      const personObject: Partial<IPersonDTO> = {
        name,
        age: Number(age),
        sex,
        size: Number(size),
        weight: Number(weight)
      }

      await this.personRepository.createPersons(personObject);
      person.push(personObject);
    }

    return person;
  }

  public async listenAndCreatePerson(filename: string) {
    if (!filename) {
      throw new Error(`Archive is required`);
    }

    const person: Array<Partial<IPersonDTO>> = [];
    const readS3 = await this.s3.readFileFromS3(filename) as Array<string>;

    for (const result of readS3) {
      const [name, age, sex, size, weight] = result.split(",");
      const personObject: Partial<IPersonDTO> = {
        name,
        age: Number(age),
        sex,
        size: Number(size),
        weight: Number(weight)
      }

      await this.personRepository.createPersons(personObject);
      person.push(personObject);
    }

    return person;
  }
}

export default new PersonService();
