import { client } from '../../../../db/connection.ts';

class PersonRepository {
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
