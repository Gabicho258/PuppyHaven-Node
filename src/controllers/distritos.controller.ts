import { Request, Response } from "express";
import {
  DistritoCreateRequest,
  DistritoResponse,
  DistritoUpdateRequest,
} from "../interfaces";
import prisma from "../lib/prisma";

// Obtener todos los distritos
export const getAllDistritos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { includeStats } = req.query;

    const allDistritos: DistritoResponse[] = await prisma.distrito.findMany({
      select: {
        id: true,
        nombre: true,
        ...(includeStats === "true" && {
          _count: {
            select: {
              usuarios: true,
              paseadores: true,
            },
          },
        }),
      },
      orderBy: {
        nombre: "asc", // Ordenar alfabéticamente
      },
    });

    res.status(200).json(allDistritos);
  } catch (err) {
    console.error("Error al obtener distritos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear nuevo distrito
export const createDistritos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { disNom }: DistritoCreateRequest = req.body;

    // Validación de datos
    if (!disNom?.trim()) {
      res.status(400).json({ error: "El nombre del distrito es requerido" });
      return;
    }

    const nombreTrimmed = disNom.trim();

    // Verificar si ya existe un distrito con ese nombre
    const distritoExistente = await prisma.distrito.findFirst({
      where: {
        nombre: {
          equals: nombreTrimmed,
          mode: "insensitive", // Comparación case-insensitive
        },
      },
    });

    if (distritoExistente) {
      res.status(409).json({ error: "Ya existe un distrito con ese nombre" });
      return;
    }

    const nuevoDistrito = await prisma.distrito.create({
      data: {
        nombre: nombreTrimmed,
      },
      select: {
        id: true,
        nombre: true,
      },
    });

    res.status(201).json(nuevoDistrito);
  } catch (err) {
    console.error("Error al crear distrito:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Editar distrito existente
export const editDistrito = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { disCod, disNom }: DistritoUpdateRequest = req.body;

    // Validación de datos
    if (!disCod || !disNom?.trim()) {
      res
        .status(400)
        .json({ error: "ID y nombre del distrito son requeridos" });
      return;
    }

    const nombreTrimmed = disNom.trim();

    // Verificar si el distrito existe
    const distritoExiste = await prisma.distrito.findUnique({
      where: { id: disCod },
    });

    if (!distritoExiste) {
      res.status(404).json({ error: "Distrito no encontrado" });
      return;
    }

    // Verificar si ya existe otro distrito con ese nombre
    const distritoConMismoNombre = await prisma.distrito.findFirst({
      where: {
        nombre: {
          equals: nombreTrimmed,
          mode: "insensitive",
        },
        NOT: {
          id: disCod,
        },
      },
    });

    if (distritoConMismoNombre) {
      res.status(409).json({ error: "Ya existe otro distrito con ese nombre" });
      return;
    }

    const distritoActualizado = await prisma.distrito.update({
      where: { id: disCod },
      data: {
        nombre: nombreTrimmed,
      },
      select: {
        id: true,
        nombre: true,
      },
    });

    res.status(200).json(distritoActualizado);
  } catch (err) {
    console.error("Error al actualizar distrito:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener distrito por ID
export const obtenerDistritoPorCod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { includeStats } = req.query;
    const disCod = parseInt(id, 10);

    // Validar ID
    if (isNaN(disCod)) {
      res.status(400).json({ error: "ID de distrito inválido" });
      return;
    }

    const distrito = await prisma.distrito.findUnique({
      where: { id: disCod },
      select: {
        id: true,
        nombre: true,
        ...(includeStats === "true" && {
          _count: {
            select: {
              usuarios: true,
              paseadores: true,
            },
          },
        }),
      },
    });

    if (!distrito) {
      res.status(404).json({ error: "Distrito no encontrado" });
      return;
    }

    res.status(200).json(distrito);
  } catch (err) {
    console.error("Error al obtener distrito:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función adicional: Obtener distritos con más actividad
export const obtenerDistritosConActividad = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const distritosConActividad = await prisma.distrito.findMany({
      select: {
        id: true,
        nombre: true,
        _count: {
          select: {
            usuarios: true,
            paseadores: true,
          },
        },
      },
      orderBy: [
        {
          usuarios: {
            _count: "desc",
          },
        },
        {
          paseadores: {
            _count: "desc",
          },
        },
      ],
    });

    // Calcular actividad total y agregar estadísticas
    const distritosConStats = distritosConActividad.map((distrito) => ({
      ...distrito,
      actividadTotal: distrito._count.usuarios + distrito._count.paseadores,
    }));

    res.status(200).json(distritosConStats);
  } catch (err) {
    console.error("Error al obtener distritos con actividad:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función adicional: Eliminar distrito (solo si no tiene usuarios ni paseadores)
export const eliminarDistrito = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const disCod = parseInt(id, 10);

    if (isNaN(disCod)) {
      res.status(400).json({ error: "ID de distrito inválido" });
      return;
    }

    // Verificar si el distrito existe y tiene usuarios/paseadores
    const distrito = await prisma.distrito.findUnique({
      where: { id: disCod },
      select: {
        id: true,
        nombre: true,
        _count: {
          select: {
            usuarios: true,
            paseadores: true,
          },
        },
      },
    });

    if (!distrito) {
      res.status(404).json({ error: "Distrito no encontrado" });
      return;
    }

    if (distrito._count.usuarios > 0 || distrito._count.paseadores > 0) {
      res.status(409).json({
        error:
          "No se puede eliminar el distrito porque tiene usuarios o paseadores asociados",
        usuarios: distrito._count.usuarios,
        paseadores: distrito._count.paseadores,
      });
      return;
    }

    await prisma.distrito.delete({
      where: { id: disCod },
    });

    res.status(200).json({
      message: "Distrito eliminado exitosamente",
      distrito: distrito.nombre,
    });
  } catch (err) {
    console.error("Error al eliminar distrito:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
