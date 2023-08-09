import connection from "../../database.js";
import { TableName, TableCodFields } from "../../infoTables.js";
import UsuarioModel from "./usuario.model.js";

export default class ComentariosModel {
  static async getAll() {
    // const comentarios = await connection.execute(
    //   `SELECT * FROM ${TableName.COMENTARIOS} `
    // );

    const [comentarios] = await connection.execute(
      `SELECT ComCod,COMENTARIOS.UsuCod,PasCod,ComIsLike,ComTex,UsuNom FROM ${TableName.COMENTARIOS} JOIN ${TableName.USER} ON COMENTARIOS.UsuCod = USUARIOS.UsuCod`
    );
    return [...comentarios];
  }

  static async create(usuCod, pasCod, comIsLike, comTex) {
    // INSERT INTO COMENTARIOS(UsuCod, PasCod, ComisLike, ComTex) VALUES(1,1,0,'Nada que ver este paseador')
    const [paseo] = await connection.execute(
      `INSERT INTO ${TableName.COMENTARIOS} (UsuCod,PasCod,ComIsLike,ComTex) VALUES (${usuCod}, ${pasCod}, ${comIsLike}, "${comTex}")`
    );

    return paseo;
  }

  static async getComentariosPorPaseadorCod(pasCod) {
    const [comentarios] = await connection.execute(
      `SELECT ComCod,COMENTARIOS.UsuCod,PasCod,ComIsLike,ComTex,UsuNom FROM ${TableName.COMENTARIOS} JOIN ${TableName.USER} ON COMENTARIOS.UsuCod = USUARIOS.UsuCod WHERE PasCod=${pasCod}`
    );
    // const [comentarios] = await connection.execute(
    // );

    return comentarios;
  }
}
