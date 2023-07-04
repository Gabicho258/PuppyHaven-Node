import connection from "../../database.js";
import { TableName, TableCodFields } from "../../infoTables.js";

export default class DistritoModel {
  static getAll() {
    return connection.execute(`SELECT * FROM ${TableName.DISTRITOS}`);
  }

  static create(disNom) {
    return connection.execute(
      `INSERT INTO ${TableName.DISTRITOS} (DisNom) VALUES("${disNom}")`
    );
  }

  static update(disCod, disNom) {
    return connection.execute(
      `UPDATE ${TableName.DISTRITOS} set DisNom="${disNom}" WHERE  ${
        TableCodFields[TableName.DISTRITOS]
      }= ${disCod}`
    );
  }
  static getDistritoPorCod(disCod) {
    return connection.execute(
      `SELECT * FROM ${TableName.DISTRITOS} WHERE DisCod=${disCod}`
    );
  }
}
