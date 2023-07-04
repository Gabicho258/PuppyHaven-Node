import connection from "../../database.js";
import { TableName, TableCodFields } from "../../infoTables.js";

export default class PaseosModel {
  static getAll() {
    return connection.execute(`SELECT * FROM ${TableName.PASEOS}`);
  }

  static create(pasCod, useCod, pasDir, masCod, pasEst = "P") {
    return connection.execute(
      `INSERT INTO ${TableName.PASEOS} VALUES (${pasCod},${useCod},"${pasDir}",${masCod},"${pasEst}")`
    );
  }

  static update(pasNum, pasDir, masCod, pasEst) {
    return connection.execute(
      `UPDATE ${
        TableName.PASEOS
      } set PasDir="${pasDir}", MasCod=${masCod}, PasEst="${pasEst}"  WHERE  ${
        TableCodFields[TableName.PASEOS]
      }= ${pasNum}`
    );
  }

  static delete(pasNum) {
    return connection.execute(
      `DELETE FROM ${TableName.PASEOS} WHERE ${
        TableCodFields[TableName.PASEOS]
      }=${pasNum}`
    );
  }
  static getPaseosPorUsuarioCod(usuCod) {
    return connection.execute(
      `SELECT * FROM ${TableName.PASEOS} WHERE UsuCod=${usuCod}`
    );
  }
  static getPaseosPorPaseadorCod(pasCod) {
    return connection.execute(
      `SELECT * FROM ${TableName.PASEOS} WHERE PasCod=${pasCod}`
    );
  }
  static getPaseoPorNum(pasNum) {
    return connection.execute(
      `SELECT * FROM ${TableName.PASEOS} WHERE PasNum=${pasNum}`
    );
  }
}
