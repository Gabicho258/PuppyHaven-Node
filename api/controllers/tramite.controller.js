import { tramiteModel } from "../models/index.js";

export const getAllTramite = async (req, res, next) => {
  try{
    const [allTramites] = await tramiteModel.fetchAll();
    res.status(200).json(allTramites);
  } catch (err){
      if(!err.statusCode){
        err.statusCode = 500
      }
      next(err);
  }
};

export const postTramite = async (req, res, next) => {
  try {
    const postResponse = await tramiteModel.post(req.body.code, req.body.usecod, req.body.mascod, req.body.dondue);
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const putTramite = async (req, res, next) => {
  try {
    const putResponse = await tramiteModel.update(req.body.code, req.body.usecod, req.body.mascod, req.body.dondue);
    res.status(200).json(putResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteTramite = async (req, res, next) => {
  try {
    const deleteResponse = await tramiteModel.delete(req.params.id);
    res.status(200).json(deleteResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};