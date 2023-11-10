import { RouterContext } from '$deps';

export type CSVType = { message: string } | undefined;
export interface IFileController {
  uploadCsv(ctx: RouterContext<string>): Promise<CSVType>;
}