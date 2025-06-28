import { Request, Response } from "express";
import {
  LoginRequest,
  UserFilterQuery,
  UsuarioCreateRequest,
  UsuarioUpdateRequest,
} from "../interfaces";
import prisma from "../lib/prisma";
import bcrypt from "bcrypt";
import { passwordToHash } from "../utils/passwordToHash";

// Función para validar email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Función para calcular edad
const calcularEdad = (ano: number, mes: number, dia: number): number => {
  const hoy = new Date();
  const fechaNac = new Date(ano, mes - 1, dia);
  let edad = hoy.getFullYear() - fechaNac.getFullYear();
  const mesActual = hoy.getMonth();
  const diaActual = hoy.getDate();

  if (mesActual < mes - 1 || (mesActual === mes - 1 && diaActual < dia)) {
    edad--;
  }

  return edad;
};

// Obtener todos los usuarios
export const getAllUsers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      distrito,
      edad,
      nombre,
      page = "1",
      limit = "10",
      includeStats,
    }: UserFilterQuery = req.query;

    // Paginación
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {};

    if (distrito) {
      where.distrito = {
        nombre: {
          contains: distrito,
          mode: "insensitive",
        },
      };
    }

    if (nombre) {
      where.nombre = {
        contains: nombre,
        mode: "insensitive",
      };
    }

    // Filtro por edad (aproximado basado en año de nacimiento)
    if (edad) {
      const edadNum = parseInt(edad, 10);
      const anoActual = new Date().getFullYear();
      where.fechaNacAno = {
        gte: anoActual - edadNum - 1,
        lte: anoActual - edadNum + 1,
      };
    }

    const [allUsers, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        select: {
          id: true,
          nombre: true,
          correo: true,
          fotoUrl: true,
          fechaNacAno: true,
          fechaNacMes: true,
          fechaNacDia: true,
          distrito: {
            select: {
              id: true,
              nombre: true,
            },
          },
          ...(includeStats === "true" && {
            _count: {
              select: {
                mascotas: true,
                paseos: true,
                comentarios: true,
                tramitesComoAdoptador: true,
                tramitesComoDueno: true,
              },
            },
          }),
        },
        orderBy: {
          id: "desc",
        },
        skip,
        take: limitNum,
      }),
      prisma.usuario.count({ where }),
    ]);

    const response = {
      usuarios: allUsers,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
        hasNext: pageNum < Math.ceil(total / limitNum),
        hasPrev: pageNum > 1,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear nuevo usuario
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      usuNom,
      usuCor,
      usuCon: passwordBody,
      disCod,
      usuFotURL,
      usuFecNacAno,
      usuFecNacMes,
      usuFecNacDia,
    }: UsuarioCreateRequest = req.body;

    // Validación de datos
    if (
      !usuNom?.trim() ||
      !usuCor?.trim() ||
      !passwordBody?.trim() ||
      !disCod ||
      !usuFotURL?.trim() ||
      !usuFecNacAno ||
      !usuFecNacMes ||
      !usuFecNacDia
    ) {
      res.status(400).json({ error: "Todos los campos son requeridos" });
      return;
    }

    // Validar email
    if (!isValidEmail(usuCor)) {
      res
        .status(400)
        .json({ error: "El formato del correo electrónico es inválido" });
      return;
    }

    // Validar contraseña
    if (passwordBody.length < 6) {
      res
        .status(400)
        .json({ error: "La contraseña debe tener al menos 6 caracteres" });
      return;
    }

    // Validar fecha de nacimiento
    if (
      usuFecNacAno < 1900 ||
      usuFecNacAno > new Date().getFullYear() ||
      usuFecNacMes < 1 ||
      usuFecNacMes > 12 ||
      usuFecNacDia < 1 ||
      usuFecNacDia > 31
    ) {
      res.status(400).json({ error: "Fecha de nacimiento inválida" });
      return;
    }

    // Validar edad mínima (18 años)
    const edad = calcularEdad(usuFecNacAno, usuFecNacMes, usuFecNacDia);
    if (edad < 18) {
      res
        .status(400)
        .json({ error: "Debe ser mayor de 18 años para registrarse" });
      return;
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo: usuCor.toLowerCase().trim() },
    });

    if (usuarioExistente) {
      res
        .status(409)
        .json({ error: "El correo electrónico ya está registrado" });
      return;
    }

    // Verificar que el distrito existe
    const distritoExiste = await prisma.distrito.findUnique({
      where: { id: disCod },
    });

    if (!distritoExiste) {
      res.status(404).json({ error: "Distrito no encontrado" });
      return;
    }

    // Hashear contraseña
    const usuCon = await passwordToHash(passwordBody);

    // Crear usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: usuNom.trim(),
        correo: usuCor.toLowerCase().trim(),
        contrasena: usuCon,
        distritoId: disCod,
        fotoUrl: usuFotURL.trim(),
        fechaNacAno: usuFecNacAno,
        fechaNacMes: usuFecNacMes,
        fechaNacDia: usuFecNacDia,
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        fotoUrl: true,
        fechaNacAno: true,
        fechaNacMes: true,
        fechaNacDia: true,
        distrito: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Editar usuario existente
