import { Request, Response } from "express";
import {
  CalificacionCreateRequest,
  CalificacionResponse,
  CalificacionUpdateRequest,
} from "../interfaces";
import prisma from "../lib/prisma";

// Obtener todas las calificaciones
export const getAllCalificaciones = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const allCalificaciones: CalificacionResponse[] =
      await prisma.calificacion.findMany({
        select: {
          id: true,
          meGusta: true,
          noGusta: true,
        },
      });

    res.status(200).json(allCalificaciones);
  } catch (err) {
    console.error("Error al obtener calificaciones:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear nueva calificación
export const createCalificaciones = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { calMeGus, calNoGus }: CalificacionCreateRequest = req.body;

    // Validación de datos
    if (typeof calMeGus !== "number" || typeof calNoGus !== "number") {
      res.status(400).json({ error: "Los valores deben ser números" });
      return;
    }

    if (calMeGus < 0 || calNoGus < 0) {
      res.status(400).json({ error: "Los valores no pueden ser negativos" });
      return;
    }

    const nuevaCalificacion = await prisma.calificacion.create({
      data: {
        meGusta: calMeGus,
        noGusta: calNoGus,
      },
      select: {
        id: true,
        meGusta: true,
        noGusta: true,
      },
    });

    res.status(201).json(nuevaCalificacion);
  } catch (err) {
    console.error("Error al crear calificación:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Editar calificación existente
export const editCalificaciones = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { calCod, calMeGus, calNoGus }: CalificacionUpdateRequest = req.body;

    // Validación de datos
    if (
      !calCod ||
      typeof calMeGus !== "number" ||
      typeof calNoGus !== "number"
    ) {
      res.status(400).json({ error: "Datos inválidos" });
      return;
    }

    if (calMeGus < 0 || calNoGus < 0) {
      res.status(400).json({ error: "Los valores no pueden ser negativos" });
      return;
    }

    // Verificar si la calificación existe
    const calificacionExiste = await prisma.calificacion.findUnique({
      where: { id: calCod },
    });

    if (!calificacionExiste) {
      res.status(404).json({ error: "Calificación no encontrada" });
      return;
    }

    const calificacionActualizada = await prisma.calificacion.update({
      where: { id: calCod },
      data: {
        meGusta: calMeGus,
        noGusta: calNoGus,
      },
      select: {
        id: true,
        meGusta: true,
        noGusta: true,
      },
    });

    res.status(200).json(calificacionActualizada);
  } catch (err) {
    console.error("Error al actualizar calificación:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener calificación por ID
export const obtenerCalificacionesPorCod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const calCod = parseInt(id, 10);

    // Validar ID
    if (isNaN(calCod)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }

    const calificacion = await prisma.calificacion.findUnique({
      where: { id: calCod },
      select: {
        id: true,
        meGusta: true,
        noGusta: true,
      },
    });

    if (!calificacion) {
      res.status(404).json({ error: "Calificación no encontrada" });
      return;
    }

    res.status(200).json(calificacion);
  } catch (err) {
    console.error("Error al obtener calificación:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
