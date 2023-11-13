import { FormDataFile, _Object } from "$deps";
import { S3 } from "$components";
import {
  FilenameEnum,
  IFileDTO,
  IFileService,
} from "$common";
import { FileRespository } from "$repositories";
import { PersonService } from "$service/person/PersonService.ts";

export class FileService implements IFileService {
  private s3: typeof S3;
  private fileRepository: typeof FileRespository;
  private personService: PersonService = new PersonService()

  constructor() {
    this.s3 = S3;
    this.fileRepository = FileRespository;
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

  public async listenFiles() {
    const files = await this.fileRepository.pendingFiles();

    if (!files) {
      return;
    }

    const pendings = files.filter(
      file => file.status === FilenameEnum.PENDING
    );

    for (const pending of pendings) {
      if (pending.status === FilenameEnum.PENDING) {
        this.personService.listenAndCreatePerson(pending.name);
        await this.fileRepository.updatedAfterListenAll(pending.id)
        continue;
      };
    }

    return files;
  }

  public async listAllObjectsFromBucket() {
    const objects = await this.s3.listObjects() as Array<_Object>;

    const objectsFiltered = objects.map(object => {
        return {
          name: object.Key,
          size: object.Size,
        }
    });

    return objectsFiltered;
  }
}

export default new FileService()
