import mysql from "mysql2";
const connection = mysql.createPool(process.env.URL_DB,);

connection.getConnection((err, conexión) =>{
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
        console.log(process.env.PASSWORD_DB);
    }
    if(conexión){
        console.log('Base de datos conectada');
    }
});

export default connection.promise();
