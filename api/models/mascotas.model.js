import connection from "../../database.js";
import { TableName, TableCodFields } from "../../infoTables.js";

export default class MascotasModel {
  static getAll() {
    return connection.execute(`SELECT * FROM ${TableName.MASCOTAS}`);
  }

  static create(
    masNom,
    masCol,
    masRaz,
    masEda,
    masFotURL,
    masDes,
    masIsToAdo,
    masUsuCod
  ) {
    return connection.execute(
      `INSERT INTO ${TableName.MASCOTAS}(MasNom, MasCol, MasRaz, MasEda, MasFotURL, MasDes, MasIsToAdo, MasUsuCod) VALUES ("${masNom}", "${masCol}", "${masRaz}", ${masEda}, "${masFotURL}", "${masDes}", ${masIsToAdo}, ${masUsuCod})`
    );
  }

  static update(
    masCod,
    masNom,
    masCol,
    masRaz,
    masEda,
    masFotURL,
    masDes,
    masIsToAdo,
    masUsuCod
  ) {
    return connection.execute(
      `UPDATE 
        ${
          TableName.MASCOTAS
        } set MasNom="${masNom}", MasCol="${masCol}", MasRaz="${masRaz}", MasEda=${masEda}, MasFotURL="${masFotURL}", MasDes="${masDes}", MasIsToAdo=${masIsToAdo}, MasUsuCod=${masUsuCod}  WHERE  ${
        TableCodFields[TableName.MASCOTAS]
      }= ${masCod}`
    );
  }

  static delete(masCod) {
    return connection.execute(
      `DELETE FROM ${TableName.MASCOTAS} WHERE ${
        TableCodFields[TableName.MASCOTAS]
      }=${masCod}`
    );
  }

  static getMascotaPorCod(masCod) {
    return connection.execute(
      `SELECT * FROM ${TableName.MASCOTAS} WHERE MasCod=${masCod}`
    );
  }

  static getMascotasPorUserCod(masUsuCod) {
    return connection.execute(
      `SELECT * FROM ${TableName.MASCOTAS} WHERE MasUsuCod=${masUsuCod}`
    );
  }
}
