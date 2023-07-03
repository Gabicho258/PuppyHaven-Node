import connection from "../../database.js";
import {TableName, TableCodFields } from "../../infoTables.js";

export default  class calificacionModel{
    constructor(cod, usucod, mascod, dondue){
        this.cod = cod;
        this.usucod = usucod;
        this.mascod = mascod;
        this.dondue = dondue;
    }

    static fetchAll(){
        return connection.execute(`SELECT * FROM ${TableName.TRAMITES}`)
    }

    static post(cod, usucod, mascod, dondue) {
        return connection.execute(`INSERT INTO ${TableName.TRAMITES} VALUES (?,?,?)`, [cod, usucod, mascod, dondue]);
    }
    
    static update(cod, usucod, mascod, dondue) {
        return connection.execute(`UPDATE ${TableName.TRAMITES} set calMeGus=?, calNoGus=? WHERE  ${TableCodFields[TableName.TRAMITES]}= ?`, [usucod, mascod, dondue, cod]);
    }
    
    static delete(cod) {
        return connection.execute(`DELETE FROM ${TableName.TRAMITES} WHERE ${TableCodFields[TableName.TRAMITES]}=?`, [cod]);
    }
};