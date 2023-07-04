import { PaseosModel } from "../models/index.js";

export const getAllPaseos = async (req, res) => {
  try {
    const [allPaseos] = await PaseosModel.getAll();
    res.status(200).json(allPaseos);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const createPaseos = async (req, res) => {
  const { pasCod, usuCod, pasDir, masCod, pasEst } = req.body;
  try {
    const [{ insertId: pasNum }] = await PaseosModel.create(
      pasCod,
      usuCod,
      pasDir,
      masCod,
      pasEst
    );

    const [paseo] = await PaseosModel.getPaseoPorNum(pasNum);
    res.status(201).json(paseo);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const editPaseos = async (req, res) => {
  const { pasNum, pasDir, masCod, pasEst } = req.body;
  try {
    const updateResponse = await PaseosModel.update(
      pasNum,
      pasDir,
      masCod,
      pasEst
    );
    res
      .status(200)
      .json({ message: "Paseo editado correctamente", updateResponse });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deletePaseos = async (req, res) => {
  const { id: pasNum } = req.params;
  try {
    const deleteResponse = await PaseosModel.delete(pasNum);
    res
      .status(200)
      .json({ message: "Paseo eliminado correctamente", deleteResponse });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
export const obtenerPaseosPorPasCod = async (req, res) => {
  try {
    const { id: pasCod } = req.params;
    const [paseos] = await PaseosModel.getPaseosPorPaseadorCod(pasCod);
    res.status(200).json(paseos);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerPaseosPorUsuCod = async (req, res) => {
  try {
    const { id: usuCod } = req.params;
    const [paseos] = await PaseosModel.getPaseosPorUsuarioCod(usuCod);
    res.status(200).json(paseos);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerPaseoPorPasNum = async (req, res) => {
  try {
    const { id: pasNum } = req.params;
    const [paseo] = await PaseosModel.getPaseoPorNum(pasNum);
    res.status(200).json(paseo);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
