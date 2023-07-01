import connection from "../../database.js";
import {TableName, TableCodFields } from "../../infoTables.js";

export default  class userModel{
    constructor(id, name, status){
        this.id = id;
        this.item = name;
        this.status = status;
    }

    static fetchAll(){
        return connection.execute(`SELECT * FROM ${TableName.USER}`)
    }

    static post(id, item, status) {
        return connection.execute(`INSERT INTO ${TableName.USER} set ${TableCodFields[TableName.USER]}=?, nombre=?, estado=?`, [id, item, status]);
    }
    
    static update(id, item, status) {
        return connection.execute(`UPDATE ${TableName.USER} set nombre=?, estado=? WHERE  ${TableCodFields[TableName.USER]}= ?`, [item, status, id]);
    }
    
    static delete(id) {
        return connection.execute(`DELETE FROM ${TableName.USER} WHERE ${TableCodFields[TableName.USER]}=?`, [id]);
    }
};
