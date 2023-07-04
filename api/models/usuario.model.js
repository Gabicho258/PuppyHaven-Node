import connection from "../../database.js";
import { TableName, TableCodFields } from "../../infoTables.js";

export default class UsuarioModel {
  static getAll() {
    return connection.execute(`SELECT * FROM ${TableName.USER}`);
  }

  static create(
    usuNom,
    usuCor,
    usuCon,
    disCod,
    usuFotURL,
    usuFecNacAno,
    usuFecNacMes,
    usuFecNacDia
  ) {
    return connection.execute(
      `INSERT INTO ${TableName.USER} VALUES ( "${usuNom}","${usuCor}","${usuCon}",${disCod},"${usuFotURL}",${usuFecNacAno},${usuFecNacMes},${usuFecNacDia})`
    );
  }

  static update(usuCod, usuNom, disCod, usuFotURL) {
    return connection.execute(
      `UPDATE ${
        TableName.USER
      } set UsuNom="${usuNom}", DisCod=${disCod}, UsuFotURL="${usuFotURL}" WHERE  ${
        TableCodFields[TableName.USER]
      }= ${usuCod}`
    );
  }

  static delete(usuCod) {
    return connection.execute(
      `DELETE FROM ${TableName.USER} WHERE ${
        TableCodFields[TableName.USER]
      }=${usuCod}`
    );
  }

  static getUsuarioPorCod(usuCod) {
    return connection.execute(
      `SELECT * FROM ${TableName.USER} WHERE UsuCod=${usuCod}`
    );
  }

  static getUsuarioPorCorreo(usuCor) {
    return connection.execute(
      `SELECT * FROM ${TableName.USER} WHERE UsuCor="${usuCor}"`
    );
  }
}
