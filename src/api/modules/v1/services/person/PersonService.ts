import { PersonRepository } from "$repositories";
import { IPersonDTO } from "$common";
import { S3 } from "$components";

class PersonService {
  private personRpository: typeof PersonRepository;
  private s3: typeof S3;

  constructor() {
    this.personRpository = PersonRepository;
    this.s3 = S3;
  }

  public async listPerson() {
    return this.personRpository.listPersons();
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

    const person: Array<Partial<IPersonDTO>> = []
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

      await this.personRpository.createPersons(personObject);
      person.push(personObject);
    }

    return person;
  }
}

export default new PersonService();
