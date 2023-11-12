import {
  FileRespository,
  PersonRepository,
} from "$repositories";
import {
FilenameEnum,
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
  private fileRepository: typeof FileRespository;
  private s3: SimpleCloudStorage;
  private sQs: SimpleQueueService;

  constructor() {
    this.personRepository = PersonRepository;
    this.s3 = S3;
    this.sQs = new SimpleQueueService();
    this.fileRepository = FileRespository;
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
    const files = await this.fileRepository.pendingFiles();

    if (!files) return ;

    const pendings = files.filter(
      file => file.status === FilenameEnum.PENDING
    );

    if (!pendings) return;

    const person: Array<Partial<IPersonDTO>> = [];

    const datas = await this.sQs.receiptMessage();

    for (const data of datas) {
      const payload = data.Body as string;
      const personObject: Partial<IPersonDTO> = JSON.parse(payload);

      await this.personRepository.createPersons(personObject);
      await this.fileRepository.updatedAfterListenAll();
      person.push(personObject);
      continue;
    }

    return person;
  }
}

export default new PersonService();
