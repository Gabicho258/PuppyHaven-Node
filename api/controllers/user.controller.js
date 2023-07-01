import bcrypt from "bcrypt";
import pool from "../../database.js";

export const register = async (req, res) => {
  try {
    if(req.session.loggedin == true){
      console.log("Hola");
      res.redirect("/");
    } else{
      console.log("Adios");
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
}

export const login = async (req, res) => {
  try {
    if(req.session.loggedin == true){
      console.log("Hola");
      res.redirect("/");
    } else{
      console.log("Adios");
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
export const auth = async (req, res) => {
  try {
    const user = req.body;
    const { email, password: passwordBody } = req.body;
    pool.query('SELECT * FROM users WHERE email = ?', [email], (err, userdata) =>{
      if(userdata.length > 0){
        userdata.forEach(element => {
          bcrypt.compare(passwordBody, element.password, (err, isMatch)=>{
            console.log(element.password);
            console.log(isMatch);
            if(!isMatch){
              res
                .status(200)
                .send("<h1>No ingreso Funciona</h1>");
              console.log("Contraseña incorrecta");
            } else {
              req.session.loggedin = true;
              req.session.name = element.name;  
              res
                .status(200)
                .send("<h1>Ingreso Funciona</h1>");
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
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }  

};
export const storyUser = async (req, res) => {
  try {
    const user = req.body;
    const { name, email, password: passwordBody } = req.body;
    const password = await bcrypt.hash(passwordBody, 10);
    user.password = password;
    pool.query('SELECT * FROM users WHERE email = ?', [email], (err, userdata) =>{
      if(userdata.length > 0){
        res.status(400).send("Error el usuario ya existente");
        console.log("El usuario ya existe");
      }
      else{
        pool.query('INSERT INTO users SET ?', [user])
        req.session.loggedin = true;
        req.session.name = name; 
        res
          .status(200)
          .json({ userName: name, email: email });
        console.log("El usuario se ha creado");
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }  
};
export const logout = async (req,res) => {
  try {
    if(req.session.loggedin == true){
      
      req.session.destroy();
      res.redirect("/");

    } else{
      res.redirect("/api/users/login");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};