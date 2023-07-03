import bcrypt from "bcrypt";
import { distritoModel } from "../models/index.js";

export const getAllDistritos = async (req, res, next) => {
  try{
    const [allDistritos] = await distritoModel.fetchAll();
    res.status(200).json(allDistritos);
  } catch (err){
      if(!err.statusCode){
        err.statusCode = 500
      }
      next(err);
  }
};

export const postDistritos = async (req, res, next) => {
  try {
    const postResponse = await distritoModel.post(req.body.code, req.body.name);
    res.status(201).json(postResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const putDistrito = async (req, res, next) => {
  try {
    const putResponse = await distritoModel.update(req.body.code, req.body.name);
    res.status(200).json(putResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteDistrito = async (req, res, next) => {
  try {
    const deleteResponse = await distritoModel.delete(req.params.id);
    res.status(200).json(deleteResponse);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};