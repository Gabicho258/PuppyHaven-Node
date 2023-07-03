import connection from "../../database.js";
import {TableName, TableCodFields } from "../../infoTables.js";

export default  class userRegisterModel{
    constructor(cod, nom, cor, con, discod, year, month, day){
        this.cod = cod;
        this.nom = nom;
        this.cor = cor;
        this.con = con;
        this.discod = discod;
        this.year = year;
        this.month = month;
        this.day = day;
    }

    static fetchAll(){
        return connection.execute(`SELECT * FROM ${TableName.USERFINAL}`)
    }

    static post(cod, nom, cor, con, discod, year, month, day) {
        return connection.execute(`INSERT INTO ${TableName.USERFINAL} (usuCod, usuNom, usuCor, usuCon, disCod, usuFecNacAño, usuFecNacMes, usuFecNacDia)VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [cod, nom, cor, con, discod, year, month, day]);
    }
    
    static update(cod, nom, cor, con, discod, year, month, day) {
        return connection.execute(`UPDATE ${TableName.USERFINAL} set usuNom=?, usuCor=?, usuCon=?, disCod=?, usuFecNacAño=?, usuFecNacMes=?, usuFecNacDia=? WHERE  ${TableCodFields[TableName.USER]}= ?`, [nom, cor, con, discod, year, month, day, cod]);
    }
    
    static delete(cod) {
        return connection.execute(`DELETE FROM ${TableName.USERFINAL} WHERE ${TableCodFields[TableName.USERFINAL]}=?`, [cod]);
    }
};
