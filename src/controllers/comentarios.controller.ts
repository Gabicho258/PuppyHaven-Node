import { Request, Response } from "express";
import {
  ComentarioCreateRequest,
  ComentarioResponse,
  CreateComentarioResponse,
} from "../interfaces";
import prisma from "../lib/prisma";

// Obtener todos los comentarios
export const getAllComentarios = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allComentarios: ComentarioResponse[] =
      await prisma.comentario.findMany({
        select: {
          id: true,
          usuarioId: true,
          paseadorId: true,
          esLike: true,
          texto: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              fotoUrl: true,
            },
          },
          paseador: {
            select: {
              id: true,
              nombre: true,
              fotoUrl: true,
            },
          },
        },
        orderBy: {
          id: "desc", // Ordenar por más recientes
        },
      });

    res.status(200).json(allComentarios);
  } catch (err) {
    console.error("Error al obtener comentarios:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear nuevo comentario
export const createComentarios = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { usuCod, pasCod, comIsLike, comTex }: ComentarioCreateRequest =
      req.body;

    // Validación de datos
    if (
      !usuCod ||
      !pasCod ||
      typeof comIsLike !== "boolean" ||
      !comTex?.trim()
    ) {
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

    // Verificar que el paseador existe y obtener su calificación
    const paseador = await prisma.paseador.findUnique({
      where: { id: pasCod },
      select: {
        id: true,
        calificacionId: true,
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
      res.status(404).json({ error: "Paseador no encontrado" });
      return;
    }

    // Iniciar transacción para crear comentario y actualizar calificación
    const result = await prisma.$transaction(async (tx) => {
      // Crear el comentario
      const nuevoComentario = await tx.comentario.create({
        data: {
          usuarioId: usuCod,
          paseadorId: pasCod,
          esLike: comIsLike,
          texto: comTex.trim(),
        },
        select: {
          id: true,
        },
      });

      // Actualizar la calificación del paseador
      const { meGusta, noGusta } = paseador.calificacion;

      await tx.calificacion.update({
        where: { id: paseador.calificacionId },
        data: {
          meGusta: comIsLike ? meGusta + 1 : meGusta,
          noGusta: comIsLike ? noGusta : noGusta + 1,
        },
      });

      return nuevoComentario;
    });

    const response: CreateComentarioResponse = { cod: result.id };
    res.status(201).json(response);
  } catch (err) {
    console.error("Error al crear comentario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener comentarios por código de paseador
export const obtenerComentariosPorPasCod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const pasCod = parseInt(id, 10);

    // Validar ID
    if (isNaN(pasCod)) {
      res.status(400).json({ error: "ID de paseador inválido" });
      return;
    }

    // Verificar que el paseador existe
    const paseadorExiste = await prisma.paseador.findUnique({
      where: { id: pasCod },
      select: { id: true },
    });

    if (!paseadorExiste) {
      res.status(404).json({ error: "Paseador no encontrado" });
      return;
    }

    const comentarios: ComentarioResponse[] = await prisma.comentario.findMany({
      where: { paseadorId: pasCod },
      select: {
        id: true,
        usuarioId: true,
        paseadorId: true,
        esLike: true,
        texto: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            fotoUrl: true,
          },
        },
      },
      orderBy: {
        id: "desc", // Más recientes primero
      },
    });

    res.status(200).json(comentarios);
  } catch (err) {
    console.error("Error al obtener comentarios por paseador:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función adicional: Obtener estadísticas de comentarios de un paseador
export const obtenerEstadisticasComentarios = async (
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

    const estadisticas = await prisma.comentario.groupBy({
      by: ["esLike"],
      where: { paseadorId: pasCod },
      _count: {
        id: true,
      },
    });

    const stats = {
      totalComentarios: 0,
      likes: 0,
      dislikes: 0,
    };

    estadisticas.forEach((stat) => {
      stats.totalComentarios += stat._count.id;
      if (stat.esLike) {
        stats.likes = stat._count.id;
      } else {
        stats.dislikes = stat._count.id;
      }
    });

    res.status(200).json(stats);
  } catch (err) {
    console.error("Error al obtener estadísticas:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
