import { Router } from "$deps";
import { PersonController } from '$controllers';

const person = new Router();

person.get("listPersons/", PersonController.listPersons);

export { person };
