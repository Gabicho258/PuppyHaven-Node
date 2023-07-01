import mysql from "mysql";
import promisify  from "util";
import database from "./keys.js";

export const connection = mysql.createConnection({
        host: process.env.HOST_DB,
        port: process.env.PORT_DB,
        user: process.env.USER_DB,
        password: "",
        database: process.env.USER_DB
});
connection.connect((err, conexión) =>{
    if(err){
        if(err.code === 'PROTOCOL_CONNECTION_LOST'){
            console.log('DATABASE CONNECTION CERRADA');
            return;
        } else if(err.code === 'ER_CON_COUNT_ERROR'){
            console.log('DATABASE TIENE DOS CONEXIÓN');
            return;
        } else if (err.code === 'ECONNREFUSED'){
            console.log('Conexión no permitida');
            return; 
        }
        console.log(process.env.HOST_DB);
    }
    if(conexión){
        console.log('Base de datos conectada');
        // testConnection();
    }
});

// const testConnection =()=>{
//     connection.query('SELECT * FROM alumnos', (err, results) => {
//         if (err) {
//           console.error('Error en la prueba de conexión:', err);
//           connection.end();
//           return;
//         }
//         console.log('Prueba de conexión exitosa. Resultado:', results);
//         // Cierra la conexión a la base de datos
//         connection.end();
//       });
// }