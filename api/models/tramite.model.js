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
    traFecMes,
    traFecDia,
    traMasCod
  ) {
    return connection.execute(
      `INSERT INTO ${TableName.TRAMITES} (TraUsuCodAdo, TraUsuCodDue, TraFecAno, TraFecMes, TraFecDia, TraMasCod ) VALUES (${traUsuCodAdo},${traUsuCodDue} ,${traFecAno},${traFecMes}, ${traFecDia}, ${traMasCod})`
    );
  }

  static getTramitePorCod(traCod) {
    return connection.execute(
      `SELECT * FROM ${TableName.TRAMITES} WHERE TraCod=${traCod}`
    );
  }

  static getTramitePorUsuarioDuenoCod(traUsuCodDue) {
    return connection.execute(
      `SELECT * FROM ${TableName.TRAMITES} WHERE TraUsuCodDue=${traUsuCodDue}`
    );
  }

  static getTramitePorUsuarioAdopterCod(traUsuCodAdo) {
    return connection.execute(
      `SELECT * FROM ${TableName.TRAMITES} WHERE TraUsuCodAdo=${traUsuCodAdo}`
    );
  }
}
