import connection from "../../database.js";
import { TableName, TableCodFields } from "../../infoTables.js";

export default class PaseadorModel {
  static getAll() {
    return connection.execute(`SELECT * FROM ${TableName.PASEADORES}`);
  }

  static create(
    pasNom,
    pasCor,
    pasCon,
    disCod,
    pasFotURL,
    pasFecNacAno,
    pasFecNacMes,
    pasFecNacDia,
    pasDes,
    pasDis, // [{lunes: ["13:00-14:00", "19:00-21:00"]}, {martes: []}]
    calCod
  ) {
    return connection.execute(
      `INSERT INTO ${TableName.PASEADORES} (PasNom, PasCor, PasCon, DisCod, PasFotURL, PasFecNacAno, PasFecNacMes, PasFecNacDia, PasDes, PasDis, CalCod) VALUES ( "${pasNom}","${pasCor}","${pasCon}",${disCod},"${pasFotURL}",${pasFecNacAno},${pasFecNacMes},${pasFecNacDia},"${pasDes}", "${pasDis}" ,${calCod})`
    );
  }
  static update(pasCod, disCod, pasFotURL, pasDes, pasDis) {
    return connection.execute(
      `UPDATE ${
        TableName.PASEADORES
      } set DisCod=${disCod}, PasFotURL="${pasFotURL}", PasDes="${pasDes}", PasDis="${pasDis}"  WHERE  ${
        TableCodFields[TableName.PASEADORES]
      }= ${pasCod}`
    );
  }

  static delete(pasCod) {
    return connection.execute(
      `DELETE FROM ${TableName.PASEADORES} WHERE ${
        TableCodFields[TableName.PASEADORES]
      }=${pasCod}`
    );
  }

  static getPaseadorPorCod(pasCod) {
    return connection.execute(
      `SELECT * FROM ${TableName.PASEADORES} WHERE PasCod=${pasCod}`
    );
  }

  static getPaseadorPorCorreo(pasCor) {
    return connection.execute(
      `SELECT * FROM ${TableName.PASEADORES} WHERE PasCor="${pasCor}"`
    );
  }
}
