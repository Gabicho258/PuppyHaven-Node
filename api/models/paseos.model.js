import connection from "../../database.js";
import { TableName, TableCodFields } from "../../infoTables.js";

export default class PaseosModel {
  static async getAll() {
    const [paseos] = await connection.execute(
      `SELECT * FROM ${TableName.PASEOS}`
    );
    const [temp] = await connection.execute(
      `SELECT MASCOTAS.MasCod,PasNum, MasNom,MasCol,MasRaz,MasEda,MasFotURL,MasDes,MasIsToAdo,MasUsuCod FROM ${TableName.PASEOS_MASCOTAS} JOIN ${TableName.MASCOTAS} ON ${TableName.PASEOS_MASCOTAS}.MasCod = ${TableName.MASCOTAS}.MasCod`
    );

    const result = paseos.map((paseo, i) => {
      return {
        ...paseo,
        mascotas: temp.filter(
          (paseo_mascota) => paseo_mascota.PasNum === paseo.PasNum
        ),
      };
    });
    return result;
  }

  static async create(
    pasCod,
    usuCod,
    pasDis,
    pasDir,
    pasFecAno,
    pasFecMes,
    pasFecDia,
    pasHor,
    pasCanHor,
    pasEst = "P",
    mascotas
  ) {
    const [paseo] = await connection.execute(
      `INSERT INTO ${TableName.PASEOS} (PasCod,UsuCod,PasDis,PasDir,PasFecAno,PasFecMes,PasFecDia,PasHor,PasCanHor,PasEst) VALUES (${pasCod},${usuCod},"${pasDis}","${pasDir}", ${pasFecAno},${pasFecMes},${pasFecDia},"${pasHor}",${pasCanHor},"${pasEst}")`
    );
    mascotas.forEach(async (masID) => {
      await connection.execute(
        `INSERT INTO ${TableName.PASEOS_MASCOTAS} (PasNum,MasCod) VALUES (${paseo.insertId},${masID})`
      );
    });
    return paseo;
  }

  static update(pasNum, pasEst) {
    return connection.execute(
      `UPDATE ${TableName.PASEOS} set PasEst="${pasEst}"  WHERE  ${
        TableCodFields[TableName.PASEOS]
      }= ${pasNum}`
    );
  }

  static async delete(pasNum) {
    await connection.execute(
      `DELETE FROM ${TableName.PASEOS} WHERE ${
        TableCodFields[TableName.PASEOS]
      }=${pasNum}`
    );
    await connection.execute(
      `DELETE FROM ${TableName.PASEOS_MASCOTAS} WHERE PasNum=${pasNum}`
    );
    return;
  }

  static async getPaseosPorUsuarioCod(usuCod) {
    const [paseos] = await connection.execute(
      `SELECT PasNum,PASEADORES.PasCod,UsuCod,PASEOS.PasDis,PasDir,PasFecAno,PasFecMes,PasFecDia,PasHor,PasCanHor,PasEst,PasNom FROM ${TableName.PASEOS} JOIN ${TableName.PASEADORES} ON ${TableName.PASEOS}.PasCod = ${TableName.PASEADORES}.PasCod WHERE PASEOS.UsuCod=${usuCod}`
    );
    const [temp] = await connection.execute(
      `SELECT MASCOTAS.MasCod,PasNum, MasNom,MasCol,MasRaz,MasEda,MasFotURL,MasDes,MasIsToAdo,MasUsuCod FROM ${TableName.PASEOS_MASCOTAS} JOIN ${TableName.MASCOTAS} ON ${TableName.PASEOS_MASCOTAS}.MasCod = ${TableName.MASCOTAS}.MasCod`
    );
    const result = paseos.map((paseo, i) => {
      return {
        ...paseo,
        mascotas: temp.filter(
          (paseo_mascota) => paseo_mascota.PasNum === paseo.PasNum
        ),
      };
    });
    return result;
  }
  static async getPaseosPorPaseadorCod(pasCod) {
    const [paseos] = await connection.execute(
      `SELECT PasNum,PasCod,USUARIOS.UsuCod,PasDis,PasDir,PasFecAno,PasFecMes,PasFecDia,PasHor,PasCanHor,PasEst,UsuNom FROM ${TableName.PASEOS} JOIN ${TableName.USER} ON ${TableName.PASEOS}.UsuCod = ${TableName.USER}.UsuCod WHERE PASEOS.PasCod=${pasCod}`
    );
    const [temp] = await connection.execute(
      `SELECT MASCOTAS.MasCod,PasNum, MasNom,MasCol,MasRaz,MasEda,MasFotURL,MasDes,MasIsToAdo,MasUsuCod FROM ${TableName.PASEOS_MASCOTAS} JOIN ${TableName.MASCOTAS} ON ${TableName.PASEOS_MASCOTAS}.MasCod = ${TableName.MASCOTAS}.MasCod`
    );
    const result = paseos.map((paseo, i) => {
      return {
        ...paseo,
        mascotas: temp.filter(
          (paseo_mascota) => paseo_mascota.PasNum === paseo.PasNum
        ),
      };
    });
    return result;
  }
  static async getPaseoPorNum(pasNum) {
    const [paseos] = await connection.execute(
      `SELECT * FROM ${TableName.PASEOS} WHERE PasNum=${pasNum}`
    );
    const [temp] = await connection.execute(
      `SELECT MASCOTAS.MasCod,PasNum, MasNom,MasCol,MasRaz,MasEda,MasFotURL,MasDes,MasIsToAdo,MasUsuCod FROM ${TableName.PASEOS_MASCOTAS} JOIN ${TableName.MASCOTAS} ON ${TableName.PASEOS_MASCOTAS}.MasCod = ${TableName.MASCOTAS}.MasCod`
    );
    const result = paseos.map((paseo, i) => {
      return {
        ...paseo,
        mascotas: temp.filter(
          (paseo_mascota) => paseo_mascota.PasNum === paseo.PasNum
        ),
      };
    });
    return result;
  }
}
