import mysql from "mysql2";
import { promisify } from "util";

import { database } from "./keys.js";

const pool = mysql.createPool(database);

pool.getConnection((err, connection) =>{
    if (err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log('Laa conexión de la base de datos fue cerrada');
        }
        if(err.code === 'ER_CON_COUNT_ERROR') {
            console.log("La base de datos tiene muchas conexiones");
        }
        if(err.code === 'ECONNREFUSED') {
            console.log("La base de datos fue rechazada");
        }
    }
    if (connection) connection.release();
    console.log("La base de datos esta joya")
    return;
});

pool.query = promisify(pool.query);

export default pool;


