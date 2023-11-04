import { client } from '../../../../db/connection.ts';

class PersonRepository {
  public table() {
    return 'tb_person';
  };

  public listPersons() {
    return client.query(
      `
        SELECT * FROM ${this.table()};
      `
    );
  }
}

export default new PersonRepository();
