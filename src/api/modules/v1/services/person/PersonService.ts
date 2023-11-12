import { PersonRepository } from "$repositories";
import {
  IPersonDTO,
  log
} from "$common";
import {
  S3,
} from "$components";
import { SimpleCloudStorage } from "$component/AWS/s3.component.ts";
import {  SimpleQueueService } from "$component/AWS/sqs.component.ts";

export class PersonService {
  private personRepository: typeof PersonRepository;
  private s3: SimpleCloudStorage;
  private sQs: SimpleQueueService;

  constructor() {
    this.personRepository = PersonRepository;
    this.s3 = S3;
    this.sQs = new SimpleQueueService();
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

  public async listenAndInsertIntoQueue() {
    const body = this.sQs.receiptMessage();
    console.log(body);
  }
}

export default new PersonService();
