import { FormDataFile } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import SimpleCloudStorage from "../components/aws.component.ts";
import { IFileService } from '../../../../common/interfaces/index.ts';
import Usuario from '../models/UsuarioPassageiro.ts';
import ContaConvite from "../models/Invites.ts";

class FileService implements IFileService {
  private s3: typeof SimpleCloudStorage;
  constructor(s3: typeof SimpleCloudStorage) {
    this.s3 = s3;
  }

  public async handlerFilesCoordinator(files: Array<FormDataFile>): Promise<void> {
    return this.processFilesCoordinator(files);
  }

  private async processFilesCoordinator(files: Array<FormDataFile>): Promise<void> {
    const emailsCoordinator: Array<string> = []
    const emailsCoordinated: Array<string> = []

    for (const file of files) {
      const isTypeCsvOrXml = file.contentType === "text/csv" ||
        file.contentType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

      if (isTypeCsvOrXml) {
        const filename = `Coordinator-${crypto.randomUUID()}.csv`;
        const read = await Deno.readFile(String(file.filename));

        const decoder = new TextDecoder("utf-8");
        const lines = decoder.decode(read).replace(/\r\n|\n/g, "\n").split("\n");
        lines.shift();

        const whithoutHeader = new TextEncoder().encode(lines.join("\n"));

        await this.s3.handlerBucket(whithoutHeader, filename);
        const readS3 = await this.s3.readFileFromS3(filename) as Array<string>;

        for (const result of readS3) {
          const [coordinatedEmails, coordinatorEmails, Coordinator] = result.split(",");
          emailsCoordinated.push(coordinatedEmails);
          emailsCoordinator.push(coordinatorEmails);
        }

        const emails = await Usuario.getUserByEmails(emailsCoordinated);
        const { emailsNotFounded } = emails;

        if (emailsNotFounded) {
          const emailsNotFoundedFileName = `emailsNotFounded-${crypto.randomUUID()}.csv`;

          await this.s3.handlerBucket(new TextEncoder().encode(emailsNotFounded.join("\n")), emailsNotFoundedFileName);

          await this.s3.downloadFileFromS3(emailsNotFoundedFileName);;
        }
      }
    }
  }
}

export default new FileService(SimpleCloudStorage)
