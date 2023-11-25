import { FormDataFile, _Object } from "$deps";
import { S3 } from "$components";
import {
  FilenameEnum,
  IFileDTO,
  IFileService,
  log,
} from "$common";
import { FileRespository } from "$repositories";
import { PersonService } from "$service/person/PersonService.ts";
import { IObjectS3DTO, IPersonDTO } from '$interfaces';
import { SimpleQueueService } from "$component/AWS/sqs.component.ts";

export class FileService implements IFileService {
  private fileRepository: typeof FileRespository;
  private personService: PersonService;
  private s3: typeof S3;
  private sQs: SimpleQueueService;
  private status = {
    "PENDING": "PENDING",
    "LAUNCHED": "LAUNCHED"
  };

  constructor() {
    this.s3 = S3;
    this.sQs = new SimpleQueueService();
    this.fileRepository = FileRespository;
    this.personService = new PersonService();
  }

  public async handlerFilesPerson(files: Array<FormDataFile>): Promise<string> {
    return this.processFilesPerson(files);
  }

  private async processFilesPerson(files: Array<FormDataFile>): Promise<string> {
    if (!files) {
      throw new Error('The file is required');
    }
    let name = '';

    for (const file of files) {
      const isTypeCsvOrXml = file.contentType === "text/csv" ||
        file.contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (isTypeCsvOrXml) {
        const filename = `${crypto.randomUUID()}.csv`;

        const read = await Deno.readFile(String(file.filename));

        const decoder = new TextDecoder("utf-8");
        const lines = decoder.decode(read).replace(/\r\n|\n/g, "\n").split("\n");
        lines.shift();

        const whithoutHeader = new TextEncoder().encode(lines.join("\n"));

        await this.s3.handlerBucket(whithoutHeader, filename);

        await this.fileRepository.handleCreate(filename);

        name = filename;
      }
    }
    return name;
  }

  public async listFiles(): Promise<Array<IFileDTO>> {
    return this.fileRepository.list();
  }

  public async listenFilesFromDB(): Promise<void> {
    const filesPending = await this.fileRepository.pendingFiles();

    if (!filesPending) {
      return;
    }

    for (const filePending of filesPending) {
      await this.personService.listenAndCreatePerson(filePending.name);
      await this.fileRepository.updatedAfterListenAll(filePending.id)

      continue;
    }
  }

  public async listAllObjectsFromBucket(): Promise<Array<IObjectS3DTO>> {
    const objects = await this.s3.listObjects() as Array<_Object>;

    const objectsFiltered: Array<IObjectS3DTO> = objects.map(object => {
      return {
        name: object.Key,
        size: object.Size,
      }
    });

    return objectsFiltered;
  }

  public async handlerPersonFromObjectIntoSQS() {
    const objects = await this.listAllObjectsFromBucket();

    const personList: Partial<IPersonDTO>[] = []

    for (const object of objects) {
      const pendingsFiles = await this.fileRepository.pendingFilesByName(object.name as string);

      if (!pendingsFiles) {
        return;
      }

      pendingsFiles.forEach(async file => {
        if (String(file.status) !== this.status.PENDING) {
          log.success("Done process with success!");
          return;
        }

        const getS3Object = await this.s3.readFileFromS3(object.name as string) as Array<string>;

        for (const result of getS3Object) {
          const [name, age, sex, size, weight] = result.split(',');
          const person: Partial<IPersonDTO> = {
            name,
            age: Number(age),
            sex,
            size: Number(size),
            weight: Number(weight)
          }

          await this.sQs.handleQueue(person);
          continue;
        }

        await this.fileRepository.updatedAfterListenAll(file.id as string);
      });
    };
  }
}

export default new FileService()
