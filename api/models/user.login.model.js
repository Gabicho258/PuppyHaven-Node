import {TableName, TableNameFields,  TableCorFields, TableConFields} from "../../infoTables.js";
import bcrypt from "bcrypt";
import pool from "../../database.js";

export default  class userModel{
    constructor(name, email, password){
        this.name = name;
        this.email = email;
        this.password = password;
    }

    static verifylogin(email, passwordBody, req, res) {
        pool.query(`SELECT * FROM ${TableName.USERFINAL} WHERE use_cor = ?`, [email], (err, userdata) =>{
            console.log(userdata)
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
                      .send("<h1>Bienvenido Usuario</h1>");
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
    static verifyregister(user,name, email, req, res){
      const user2 = {
        use_nom : user.name,
        use_cor : user.email,
        use_con : user.password
      }
      pool.query(`SELECT * FROM ${TableName.USERFINAL} WHERE use_cor = ?`, [email], (err,userdata) =>{
          console.log(userdata)
          if(userdata.length > 0){
              res.status(400).send("Error el usuario ya existente");
              console.log("El usuario ya existe");
            }
            else{
              pool.query(`INSERT INTO ${TableName.USERFINAL} SET ?`, [user2])
              req.session.loggedin = true;
              req.session.name = name; 
              res
                .status(200)
                .send("<h1>Bienvenido Usuario</h1>");
              console.log("El usuario se ha creado");
            }
          });
    }
};