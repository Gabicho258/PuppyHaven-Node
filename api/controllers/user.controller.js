import bcrypt from "bcrypt";
import alumnos from "../models/user.model.js";
export const saludar = async (req, res) => {
  try {
    const { name } = req.params;
    console.log(`El name es ${name}`);
    const { id, password: passwordBody } = req.body;
    console.log(`El id es ${id}`);
    console.log(`El password es ${passwordBody}`);
    const password = await bcrypt.hash(name, 10);
    // res.status(200).send(`funciona. password ${password}`);

    bcrypt.compare(passwordBody, password, (err, result) => {
      if (result) {
        console.log("result es true");
        // res.status(200).send("Acceso concedido");
        res
          .status(200)
          .json({ userName: "Pedro", edad: 20, id: 22, role: "admin" });
      } else {
        console.log("result es false");
        res.status(200).send("Acceso denegado");
      }
    });

    // res.status(200).json({ userName: "Pedro", edad: 20, id: 22 });
  } catch (error) {
    console.log(error);
    res.status(500).send("Error en el servidor");
  }
};
export const getAllAlumnos = async (req, res, next) => {
  try{
    const [allAlumnos] = await alumnos.fetchAll();
    res.status(200).json(allAlumnos);
  } catch (err){
      if(!err.statusCode){
        err.statusCode = 500
      }
      next(err);
  }
};

export const postAlumnos = async (req, res, next) => {
  try {
    const postResponse = await alumnos.post(req.body.id, req.body.item, req.body.status);
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const putAlumnos = async (req, res, next) => {
  try {
    const putResponse = await alumnos.update(req.body.id, req.body.item, req.body.status);
    res.status(200).json(putResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteAlumnos = async (req, res, next) => {
  try {
    const deleteResponse = await alumnos.delete(req.params.id);
    res.status(200).json(deleteResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
export const saludar3 = async (req, res) => {};
export const saludar4 = async (req, res) => {};
export const saludar5 = async (req, res) => {};
