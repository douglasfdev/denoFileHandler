import { FormDataFile } from "$deps";
import { S3 } from "$components";
import {
  FilenameEnum,
  IFileDTO,
  IFileService,
  IPersonDTO
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

  public async handlerFilesPerson(files: Array<FormDataFile>): Promise<void> {
    return this.processFilesPerson(files);
  }

  private async processFilesPerson(files: Array<FormDataFile>): Promise<void> {
    if (!files) {
      throw new Error('The file is required');
    }

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
      }
    }
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
      if (pending.status === 0) {
        this.personService.listenAndCreatePerson(pending.name);
        await this.fileRepository.updatedAfterListenAll();
        continue;
      };
    }

    return files;
  }
}

export default new FileService()