export const editUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuCod, usuNom, disCod, usuFotURL }: UsuarioUpdateRequest =
      req.body;

    // Validación de datos
    if (!usuCod || !usuNom?.trim() || !disCod || !usuFotURL?.trim()) {
      res.status(400).json({ error: "Todos los campos son requeridos" });
      return;
    }

    // Verificar que el usuario existe
    const usuarioExiste = await prisma.usuario.findUnique({
      where: { id: usuCod },
    });

    if (!usuarioExiste) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // Verificar que el distrito existe
    const distritoExiste = await prisma.distrito.findUnique({
      where: { id: disCod },
    });

    if (!distritoExiste) {
      res.status(404).json({ error: "Distrito no encontrado" });
      return;
    }

    const usuarioActualizado = await prisma.usuario.update({
      where: { id: usuCod },
      data: {
        nombre: usuNom.trim(),
        distritoId: disCod,
        fotoUrl: usuFotURL.trim(),
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        fotoUrl: true,
        fechaNacAno: true,
        fechaNacMes: true,
        fechaNacDia: true,
        distrito: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Usuario actualizado correctamente",
      usuario: usuarioActualizado,
    });
  } catch (err) {
    console.error("Error al editar usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar usuario
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const usuCod = parseInt(id, 10);

    if (isNaN(usuCod)) {
      res.status(400).json({ error: "ID de usuario inválido" });
      return;
    }

    // Verificar que el usuario existe y obtener información de relaciones
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuCod },
      select: {
        id: true,
        nombre: true,
        _count: {
          select: {
            mascotas: true,
            paseos: true,
            comentarios: true,
            tramitesComoAdoptador: true,
            tramitesComoDueno: true,
          },
        },
      },
    });

    if (!usuario) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // Verificar si tiene relaciones activas
    const relacionesActivas =
      usuario._count.mascotas +
      usuario._count.paseos +
      usuario._count.tramitesComoAdoptador +
      usuario._count.tramitesComoDueno;

    if (relacionesActivas > 0) {
      res.status(409).json({
        error:
          "No se puede eliminar el usuario porque tiene registros asociados",
        relaciones: usuario._count,
      });
      return;
    }

    await prisma.usuario.delete({
      where: { id: usuCod },
    });

    res.status(200).json({
      message: "Usuario eliminado correctamente",
      usuario: usuario.nombre,
    });
  } catch (err) {
    console.error("Error al eliminar usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener usuario por ID
export const obtenerUserPorCod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { includeStats } = req.query;
    const usuCod = parseInt(id, 10);

    if (isNaN(usuCod)) {
      res.status(400).json({ error: "ID de usuario inválido" });
      return;
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuCod },
      select: {
        id: true,
        nombre: true,
        correo: true,
        fotoUrl: true,
        fechaNacAno: true,
        fechaNacMes: true,
        fechaNacDia: true,
        distrito: {
          select: {
            id: true,
            nombre: true,
          },
        },
        ...(includeStats === "true" && {
          _count: {
            select: {
              mascotas: true,
              paseos: true,
              comentarios: true,
              tramitesComoAdoptador: true,
              tramitesComoDueno: true,
            },
          },
        }),
      },
    });

    if (!usuario) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // Agregar edad calculada
    const usuarioConEdad = {
      ...usuario,
      edad: calcularEdad(
        usuario.fechaNacAno,
        usuario.fechaNacMes,
        usuario.fechaNacDia
      ),
    };

    res.status(200).json(usuarioConEdad);
  } catch (err) {
    console.error("Error al obtener usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Login de usuario
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usuCor: email, usuCon: passwordBody }: LoginRequest = req.body;

    // Validación de datos
    if (!email?.trim() || !passwordBody?.trim()) {
      res.status(400).json({ error: "Email y contraseña son requeridos" });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ error: "Formato de email inválido" });
      return;
    }

    // Buscar usuario por email
    const usuario = await prisma.usuario.findUnique({
      where: { correo: email.toLowerCase().trim() },
      select: {
        id: true,
        nombre: true,
        correo: true,
        contrasena: true,
        fotoUrl: true,
        fechaNacAno: true,
        fechaNacMes: true,
        fechaNacDia: true,
        distrito: {
          select: {
            id: true,
            nombre: true,
          },
        },
      },
    });

    if (!usuario) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(passwordBody, usuario.contrasena);

    if (!isMatch) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    // Remover contraseña de la respuesta
    const { contrasena, ...usuarioSinPassword } = usuario;

    // Agregar edad calculada
    const usuarioConEdad = {
      ...usuarioSinPassword,
      edad: calcularEdad(
        usuario.fechaNacAno,
        usuario.fechaNacMes,
        usuario.fechaNacDia
      ),
    };

    res.status(200).json({
      message: "Login exitoso",
      usuario: usuarioConEdad,
    });
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función adicional: Cambiar contraseña
export const cambiarContrasena = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { usuCod, contrasenaActual, contrasenaNueva } = req.body;

    // Validación de datos
    if (!usuCod || !contrasenaActual?.trim() || !contrasenaNueva?.trim()) {
      res.status(400).json({ error: "Todos los campos son requeridos" });
      return;
    }

    if (contrasenaNueva.length < 6) {
      res.status(400).json({
        error: "La nueva contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    // Verificar usuario y contraseña actual
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuCod },
      select: {
        id: true,
        contrasena: true,
      },
    });

    if (!usuario) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const isMatch = await bcrypt.compare(contrasenaActual, usuario.contrasena);

    if (!isMatch) {
      res.status(401).json({ error: "Contraseña actual incorrecta" });
      return;
    }

    // Hashear nueva contraseña y actualizar
    const nuevaContrasenaHash = await passwordToHash(contrasenaNueva);

    await prisma.usuario.update({
      where: { id: usuCod },
      data: { contrasena: nuevaContrasenaHash },
    });

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("Error al cambiar contraseña:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función adicional: Verificar disponibilidad de email
export const verificarDisponibilidadEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.params;

    if (!isValidEmail(email)) {
      res.status(400).json({ error: "Formato de email inválido" });
      return;
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: { correo: email.toLowerCase().trim() },
      select: { id: true },
    });

    res.status(200).json({
      disponible: !usuarioExistente,
      email: email.toLowerCase().trim(),
    });
  } catch (err) {
    console.error("Error al verificar email:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
