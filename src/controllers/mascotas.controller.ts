import { Request, Response } from "express";
import {
  MascotaCreateRequest,
  MascotaFilterQuery,
  MascotaUpdateRequest,
} from "../interfaces";
import prisma from "../lib/prisma";

// Obtener todas las mascotas
export const getAllMascotas = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      paraAdopcion,
      distrito,
      raza,
      edadMin,
      edadMax,
      page = "1",
      limit = "10",
    }: MascotaFilterQuery = req.query;

    // Paginación
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {};

    if (paraAdopcion !== undefined) {
      where.paraAdopcion = paraAdopcion === "true";
    }

    if (raza) {
      where.raza = {
        contains: raza,
        mode: "insensitive",
      };
    }

    if (edadMin || edadMax) {
      where.edad = {};
      if (edadMin) where.edad.gte = parseInt(edadMin, 10);
      if (edadMax) where.edad.lte = parseInt(edadMax, 10);
    }

    if (distrito) {
      where.usuario = {
        distrito: {
          nombre: {
            contains: distrito,
            mode: "insensitive",
          },
        },
      };
    }

    const [allMascotas, total] = await Promise.all([
      prisma.mascota.findMany({
        where,
        select: {
          id: true,
          nombre: true,
          color: true,
          raza: true,
          edad: true,
          fotoUrl: true,
          descripcion: true,
          paraAdopcion: true,
          usuarioId: true,
          usuario: {
            select: {
              id: true,
              nombre: true,
              correo: true,
              fotoUrl: true,
              distrito: {
                select: {
                  id: true,
                  nombre: true,
                },
              },
            },
          },
        },
        orderBy: [
          { paraAdopcion: "desc" }, // Mascotas en adopción primero
          { id: "desc" },
        ],
        skip,
        take: limitNum,
      }),
      prisma.mascota.count({ where }),
    ]);

    const response = {
      mascotas: allMascotas,
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
    console.error("Error al obtener mascotas:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear nueva mascota
export const createMascota = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      masNom,
      masCol,
      masRaz,
      masEda,
      masFotURL,
      masDes,
      masIsToAdo,
      masUsuCod,
    }: MascotaCreateRequest = req.body;

    // Validación de datos
    if (
      !masNom?.trim() ||
      !masCol?.trim() ||
      !masRaz?.trim() ||
      !masFotURL?.trim() ||
      !masDes?.trim() ||
      !masUsuCod
    ) {
      res.status(400).json({ error: "Todos los campos son requeridos" });
      return;
    }

    if (masEda < 0 || masEda > 30) {
      res.status(400).json({ error: "La edad debe estar entre 0 y 30 años" });
      return;
    }

    // Verificar que el usuario existe
    const usuarioExiste = await prisma.usuario.findUnique({
      where: { id: masUsuCod },
    });

    if (!usuarioExiste) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const nuevaMascota = await prisma.mascota.create({
      data: {
        nombre: masNom.trim(),
        color: masCol.trim(),
        raza: masRaz.trim(),
        edad: masEda,
        fotoUrl: masFotURL.trim(),
        descripcion: masDes.trim(),
        paraAdopcion: Boolean(masIsToAdo),
        usuarioId: masUsuCod,
      },
      select: {
        id: true,
        nombre: true,
        color: true,
        raza: true,
        edad: true,
        fotoUrl: true,
        descripcion: true,
        paraAdopcion: true,
        usuarioId: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            correo: true,
            fotoUrl: true,
            distrito: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(nuevaMascota);
  } catch (err) {
    console.error("Error al crear mascota:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Editar mascota existente
export const editMascota = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
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
    }: MascotaUpdateRequest = req.body;

    // Validación de datos
    if (
      !masCod ||
      !masNom?.trim() ||
      !masCol?.trim() ||
      !masRaz?.trim() ||
      !masFotURL?.trim() ||
      !masDes?.trim() ||
      !masUsuCod
    ) {
      res.status(400).json({ error: "Todos los campos son requeridos" });
      return;
    }

    if (masEda < 0 || masEda > 30) {
      res.status(400).json({ error: "La edad debe estar entre 0 y 30 años" });
      return;
    }

    // Verificar que la mascota existe
    const mascotaExiste = await prisma.mascota.findUnique({
      where: { id: masCod },
    });

    if (!mascotaExiste) {
      res.status(404).json({ error: "Mascota no encontrada" });
      return;
    }

    // Verificar que el usuario existe
    const usuarioExiste = await prisma.usuario.findUnique({
      where: { id: masUsuCod },
    });

    if (!usuarioExiste) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const mascotaActualizada = await prisma.mascota.update({
      where: { id: masCod },
      data: {
        nombre: masNom.trim(),
        color: masCol.trim(),
        raza: masRaz.trim(),
        edad: masEda,
        fotoUrl: masFotURL.trim(),
        descripcion: masDes.trim(),
        paraAdopcion: Boolean(masIsToAdo),
        usuarioId: masUsuCod,
      },
      select: {
        id: true,
        nombre: true,
        color: true,
        raza: true,
        edad: true,
        fotoUrl: true,
        descripcion: true,
        paraAdopcion: true,
        usuarioId: true,
      },
    });

    res.status(200).json({
      message: "Mascota editada correctamente",
      mascota: mascotaActualizada,
    });
  } catch (err) {
    console.error("Error al editar mascota:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar mascota
export const deleteMascota = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const masCod = parseInt(id, 10);

    if (isNaN(masCod)) {
      res.status(400).json({ error: "ID de mascota inválido" });
      return;
    }

    // Verificar que la mascota existe
    const mascota = await prisma.mascota.findUnique({
      where: { id: masCod },
      select: {
        id: true,
        nombre: true,
        _count: {
          select: {
            paseoMascotas: true,
            tramites: true,
          },
        },
      },
    });

    if (!mascota) {
      res.status(404).json({ error: "Mascota no encontrada" });
      return;
    }

    // Verificar si tiene relaciones activas
    if (mascota._count.paseoMascotas > 0 || mascota._count.tramites > 0) {
      res.status(409).json({
        error:
          "No se puede eliminar la mascota porque tiene paseos o trámites asociados",
        paseos: mascota._count.paseoMascotas,
        tramites: mascota._count.tramites,
      });
      return;
    }

    await prisma.mascota.delete({
      where: { id: masCod },
    });

    res.status(200).json({
      message: "Mascota eliminada correctamente",
      mascota: mascota.nombre,
    });
  } catch (err) {
    console.error("Error al eliminar mascota:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener mascota por ID
export const obtenerMascotaPorCod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const masCod = parseInt(id, 10);

    if (isNaN(masCod)) {
      res.status(400).json({ error: "ID de mascota inválido" });
      return;
    }

    const mascota = await prisma.mascota.findUnique({
      where: { id: masCod },
      select: {
        id: true,
        nombre: true,
        color: true,
        raza: true,
        edad: true,
        fotoUrl: true,
        descripcion: true,
        paraAdopcion: true,
        usuarioId: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            correo: true,
            fotoUrl: true,
            distrito: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
        _count: {
          select: {
            paseoMascotas: true,
            tramites: true,
          },
        },
      },
    });

    if (!mascota) {
      res.status(404).json({ error: "Mascota no encontrada" });
      return;
    }

    res.status(200).json(mascota);
  } catch (err) {
    console.error("Error al obtener mascota:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener mascotas por código de usuario
export const obtenerMascotasPorUsuCod = async (
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

    // Verificar que el usuario existe
    const usuarioExiste = await prisma.usuario.findUnique({
      where: { id: usuCod },
      select: { id: true },
    });

    if (!usuarioExiste) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    const mascotas = await prisma.mascota.findMany({
      where: { usuarioId: usuCod },
      select: {
        id: true,
        nombre: true,
        color: true,
        raza: true,
        edad: true,
        fotoUrl: true,
        descripcion: true,
        paraAdopcion: true,
        usuarioId: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json(mascotas);
  } catch (err) {
    console.error("Error al obtener mascotas por usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función adicional: Obtener mascotas disponibles para adopción
export const obtenerMascotasParaAdopcion = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { distrito, raza, edadMin, edadMax } = req.query;

    const where: any = { paraAdopcion: true };

    if (raza) {
      where.raza = {
        contains: raza as string,
        mode: "insensitive",
      };
    }

    if (edadMin || edadMax) {
      where.edad = {};
      if (edadMin) where.edad.gte = parseInt(edadMin as string, 10);
      if (edadMax) where.edad.lte = parseInt(edadMax as string, 10);
    }

    if (distrito) {
      where.usuario = {
        distrito: {
          nombre: {
            contains: distrito as string,
            mode: "insensitive",
          },
        },
      };
    }

    const mascotasParaAdopcion = await prisma.mascota.findMany({
      where,
      select: {
        id: true,
        nombre: true,
        color: true,
        raza: true,
        edad: true,
        fotoUrl: true,
        descripcion: true,
        usuarioId: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            fotoUrl: true,
            distrito: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    res.status(200).json(mascotasParaAdopcion);
  } catch (err) {
    console.error("Error al obtener mascotas para adopción:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
