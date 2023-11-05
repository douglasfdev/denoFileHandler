import { FormDataFile } from 'https://deno.land/x/oak@v12.6.1/mod.ts';
import { PutObjectOutput } from 'https://deno.land/x/aws_api@v0.8.1/services/s3/structs.ts';
export interface IFileService {
  handlerFilesPerson(files: Array<FormDataFile>): Promise<void>
}