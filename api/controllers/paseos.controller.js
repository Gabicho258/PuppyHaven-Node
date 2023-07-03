import { paseosModel } from "../models/index.js";

export const getAllPaseos = async (req, res, next) => {
  try{
    const [allPaseos] = await paseosModel.fetchAll();
    res.status(200).json(allPaseos);
  } catch (err){
      if(!err.statusCode){
        err.statusCode = 500
      }
      next(err);
  }
};

export const postPaseos = async (req, res, next) => {
  try {
    const postResponse = await paseosModel.post(req.body.num, req.body.pascod, req.body.usucod, req.body.pasdir, req.body.mascod);
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const putPaseos = async (req, res, next) => {
  try {
    const putResponse = await paseosModel.update(req.body.num, req.body.pascod, req.body.usucod, req.body.pasdir, req.body.mascod);
    res.status(200).json(putResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deletePaseos = async (req, res, next) => {
  try {
    const deleteResponse = await paseosModel.delete(req.params.id);
    res.status(200).json(deleteResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};