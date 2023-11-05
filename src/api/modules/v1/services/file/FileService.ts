import { FormDataFile } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import SimpleCloudStorage from "../../components/aws.component.ts";
import { IFileDTO, IFileService } from '../../../../../common/interfaces/index.ts';
import { FileRespository } from "../../repository/index.ts";

class FileService implements IFileService {
  private s3: typeof SimpleCloudStorage;
  private fileRepository: typeof FileRespository;

  constructor(s3: typeof SimpleCloudStorage) {
    this.s3 = s3;
    this.fileRepository = FileRespository;
  }

  public async handlerFilesPerson(files: Array<FormDataFile>): Promise<void> {
    return this.processFilesPerson(files);
  }

  private async processFilesPerson(files: Array<FormDataFile>): Promise<void> {
    const person: Array<string> = [];

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

        const readS3 = await this.s3.readFileFromS3(filename) as Array<string>;

        await this.fileRepository.handleCreate(filename);

        for (const result of readS3) {
          const [name, age, sex, size, weight] = result.split(",");
          console.log(result.split(','))
        }
      }
    }
  }

  public async listFiles(): Promise<Array<IFileDTO>> {
    return this.fileRepository.list();
  }
}

export default new FileService(SimpleCloudStorage)
