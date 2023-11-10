import { client } from '$db';
import { Person } from "$models";

class PersonRepository extends Person {
  public table: string = 'tb_person';

  public listPersons() {
    return client.query(
      `
        SELECT * FROM ${this.table};
      `
    );
  }
}

export default new PersonRepository();
