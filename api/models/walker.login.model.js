import {TableName, TableNameFields,  TableCorFields, TableConFields} from "../../infoTables.js";
import bcrypt from "bcrypt";
import pool from "../../database.js";

export default  class walkerModel{
    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
    }
    
    static verifylogin(email, passwordBody, req, res) {
        return pool.query(`SELECT * FROM ${TableName.PASEADORES} WHERE pas_cor = ?`, [email], (err, userdata) =>{
            if(userdata.length > 0){
              userdata.forEach(element => {
                bcrypt.compare(passwordBody, element.password, (err, isMatch)=>{
                  console.log(element.password);
                  console.log(isMatch);
                  if(!isMatch){
                    res
                      .status(200)
                      .send("<h1>Contraseña incorrecta intentelo otra vez</h1>");
                    console.log("Contraseña incorrecta");
                  } else {
                    req.session.loggedin = true;
                    req.session.name = element.name;  
                    res
                      .status(200)
                      .send('<h1>Bienvenido paseador</h1>');
                    console.log("Contraseña correcta");
                  }
                });
              });
            }
            else{
              res.status(400).send("Error el usuario no existente");
              console.log("El usuario no existe");
            }
          });
    }
    static verifyregister(walker,name, email, req, res){
        const walker1 = {
            pas_nom : walker.name,
            pas_cor : walker.email,
            pas_con : walker.password
        }
        return pool.query(`SELECT * FROM ${TableName.PASEADORES} WHERE pas_cor = ?`, [email], (err, userdata) =>{
            if(userdata.length > 0){
              res.status(400).send("Error el paseador ya existente");
              console.log("El paseador ya existe");
            }
            else{
              pool.query(`INSERT INTO ${TableName.PASEADORES} SET ?`, [walker1])
              req.session.loggedin = true;
              req.session.name = name; 
              res
                .status(200)
                .send("<h1>Paseador creado Bienvenido paseador</h1>");
              console.log("El paseador se ha creado");
            }
          });
    }
};