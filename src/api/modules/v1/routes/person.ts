import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { PersonController } from '../controllers/index.ts';

const person = new Router();

person.get("listPersons/", PersonController.listPersons);

export { person };
