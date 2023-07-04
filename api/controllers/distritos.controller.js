import { DistritoModel } from "../models/index.js";

export const getAllDistritos = async (req, res) => {
  try {
    const [allDistritos] = await DistritoModel.getAll();
    res.status(200).json(allDistritos);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const createDistritos = async (req, res) => {
  try {
    const { disNom } = req.body;
    const [{ insertId: disCod }] = await DistritoModel.create(disNom);
    const [distrito] = await DistritoModel.getDistritoPorCod(disCod);
    res.status(201).json(distrito);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const editDistrito = async (req, res) => {
  try {
    const { disCod, disNom } = req.body;
    const putResponse = await DistritoModel.update(disCod, disNom);
    res.status(200).json(putResponse);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerDistritoPorCod = async (req, res) => {
  try {
    const { id: disCod } = req.params;
    const [distrito] = await DistritoModel.getDistritoPorCod(disCod);
    res.status(200).json(distrito);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
