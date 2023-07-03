import connection from "../../database.js";
import {TableName, TableCodFields } from "../../infoTables.js";

export default  class calificacionModel{
    constructor(cod, like, dislike){
        this.cod = cod;
        this.like = like;
        this.dislike = dislike;
    }

    static fetchAll(){
        return connection.execute(`SELECT * FROM ${TableName.CALIFICACIONES}`)
    }

    static post(cod, like, dislike) {
        return connection.execute(`INSERT INTO ${TableName.CALIFICACIONES} VALUES (?,?,?)`, [cod, like, dislike]);
    }
    
    static update(cod, like, dislike) {
        return connection.execute(`UPDATE ${TableName.CALIFICACIONES} set calMeGus=?, calNoGus=? WHERE  ${TableCodFields[TableName.CALIFICACIONES]}= ?`, [like, dislike, cod]);
    }
    
    static delete(cod) {
        return connection.execute(`DELETE FROM ${TableName.CALIFICACIONES} WHERE ${TableCodFields[TableName.CALIFICACIONES]}=?`, [cod]);
    }
};
