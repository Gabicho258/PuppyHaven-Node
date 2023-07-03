import connection from "../../database.js";
import {TableName, TableCodFields } from "../../infoTables.js";

export default  class petModel{
    constructor(cod, nom, col, raz, eda, fot, otro){
        this.cod = cod;
        this.nom = nom;
        this.col = col;
        this.raz = raz;
        this.eda = eda;
        this.fot = fot;
        this.otro = otro;
    }

    static fetchAll(){
        return connection.execute(`SELECT * FROM ${TableName.PET}`)
    }

    static post(cod, nom, col, raz, eda, fot, otro) {
        return connection.execute(`INSERT INTO ${TableName.PET} VALUES (?, ?, ?, ?, ?, ?, ?)`, [cod, nom, col, raz, eda, fot, otro]);
    }
    
    static update(cod, nom, col, raz, eda, fot, otro) {
        return connection.execute(`UPDATE ${TableName.PET} set masNom=?, masCol=?, masRaz=?, masEda=?, masFot=?, masOtrDat=? WHERE  ${TableCodFields[TableName.PET]}= ?`, [nom, col, raz, eda, fot, otro, cod]);
    }
    
    static delete(cod) {
        return connection.execute(`DELETE FROM ${TableName.PET} WHERE ${TableCodFields[TableName.PET]}=?`, [cod]);
    }
};
