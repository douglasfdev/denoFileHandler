import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { file } from "./file.ts";
import { person } from "./person.ts";

const router = new Router();

router.use("/v1/api/", file.routes());
router.use("/v1/api/", person.routes());

export const routing = router.routes();
