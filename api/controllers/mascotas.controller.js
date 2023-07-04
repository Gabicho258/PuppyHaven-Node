import { MascotasModel } from "../models/index.js";

export const getAllMascotas = async (req, res, next) => {
  try {
    const [allMascotas] = await MascotasModel.getAll();
    res.status(200).json(allMascotas);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const postMascota = async (req, res, next) => {
  try {
    const postResponse = await MascotasModel.create(
      req.body.code,
      req.body.name,
      req.body.color,
      req.body.raza,
      req.body.age,
      req.body.img,
      req.body.other
    );
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const putMascota = async (req, res, next) => {
  try {
    const putResponse = await MascotasModel.update(
      req.body.code,
      req.body.name,
      req.body.color,
      req.body.raza,
      req.body.age,
      req.body.img,
      req.body.other
    );
    res.status(200).json(putResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteMascota = async (req, res, next) => {
  try {
    const deleteResponse = await MascotasModel.delete(req.params.id);
    res.status(200).json(deleteResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};