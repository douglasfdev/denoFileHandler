import { PersonRepository } from "$repositories";
import { IPersonDTO } from "$common";

class PersonService {
  private personRpository: typeof PersonRepository

  constructor() {
    this.personRpository = PersonRepository;
  }

  public async listPerson() {
    return this.personRpository.listPersons();
  }

  public async create(personDTO: Partial<IPersonDTO>): Promise<IPersonDTO> {
    return this.createPerson(personDTO);
  }

  private async createPerson(personDTO: Partial<IPersonDTO>): Promise<IPersonDTO> {
    if (!personDTO) {
      throw new Error(`Person ${personDTO} is required`);
    }

    return this.personRpository.createPersons(personDTO);
  }
}

export default new PersonService();
