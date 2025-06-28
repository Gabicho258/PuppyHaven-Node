import { Request, Response } from "express";
import {
  PaseadorCreateRequest,
  PaseadorFilterQuery,
  PaseadorLoginRequest,
  PaseadorUpdateRequest,
} from "../interfaces";
import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
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

// Función para validar JSON de disponibilidad
const validarDisponibilidad = (disponibilidad: string): boolean => {
  try {
    const parsed = JSON.parse(disponibilidad);
    // Verificar que sea un objeto con días de la semana
    const diasValidos = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo",
    ];
    return (
      typeof parsed === "object" &&
      Object.keys(parsed).some((dia) => diasValidos.includes(dia.toLowerCase()))
    );
  } catch {
    return false;
  }
};

// Obtener todos los paseadores
export const getAllWalkers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      distrito,
      disponible,
      calificacionMin,
      nombre,
      page = "1",
      limit = "10",
      includeStats,
    }: PaseadorFilterQuery = req.query;

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

    // Filtro por disponibilidad (buscar en JSON)
    if (disponible) {
      where.disponibilidad = {
        contains: disponible.toLowerCase(),
      };
    }

    // Filtro por calificación mínima
    if (calificacionMin) {
      const minCalif = parseInt(calificacionMin, 10);
      where.calificacion = {
        meGusta: {
          gte: minCalif,
        },
      };
    }

    const [allWalkers, total] = await Promise.all([
      prisma.paseador.findMany({
        where,
        select: {
          id: true,
          nombre: true,
          correo: true,
          fotoUrl: true,
          fechaNacAno: true,
          fechaNacMes: true,
          fechaNacDia: true,
          distritoId: true,
          descripcion: true,
          disponibilidad: true,
          distrito: {
            select: {
              id: true,
              nombre: true,
            },
          },
          calificacion: {
            select: {
              id: true,
              meGusta: true,
              noGusta: true,
            },
          },
          ...(includeStats === "true" && {
            _count: {
              select: {
                paseos: true,
                comentarios: true,
              },
            },
          }),
        },
        orderBy: [
          {
            calificacion: {
              meGusta: "desc",
            },
          },
          { id: "desc" },
        ],
      }),
      prisma.paseador.count({ where }),
    ]);

    // Agregar edad calculada y rating
    const walkersConExtras = allWalkers.map((walker) => ({
      ...walker,
      edad: calcularEdad(
        walker.fechaNacAno,
        walker.fechaNacMes,
        walker.fechaNacDia
      ),
      rating: {
        positivos: walker.calificacion.meGusta,
        negativos: walker.calificacion.noGusta,
        total: walker.calificacion.meGusta + walker.calificacion.noGusta,
        porcentaje:
          walker.calificacion.meGusta + walker.calificacion.noGusta > 0
            ? Math.round(
                (walker.calificacion.meGusta /
                  (walker.calificacion.meGusta + walker.calificacion.noGusta)) *
                  100
              )
            : 0,
      },
    }));

    const response = {
      paseadores: walkersConExtras,
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error al obtener paseadores:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear nuevo paseador
export const createWalker = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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
    }: PaseadorCreateRequest = req.body;

    // Validación de datos
    if (
      !pasNom?.trim() ||
      !pasCor?.trim() ||
      !passwordBody?.trim() ||
      !disCod ||
      !pasFotURL?.trim() ||
      !pasFecNacAno ||
      !pasFecNacMes ||
      !pasFecNacDia ||
      !pasDes?.trim() ||
      !pasDis?.trim()
    ) {
      res.status(400).json({ error: "Todos los campos son requeridos" });
      return;
    }

    // Validar email
    if (!isValidEmail(pasCor)) {
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
      pasFecNacAno < 1900 ||
      pasFecNacAno > new Date().getFullYear() ||
      pasFecNacMes < 1 ||
      pasFecNacMes > 12 ||
      pasFecNacDia < 1 ||
      pasFecNacDia > 31
    ) {
      res.status(400).json({ error: "Fecha de nacimiento inválida" });
      return;
    }

    // Validar edad mínima (18 años)
    const edad = calcularEdad(pasFecNacAno, pasFecNacMes, pasFecNacDia);
    if (edad < 18) {
      res.status(400).json({
        error: "Debe ser mayor de 18 años para registrarse como paseador",
      });
      return;
    }

    // Validar disponibilidad JSON
    if (!validarDisponibilidad(pasDis)) {
      res.status(400).json({
        error:
          "El formato de disponibilidad es inválido. Debe ser un JSON válido con días de la semana",
      });
      return;
    }

    // Verificar si el correo ya existe
    const paseadorExistente = await prisma.paseador.findUnique({
      where: { correo: pasCor.toLowerCase().trim() },
    });

    if (paseadorExistente) {
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
    const pasCon = await passwordToHash(passwordBody);

    // Crear paseador con transacción (incluye calificación inicial)
    const nuevoPaseador = await prisma.$transaction(async (tx) => {
      // Crear calificación inicial
      const calificacion = await tx.calificacion.create({
        data: {
          meGusta: 0,
          noGusta: 0,
        },
      });

      // Crear paseador
      const paseador = await tx.paseador.create({
        data: {
          nombre: pasNom.trim(),
          correo: pasCor.toLowerCase().trim(),
          contrasena: pasCon,
          distritoId: disCod,
          fotoUrl: pasFotURL.trim(),
          fechaNacAno: pasFecNacAno,
          fechaNacMes: pasFecNacMes,
          fechaNacDia: pasFecNacDia,
          descripcion: pasDes.trim(),
          disponibilidad: pasDis.trim(),
          calificacionId: calificacion.id,
        },
        select: {
          id: true,
          nombre: true,
          correo: true,
          fotoUrl: true,
          fechaNacAno: true,
          fechaNacMes: true,
          fechaNacDia: true,
          descripcion: true,
          disponibilidad: true,
          distrito: {
            select: {
              id: true,
              nombre: true,
            },
          },
          calificacion: {
            select: {
              id: true,
              meGusta: true,
              noGusta: true,
            },
          },
        },
      });

      return paseador;
    });

    // Agregar edad calculada
    const paseadorConEdad = {
      ...nuevoPaseador,
      edad: calcularEdad(
        nuevoPaseador.fechaNacAno,
        nuevoPaseador.fechaNacMes,
        nuevoPaseador.fechaNacDia
      ),
    };

    res.status(201).json(paseadorConEdad);
  } catch (err) {
    console.error("Error al crear paseador:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Editar paseador existente
export const editWalker = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { pasCod, disCod, pasFotURL, pasDes, pasDis }: PaseadorUpdateRequest =
      req.body;

    // Validación de datos
    if (
      !pasCod ||
      !disCod ||
      !pasFotURL?.trim() ||
      !pasDes?.trim() ||
      !pasDis?.trim()
    ) {
      console.log(req.body);
      res.status(400).json({ error: "Todos los campos son requeridos" });
      return;
    }

    // Validar disponibilidad JSON
    if (!validarDisponibilidad(pasDis)) {
      res.status(400).json({
        error:
          "El formato de disponibilidad es inválido. Debe ser un JSON válido con días de la semana",
      });
      return;
    }

    // Verificar que el paseador existe
    const paseadorExiste = await prisma.paseador.findUnique({
      where: { id: pasCod },
    });

    if (!paseadorExiste) {
      res.status(404).json({ error: "Paseador no encontrado" });
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

    const paseadorActualizado = await prisma.paseador.update({
      where: { id: pasCod },
      data: {
        distritoId: disCod,
        fotoUrl: pasFotURL.trim(),
        descripcion: pasDes.trim(),
        disponibilidad: pasDis.trim(),
      },
      select: {
        id: true,
        nombre: true,
        correo: true,
        fotoUrl: true,
        fechaNacAno: true,
        fechaNacMes: true,
        fechaNacDia: true,
        descripcion: true,
        disponibilidad: true,
        distrito: {
          select: {
            id: true,
            nombre: true,
          },
        },
        calificacion: {
          select: {
            id: true,
            meGusta: true,
            noGusta: true,
          },
        },
      },
    });

    res.status(200).json({
      message: "Paseador actualizado correctamente",
      paseador: paseadorActualizado,
    });
  } catch (err) {
    console.error("Error al editar paseador:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar paseador
export const deleteWalker = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const pasCod = parseInt(id, 10);

    if (isNaN(pasCod)) {
      res.status(400).json({ error: "ID de paseador inválido" });
      return;
    }

    // Verificar que el paseador existe y obtener información de relaciones
    const paseador = await prisma.paseador.findUnique({
      where: { id: pasCod },
      select: {
        id: true,
        nombre: true,
        calificacionId: true,
        _count: {
          select: {
            paseos: true,
            comentarios: true,
          },
        },
      },
    });

    if (!paseador) {
      res.status(404).json({ error: "Paseador no encontrado" });
      return;
    }

    // Verificar si tiene relaciones activas
    const relacionesActivas =
      paseador._count.paseos + paseador._count.comentarios;

    if (relacionesActivas > 0) {
      res.status(409).json({
        error:
          "No se puede eliminar el paseador porque tiene registros asociados",
        relaciones: paseador._count,
      });
      return;
    }

    // Eliminar paseador y calificación en transacción
    await prisma.$transaction(async (tx) => {
      await tx.paseador.delete({
        where: { id: pasCod },
      });

      await tx.calificacion.delete({
        where: { id: paseador.calificacionId },
      });
    });

    res.status(200).json({
      message: "Paseador eliminado correctamente",
      paseador: paseador.nombre,
    });
  } catch (err) {
    console.error("Error al eliminar paseador:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener paseador por ID
export const obtenerWalkerPorCod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { includeStats } = req.query;
    const pasCod = parseInt(id, 10);

    if (isNaN(pasCod)) {
      res.status(400).json({ error: "ID de paseador inválido" });
      return;
    }

    const paseador = await prisma.paseador.findUnique({
      where: { id: pasCod },
      select: {
        id: true,
        nombre: true,
        correo: true,
        fotoUrl: true,
        fechaNacAno: true,
        fechaNacMes: true,
        fechaNacDia: true,
        descripcion: true,
        disponibilidad: true,
        distritoId: true,
        distrito: {
          select: {
            id: true,
            nombre: true,
          },
        },
        calificacion: {
          select: {
            id: true,
            meGusta: true,
            noGusta: true,
          },
        },
        ...(includeStats === "true" && {
          _count: {
            select: {
              paseos: true,
              comentarios: true,
            },
          },
          comentarios: {
            select: {
              esLike: true,
              texto: true,
              usuario: {
                select: {
                  nombre: true,
                  fotoUrl: true,
                },
              },
            },
            orderBy: {
              id: "desc",
            },
          },
        }),
      },
    });

    if (!paseador) {
      res.status(404).json({ error: "Paseador no encontrado" });
      return;
    }

    // Agregar edad calculada y rating
    const paseadorConExtras = {
      ...paseador,
      edad: calcularEdad(
        paseador.fechaNacAno,
        paseador.fechaNacMes,
        paseador.fechaNacDia
      ),
      rating: {
        positivos: paseador.calificacion.meGusta,
        negativos: paseador.calificacion.noGusta,
        total: paseador.calificacion.meGusta + paseador.calificacion.noGusta,
        porcentaje:
          paseador.calificacion.meGusta + paseador.calificacion.noGusta > 0
            ? Math.round(
                (paseador.calificacion.meGusta /
                  (paseador.calificacion.meGusta +
                    paseador.calificacion.noGusta)) *
                  100
              )
            : 0,
      },
    };

    res.status(200).json(paseadorConExtras);
  } catch (err) {
    console.error("Error al obtener paseador:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Login de paseador
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { pasCor: email, pasCon: passwordBody }: PaseadorLoginRequest =
      req.body;

    // Validación de datos
    if (!email?.trim() || !passwordBody?.trim()) {
      res.status(400).json({ error: "Email y contraseña son requeridos" });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ error: "Formato de email inválido" });
      return;
    }

    // Buscar paseador por email
    const paseador = await prisma.paseador.findUnique({
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
        descripcion: true,
        disponibilidad: true,
        distrito: {
          select: {
            id: true,
            nombre: true,
          },
        },
        calificacion: {
          select: {
            id: true,
            meGusta: true,
            noGusta: true,
          },
        },
      },
    });

    if (!paseador) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(passwordBody, paseador.contrasena);

    if (!isMatch) {
      res.status(401).json({ error: "Credenciales inválidas" });
      return;
    }

    // Remover contraseña de la respuesta y agregar extras
    const { contrasena, ...paseadorSinPassword } = paseador;

    const paseadorConExtras = {
      ...paseadorSinPassword,
      edad: calcularEdad(
        paseador.fechaNacAno,
        paseador.fechaNacMes,
        paseador.fechaNacDia
      ),
      rating: {
        positivos: paseador.calificacion.meGusta,
        negativos: paseador.calificacion.noGusta,
        total: paseador.calificacion.meGusta + paseador.calificacion.noGusta,
        porcentaje:
          paseador.calificacion.meGusta + paseador.calificacion.noGusta > 0
            ? Math.round(
                (paseador.calificacion.meGusta /
                  (paseador.calificacion.meGusta +
                    paseador.calificacion.noGusta)) *
                  100
              )
            : 0,
      },
    };

    res.status(200).json({
      message: "Login exitoso",
      paseador: paseadorConExtras,
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
    const { pasCod, contrasenaActual, contrasenaNueva } = req.body;

    // Validación de datos
    if (!pasCod || !contrasenaActual?.trim() || !contrasenaNueva?.trim()) {
      res.status(400).json({ error: "Todos los campos son requeridos" });
      return;
    }

    if (contrasenaNueva.length < 6) {
      res.status(400).json({
        error: "La nueva contraseña debe tener al menos 6 caracteres",
      });
      return;
    }

    // Verificar paseador y contraseña actual
    const paseador = await prisma.paseador.findUnique({
      where: { id: pasCod },
      select: {
        id: true,
        contrasena: true,
      },
    });

    if (!paseador) {
      res.status(404).json({ error: "Paseador no encontrado" });
      return;
    }

    const isMatch = await bcrypt.compare(contrasenaActual, paseador.contrasena);

    if (!isMatch) {
      res.status(401).json({ error: "Contraseña actual incorrecta" });
      return;
    }

    // Hashear nueva contraseña y actualizar
    const nuevaContrasenaHash = await passwordToHash(contrasenaNueva);

    await prisma.paseador.update({
      where: { id: pasCod },
      data: { contrasena: nuevaContrasenaHash },
    });

    res.status(200).json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("Error al cambiar contraseña:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función adicional: Obtener paseadores mejor calificados
export const obtenerMejoresPaseadores = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { limite = "10", distrito } = req.query;
    const limit = Math.min(
      50,
      Math.max(1, parseInt(limite as string, 10) || 10)
    );

    const where: any = {};

    if (distrito) {
      where.distrito = {
        nombre: {
          contains: distrito as string,
          mode: "insensitive",
        },
      };
    }

    const mejoresPaseadores = await prisma.paseador.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        fotoUrl: true,
        descripcion: true,
        distrito: {
          select: {
            id: true,
            nombre: true,
          },
        },
        calificacion: {
          select: {
            meGusta: true,
            noGusta: true,
          },
        },
        _count: {
          select: {
            paseos: true,
            comentarios: true,
          },
        },
      },
      orderBy: [
        {
          calificacion: {
            meGusta: "desc",
          },
        },
      ],
      take: limit,
    });

    // Agregar rating calculado
    const paseadoresConRating = mejoresPaseadores.map((paseador) => ({
      ...paseador,
      rating: {
        positivos: paseador.calificacion.meGusta,
        negativos: paseador.calificacion.noGusta,
        total: paseador.calificacion.meGusta + paseador.calificacion.noGusta,
        porcentaje:
          paseador.calificacion.meGusta + paseador.calificacion.noGusta > 0
            ? Math.round(
                (paseador.calificacion.meGusta /
                  (paseador.calificacion.meGusta +
                    paseador.calificacion.noGusta)) *
                  100
              )
            : 0,
      },
    }));

    res.status(200).json(paseadoresConRating);
  } catch (err) {
    console.error("Error al obtener mejores paseadores:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
