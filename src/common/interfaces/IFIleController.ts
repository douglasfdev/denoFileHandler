import { RouterContext } from '$deps';
export interface IFileController {
  uploadCsv(ctx: RouterContext<string>): Promise<void>;
}