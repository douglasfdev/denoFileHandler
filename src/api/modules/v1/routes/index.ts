import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { file } from "./file.ts";

const router = new Router();

router.use("/v1/api/", file.routes())

export const routing = router.routes();
