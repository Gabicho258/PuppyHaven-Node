import { TramiteModel } from "../models/index.js";

export const getAllTramite = async (req, res) => {
  try {
    const [allTramites] = await TramiteModel.getAll();
    res.status(200).json(allTramites);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const createTramite = async (req, res) => {
  const {
    traUsuCodAdo,
    traUsuCodDue,
    traFecAno,
    traFeMes,
    traFecDia,
    traMasCod,
  } = req.body;
  try {
    const [{ insertId: traCod }] = await TramiteModel.create(
      traUsuCodAdo,
      traUsuCodDue,
      traFecAno,
      traFeMes,
      traFecDia,
      traMasCod
    );
    const [tramite] = await TramiteModel.getTramitePorCod(traCod);
    res.status(201).json(tramite);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerTramitePorAdopter = async (req, res) => {
  try {
    const { id: traUsuCodAdo } = req.params;
    const tramites = await TramiteModel.getTramitePorUsuarioAdopterCod(
      traUsuCodAdo
    );
    res.status(200).json(tramites);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerTramitePorDueno = async (req, res) => {
  try {
    const { id: traUsuCodDue } = req.params;
    const [tramites] = await TramiteModel.getTramitePorUsuarioDuenoCod(
      traUsuCodDue
    );
    res.status(200).json(tramites);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
export const updateTramitePorCod = async (req, res) => {
  try {
    const { traCod, traEst } = req.body;
    const updateResponse = await TramiteModel.updateTramite(traCod, traEst);
    res
      .status(200)
      .json({ message: "Tramite editado correctamente", updateResponse });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerTramitePorCod = async (req, res) => {
  try {
    const { id: traCod } = req.params;
    const [tramite] = await TramiteModel.getTramitePorCod(traCod);
    res.status(200).json(tramite);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
