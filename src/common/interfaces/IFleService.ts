import { FormDataFile, PutObjectOutput } from '$deps';
export interface IFileService {
  handlerFilesPerson(files: Array<FormDataFile>): Promise<void>
}
