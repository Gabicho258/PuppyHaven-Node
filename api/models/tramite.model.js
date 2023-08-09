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
      `INSERT INTO ${TableName.TRAMITES} (TraUsuCodAdo, TraUsuCodDue, TraFecAno, TraFecMes, TraFecDia, TraMasCod,TraEst ) VALUES (${traUsuCodAdo},${traUsuCodDue} ,${traFecAno},${traFecMes}, ${traFecDia}, ${traMasCod},"P")`
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

  static async getTramitePorUsuarioAdopterCod(traUsuCodAdo) {
    const [tramites] = await connection.execute(
      `SELECT * FROM ${TableName.TRAMITES} WHERE TraUsuCodAdo=${traUsuCodAdo} OR TraUsuCodDue=${traUsuCodAdo}`
    );
    const [usuarios] = await connection.execute(
      `SELECT * FROM ${TableName.USER}`
    );
    const [mascotas] = await connection.execute(
      `SELECT * FROM ${TableName.MASCOTAS}`
    );
    const result = tramites.map((tramite) => {
      return {
        ...tramite,
        adoptador: usuarios.find(
          (usuario) => usuario.UsuCod === tramite.TraUsuCodAdo
        ),
        owner: usuarios.find(
          (usuario) => usuario.UsuCod === tramite.TraUsuCodDue
        ),
        mascota: mascotas.find(
          (mascota) => mascota.MasCod === tramite.TraMasCod
        ),
      };
    });
    // const []
    return result;
  }
}
