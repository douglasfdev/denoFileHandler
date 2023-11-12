import { MySql } from '$db';
import { Person } from "$models";
import { IPersonDTO } from "$common";

class PersonRepository extends Person {
  public table = 'tb_person';
  private mysql: typeof MySql = MySql;

  public listPersons() {
    return this.getPersons();
  }

  public async createPersons(person: Partial<IPersonDTO>) {
    return this.create(person);
  }

  private async create(person: Partial<IPersonDTO>) {
    const q = `
        INSERT INTO ${this.table} (
          id,
          name,
          age,
          sex,
          size,
          weight
        ) VALUES (
          UUID(),
          ?,
          ?,
          ?,
          ?,
          ?
        );
      `;

    const values = [
      person.name,
      person.age,
      person.sex,
      person.size,
      person.weight
    ];

    return this.mysql.buildQuery(q, values);
  }

  private getPersons() {
    return this.mysql.buildQuery(
      `
        SELECT
          id,
          name,
          age,
          sex,
          size,
          weight
        FROM ${this.table};
      `
    );
  }
}

export default new PersonRepository();
