import { calificacionModel } from "../models/index.js";

export const getAllCalificaciones = async (req, res, next) => {
  try{
    const [allCalificaciones] = await calificacionModel.fetchAll();
    res.status(200).json(allCalificaciones);
  } catch (err){
      if(!err.statusCode){
        err.statusCode = 500
      }
      next(err);
  }
};

export const postCalificaciones = async (req, res, next) => {
  try {
    const postResponse = await calificacionModel.post(req.body.code, req.body.like, req.body.dislike);
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const putCalificaciones = async (req, res, next) => {
  try {
    const putResponse = await calificacionModel.update(req.body.code, req.body.like, req.body.dislike);
    res.status(200).json(putResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteCalificaciones = async (req, res, next) => {
  try {
    const deleteResponse = await calificacionModel.delete(req.params.id);
    res.status(200).json(deleteResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};