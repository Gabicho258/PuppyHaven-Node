import { MascotasModel } from "../models/index.js";

export const getAllMascotas = async (req, res) => {
  try {
    const [allMascotas] = await MascotasModel.getAll();
    res.status(200).json(allMascotas);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const createMascota = async (req, res) => {
  const {
    masNom,
    masCol,
    masRaz,
    masEda,
    masFotURL,
    masDes,
    masIsToAdo,
    masUsuCod,
  } = req.body;
  try {
    const [{ insertId: masCod }] = await MascotasModel.create(
      masNom,
      masCol,
      masRaz,
      masEda,
      masFotURL,
      masDes,
      masIsToAdo,
      masUsuCod
    );
    const [mascota] = await MascotasModel.getMascotaPorCod(masCod);
    res.status(201).json(mascota);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const editMascota = async (req, res) => {
  const {
    masCod,
    masNom,
    masCol,
    masRaz,
    masEda,
    masFotURL,
    masDes,
    masIsToAdo,
    masUsuCod,
  } = req.body;
  try {
    const updateResponse = await MascotasModel.update(
      masCod,
      masNom,
      masCol,
      masRaz,
      masEda,
      masFotURL,
      masDes,
      masIsToAdo,
      masUsuCod
    );
    res
      .status(200)
      .json({ message: "Mascota editada correctamente", updateResponse });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteMascota = async (req, res) => {
  const { id: masCod } = req.params;
  try {
    const deleteResponse = await MascotasModel.delete(masCod);
    res
      .status(200)
      .json({ message: "Mascota eliminada correctamente", deleteResponse });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerMascotaPorCod = async (req, res) => {
  try {
    const { id: masCod } = req.params;
    const [mascota] = await MascotasModel.getMascotaPorCod(masCod);
    res.status(200).json(mascota);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerMascotasPorUsuCod = async (req, res) => {
  try {
    const { id: usuCod } = req.params;
    const [mascotas] = await MascotasModel.getMascotasPorUserCod(usuCod);
    res.status(200).json(mascotas);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
