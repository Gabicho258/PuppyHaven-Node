import bcrypt from "bcrypt";
import { walkerModel } from "../models/index.js";

export const register = async (req, res) => {
  try {
    if (req.session.loggedin == true) {
      console.log("Hola paseador");
      res.redirect("/");
    } else {
      console.log("Hola visitante");
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};

export const login = async (req, res) => {
  try {
    if (req.session.loggedin == true) {
      console.log("Hola paseador");
      res.redirect("/");
    } else {
      console.log("Hola visitante");
      res.redirect("/");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
export const auth = async (req, res) => {
  try {
    const { email, password: passwordBody } = req.body;
    /*pool.query(
      `SELECT * FROM ${TableName.PASEADORES} WHERE pas_cor = ?`,
      [email],
      (err, userdata) => {
        if (userdata.length > 0) {
          userdata.forEach((element) => {
            bcrypt.compare(passwordBody, element.password, (err, isMatch) => {
              console.log(element.password);
              console.log(isMatch);
              if (!isMatch) {
                res
                  .status(200)
                  .send("<h1>Contraseña incorrecta intentelo otra vez</h1>");
                console.log("Contraseña incorrecta");
              } else {
                req.session.loggedin = true;
                req.session.name = element.name;
                res.status(200).send("<h1>Bienvenido paseador</h1>");
                console.log("Contraseña correcta");
              }
            });
          });
        } else {
          res.status(400).send("Error el usuario no existente");
          console.log("El usuario no existe");
        }
      }
    );*/
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
export const storyUser = async (req, res) => {
  try {
    const walker = req.body;
    const { name, email, password: passwordBody } = req.body;
    const password = await bcrypt.hash(passwordBody, 10);
    walker.password = password;
    /*pool.query(
      `SELECT * FROM ${TableName.PASEADORES} WHERE pas_cor = ?`,
      [email],
      (err, userdata) => {
        if (userdata.length > 0) {
          res.status(400).send("Error el paseador ya existente");
          console.log("El paseador ya existe");
        } else {
          pool.query(`INSERT INTO ${TableName.PASEADORES} SET ?`, [walker1]);
          req.session.loggedin = true;
          req.session.name = name;
          res.status(200).send("<h1>Paseador creado Bienvenido paseador</h1>");
          console.log("El paseador se ha creado");
        }
      }
    );*/
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
export const logout = async (req, res) => {
  try {
    if (req.session.loggedin == true) {
      req.session.destroy();
      res.redirect("/");
    } else {
      res.redirect("/api/users/login");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
