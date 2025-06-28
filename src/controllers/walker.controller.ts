import bcrypt from "bcrypt";
import { PaseadorModel } from "../models/index.js";
import { passwordToHash } from "../utils/passwordToHash.js";

export const getAllWalkers = async (req, res) => {
  try {
    const [allWalkers] = await PaseadorModel.getAll();
    res.status(200).json(allWalkers);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
export const createWalker = async (req, res) => {
  const {
    pasNom,
    pasCor,
    pasCon: passwordBody,
    disCod,
    pasFotURL,
    pasFecNacAno,
    pasFecNacMes,
    pasFecNacDia,
    pasDes,
    pasDis,
    calCod,
  } = req.body;
  try {
    const [paseadorLooked] = await PaseadorModel.getPaseadorPorCorreo(pasCor);
    if (paseadorLooked.length > 0) {
      return res.status(400).json({ error: "El correo ya existe" });
    }
    const pasCon = await passwordToHash(passwordBody);
    const [{ insertId: pasCod }] = await PaseadorModel.create(
      pasNom,
      pasCor,
      pasCon,
      disCod,
      pasFotURL,
      pasFecNacAno,
      pasFecNacMes,
      pasFecNacDia,
      pasDes,
      pasDis,
      calCod
    );
    const [paseador] = await PaseadorModel.getPaseadorPorCod(pasCod);
    res.status(200).json(paseador);
  } catch (err) {
    res.status(500).json({ erro: err });
  }
};

export const editWalker = async (req, res) => {
  try {
    const { pasCod, disCod, pasFotURL, pasDes, pasDis } = req.body;
    const updateResponse = await PaseadorModel.update(
      pasCod,
      disCod,
      pasFotURL,
      pasDes,
      pasDis
    );
    res
      .status(200)
      .json({ message: "Paseador actualizado correctamente", updateResponse });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteWalker = async (req, res) => {
  const { id: pasCod } = req.params;
  try {
    const deleteResponse = await PaseadorModel.delete(pasCod);
    res
      .status(200)
      .json({ message: "Paseador eliminado correctamente", deleteResponse });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerWalkerPorCod = async (req, res) => {
  const { id: pasCod } = req.params;
  try {
    const [paseador] = await PaseadorModel.getPaseadorPorCod(pasCod);
    res.status(200).json(paseador);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
export const login = async (req, res) => {
  const { pasCor: email, pasCon: passwordBody } = req.body;

  try {
    const [paseador] = await PaseadorModel.getPaseadorPorCorreo(email);
    if (paseador.length > 0) {
      const [{ PasCon: password }] = paseador;
      const isMatch = await bcrypt.compare(passwordBody, password);
      if (isMatch) {
        res.status(200).json(paseador);
      } else {
        res.status(400).json({ message: "Contraseña incorrecta" });
      }
    } else {
      res.status(400).json({ message: "Paseador no existente" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
