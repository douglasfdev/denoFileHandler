import { FormDataFile } from "$deps";
import { S3 } from "$components";
import { IFileDTO, IFileService, IPersonDTO } from "$common";
import { FileRespository, PersonRepository } from "$repositories";
import { PersonService } from "$services";

class FileService implements IFileService {
  private s3: typeof S3;
  private fileRepository: typeof FileRespository;
  private personService: typeof PersonService;

  constructor(s3: typeof S3) {
    this.s3 = s3;
    this.fileRepository = FileRespository;
    this.personService = PersonService;
  }

  public async handlerFilesPerson(files: Array<FormDataFile>): Promise<void> {
    return this.processFilesPerson(files);
  }

  private async processFilesPerson(files: Array<FormDataFile>): Promise<void> {
    const user: Array<Partial<IPersonDTO>> = []

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

        const readS3 = await this.s3.readFileFromS3(filename) as Array<string>;

        for (const result of readS3) {
          const [name, age, sex, size, weight] = result.split(",");
          const personObject = {
            name,
            age: Number(age),
            sex,
            size: Number(size),
            weight: Number(weight)
          }

          await this.personService.create(personObject)
        }
      }
    }
  }

  public async listFiles(): Promise<Array<IFileDTO>> {
    return this.fileRepository.list();
  }
}

export default new FileService(S3)
