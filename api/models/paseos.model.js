import connection from "../../database.js";
import {TableName, TableCodFields } from "../../infoTables.js";

export default  class paseosModel{
    constructor(num, pascod, usucod, dir, pet){
        this.num = num;
        this.pascod = pascod;
        this.usucod = usucod;
        this.dir = dir;
        this.pet = pet;
    }

    static fetchAll(){
        return connection.execute(`SELECT * FROM ${TableName.PASEOS}`)
    }

    static post(num, pascod, usucod, dir, pet) {
        return connection.execute(`INSERT INTO ${TableName.PASEOS} VALUES (?,?,?,?,?)`, [num, pascod, usucod, dir, pet]);
    }
    
    static update(num, pascod, usucod, dir, pet) {
        return connection.execute(`UPDATE ${TableName.PASEOS} set pasCod=?, usuCod=?, pasDir=?, masCod=?  WHERE  ${TableCodFields[TableName.PASEOS]}= ?`, [pascod, usucod, dir, pet, num]);
    }
    
    static delete(num) {
        return connection.execute(`DELETE FROM ${TableName.PASEOS} WHERE ${TableCodFields[TableName.PASEOS]}=?`, [num]);
    }
};
