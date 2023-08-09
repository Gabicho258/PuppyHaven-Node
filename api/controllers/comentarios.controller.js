import {
  CalificacionModel,
  ComentariosModel,
  PaseadorModel,
} from "../models/index.js";

export const getAllComentarios = async (req, res) => {
  try {
    const allComentarios = await ComentariosModel.getAll();
    res.status(200).json(allComentarios);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const createComentarios = async (req, res) => {
  const { usuCod, pasCod, comIsLike, comTex } = req.body;
  try {
    const { insertId: comCod } = await ComentariosModel.create(
      usuCod,
      pasCod,
      comIsLike,
      comTex
    );
    const [[{ CalCod }]] = await PaseadorModel.getPaseadorPorCod(pasCod);
    const [[{ CalMeGus, CalNoGus }]] =
      await CalificacionModel.getCalificacionesPorCod(CalCod);
    if (comIsLike) {
      await CalificacionModel.update(CalCod, CalMeGus + 1, CalNoGus);
    } else {
      await CalificacionModel.update(CalCod, CalMeGus, CalNoGus + 1);
    }

    res.status(201).json({ cod: comCod });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerComentariosPorPasCod = async (req, res) => {
  try {
    const { id: pasCod } = req.params;
    const comentarios = await ComentariosModel.getComentariosPorPaseadorCod(
      pasCod
    );
    res.status(200).json(comentarios);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
