import { FormDataFile } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import SimpleCloudStorage from "../components/aws.component.ts";
import { IFileService } from '../../../../common/interfaces/index.ts';

class FileService implements IFileService {
  private s3: typeof SimpleCloudStorage;
  constructor(s3: typeof SimpleCloudStorage) {
    this.s3 = s3;
  }

  public async handlerFiles(files: Array<FormDataFile>): Promise<void> {
    return this.processFiles(files);
  }

  private async processFiles(files: Array<FormDataFile>): Promise<void> {
    const emailsCoordinator: Array<string> = []
    const emailsCoordinated: Array<string> = []

    for (const file of files) {
      const isTypeCsvOrXml = file.contentType === "text/csv" ||
        file.contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (isTypeCsvOrXml) {
        const filename = `${String(crypto.randomUUID())}.csv`;
        const read = await Deno.readFile(String(file.filename));

        const decoder = new TextDecoder("utf-8");
        const lines = decoder.decode(read).replace(/\r\n|\n/g, "\n").split("\n");
        lines.shift();

        const whithoutHeader = new TextEncoder().encode(lines.join("\n"));

        await this.s3.handlerBucket(whithoutHeader, filename);
        const readS3 = await this.s3.readFileFromS3(filename) as Array<string>;

        for (const result of readS3) {
          const [coordinatorEmails, emailCoordenador] = result.split(",");
          emailsCoordinator.push(coordinatorEmails);
          emailsCoordinated.push(emailCoordenador);
        }
      }
    }
  }
}

export default new FileService(SimpleCloudStorage)
