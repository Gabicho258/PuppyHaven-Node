import connection from "../../database.js";
import { TableName, TableCodFields } from "../../infoTables.js";

export default class CalificacionModel {
  static getAll() {
    return connection.execute(`SELECT * FROM ${TableName.CALIFICACIONES}`);
  }

  static create(calMeGus, calNoGus) {
    return connection.execute(
      `INSERT INTO ${TableName.CALIFICACIONES} VALUES (${calMeGus},${calNoGus})`
    );
  }

  static update(calCod, calMeGus, calNoGus) {
    return connection.execute(
      `UPDATE ${
        TableName.CALIFICACIONES
      } set CalMeGus=${calMeGus}, CalNoGus=${calNoGus} WHERE  ${
        TableCodFields[TableName.CALIFICACIONES]
      }= ${calCod}`
    );
  }
  static getCalificacionesPorCod(calCod) {
    return connection.execute(
      `SELECT * FROM ${TableName.CALIFICACIONES} WHERE CalCod=${calCod}`
    );
  }
}
