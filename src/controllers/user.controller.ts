import bcrypt from "bcrypt";
import { UsuarioModel } from "../models/index.js";
import { passwordToHash } from "../utils/passwordToHash.js";

export const getAllUsers = async (req, res) => {
  try {
    const [allUsers] = await UsuarioModel.getAll();
    res.status(200).json(allUsers);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
export const createUser = async (req, res) => {
  const {
    usuNom,
    usuCor,
    usuCon: passwordBody,
    disCod,
    usuFotURL,
    usuFecNacAno,
    usuFecNacMes,
    usuFecNacDia,
  } = req.body;

  try {
    const [userLooked] = await UsuarioModel.getUsuarioPorCorreo(usuCor);
    if (userLooked.length > 0) {
      return res.status(400).json({ error: "El correo ya existe" });
    }
    const usuCon = await passwordToHash(passwordBody);
    const [{ insertId: usuCod }] = await UsuarioModel.create(
      usuNom,
      usuCor,
      usuCon,
      disCod,
      usuFotURL,
      usuFecNacAno,
      usuFecNacMes,
      usuFecNacDia
    );
    const [usuario] = await UsuarioModel.getUsuarioPorCod(usuCod);
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ erro: err });
  }
};

export const editUser = async (req, res) => {
  try {
    const { usuCod, usuNom, disCod, usuFotURL } = req.body;
    const updateResponse = await UsuarioModel.update(
      usuCod,
      usuNom,
      disCod,
      usuFotURL
    );
    res
      .status(200)
      .json({ message: "Usuario actualizado correctamente", updateResponse });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const deleteUser = async (req, res) => {
  const { id: usuCod } = req.params;
  try {
    const deleteResponse = await UsuarioModel.delete(usuCod);
    res
      .status(200)
      .json({ message: "Usuario eliminado correctamente", deleteResponse });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const obtenerUserPorCod = async (req, res) => {
  const { id: usuCod } = req.params;
  try {
    const [usuario] = await UsuarioModel.getUsuarioPorCod(usuCod);
    res.status(200).json(usuario);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const login = async (req, res) => {
  const { usuCor: email, usuCon: passwordBody } = req.body;

  try {
    const [usuario] = await UsuarioModel.getUsuarioPorCorreo(email);
    if (usuario.length > 0) {
      const [{ UsuCon: password }] = usuario;
      const isMatch = await bcrypt.compare(passwordBody, password);
      if (isMatch) {
        res.status(200).json(usuario);
      } else {
        res.status(400).json({ message: "Contraseña incorrecta" });
      }
    } else {
      res.status(400).json({ message: "Usuario no existente" });
    }
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
