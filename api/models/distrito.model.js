import connection from "../../database.js";
import {TableName, TableCodFields } from "../../infoTables.js";

export default  class disritoModel{
    constructor(cod, nom){
        this.cod = cod;
        this.nom = nom;
    }

    static fetchAll(){
        return connection.execute(`SELECT * FROM ${TableName.DISTRITOS}`)
    }

    static post(cod, nom) {
        return connection.execute(`INSERT INTO ${TableName.DISTRITOS} VALUES (?,?)`, [cod, nom]);
    }
    
    static update(cod, nom) {
        return connection.execute(`UPDATE ${TableName.DISTRITOS} set DisNom=? WHERE  ${TableCodFields[TableName.DISTRITOS]}= ?`, [nom, cod]);
    }
    
    static delete(cod) {
        return connection.execute(`DELETE FROM ${TableName.DISTRITOS} WHERE ${TableCodFields[TableName.DISTRITOS]}=?`, [cod]);
    }
};
