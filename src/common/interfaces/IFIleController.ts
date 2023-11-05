import { RouterContext } from 'https://deno.land/x/oak@v12.6.1/mod.ts';
export interface IFileController {
  uploadCsv(ctx: RouterContext<string>): Promise<void>;
}