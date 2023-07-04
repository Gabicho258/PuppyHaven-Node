import { CalificacionModel } from "../models/index.js";

export const getAllCalificaciones = async (req, res) => {
  try {
    const [allCalificaciones] = await CalificacionModel.getAll();
    res.status(200).json(allCalificaciones);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const createCalificaciones = async (req, res) => {
  try {
    const { calMeGus, calNoGus } = req.body;
    const [{ insertId: calCod }] = await CalificacionModel.create(
      calMeGus,
      calNoGus
    );
    const [calificacion] = await CalificacionModel.getCalificacionesPorCod(
      calCod
    );
    res.status(201).json(calificacion);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const editCalificaciones = async (req, res) => {
  try {
    const { calCod, calMeGus, calNoGus } = req.body;
    const putResponse = await CalificacionModel.update(
      calCod,
      calMeGus,
      calNoGus
    );
    res.status(200).json(putResponse);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerCalificacionesPorCod = async (req, res) => {
  try {
    const { id: calCod } = req.params;
    const [calificacion] = await CalificacionModel.getCalificacionesPorCod(
      calCod
    );
    res.status(200).json(calificacion);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
