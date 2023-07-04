import connection from "../../database.js";
import { TableName, TableCodFields } from "../../infoTables.js";

export default class TramiteModel {
  static getAll() {
    return connection.execute(`SELECT * FROM ${TableName.TRAMITES}`);
  }

  static create(
    traUsuCodAdo,
    traUsuCodDue,
    traFecAno,
    traFeMes,
    traFecDia,
    traMasCod
  ) {
    return connection.execute(
      `INSERT INTO ${TableName.TRAMITES} VALUES (${traUsuCodAdo},${traUsuCodDue} ,${traFecAno},${traFeMes}, ${traFecDia}, ${traMasCod})`
    );
  }

  static getTramitePorCod(traCod) {
    return connection.execute(
      `SELECT * FROM ${TableName.TRAMITES} WHERE TraCod=${traCod}`
    );
  }

  static getTramitePorUsuarioDueñoCod(traUsuCodDue) {
    return connection.execute(
      `SELECT * FROM ${TableName.TRAMITES} WHERE TraUsuCodDue=${traUsuCodDue}`
    );
  }

  static getTramitePorUsuarioPaseadorCod(traUsuCodAdo) {
    return connection.execute(
      `SELECT * FROM ${TableName.TRAMITES} WHERE TraUsuCodAdo=${traUsuCodAdo}`
    );
  }
}
