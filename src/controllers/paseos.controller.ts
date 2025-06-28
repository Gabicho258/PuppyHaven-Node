import { Request, Response } from "express";
import {
  PaseoCreateRequest,
  PaseoFilterQuery,
  PaseoUpdateRequest,
} from "../interfaces/IPaseo";
import prisma from "../lib/prisma";

// Estados válidos para paseos
const ESTADOS_VALIDOS = ["P", "A", "C", "R"]; // Pendiente, Aceptado, Completado, Rechazado

// Obtener todos los paseos
export const getAllPaseos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      estado,
      distrito,
      fechaInicio,
      fechaFin,
      paseadorId,
      usuarioId,
      page = "1",
      limit = "10",
    }: PaseoFilterQuery = req.query;

    // Paginación
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {};

    if (estado && ESTADOS_VALIDOS.includes(estado.toUpperCase())) {
      where.estado = estado.toUpperCase();
    }

    if (distrito) {
      where.distrito = {
        contains: distrito,
        mode: "insensitive",
      };
    }

    if (paseadorId) {
      where.paseadorId = parseInt(paseadorId, 10);
    }

    if (usuarioId) {
      where.usuarioId = parseInt(usuarioId, 10);
    }

    // Filtros de fecha
    if (fechaInicio || fechaFin) {
      if (fechaInicio) {
        const [ano, mes, dia] = fechaInicio.split("-").map(Number);
        where.OR = [
          { fechaAno: { gt: ano } },
          {
            AND: [{ fechaAno: ano }, { fechaMes: { gt: mes } }],
          },
          {
            AND: [
              { fechaAno: ano },
              { fechaMes: mes },
              { fechaDia: { gte: dia } },
            ],
          },
        ];
      }

      if (fechaFin) {
        const [ano, mes, dia] = fechaFin.split("-").map(Number);
        const fechaCondition = {
          OR: [
            { fechaAno: { lt: ano } },
            {
              AND: [{ fechaAno: ano }, { fechaMes: { lt: mes } }],
            },
            {
              AND: [
                { fechaAno: ano },
                { fechaMes: mes },
                { fechaDia: { lte: dia } },
              ],
            },
          ],
        };

        if (where.OR) {
          where.AND = [{ OR: where.OR }, fechaCondition];
          delete where.OR;
        } else {
          where.OR = fechaCondition.OR;
        }
      }
    }

    const [allPaseos, total] = await Promise.all([
      prisma.paseo.findMany({
        where,
        select: {
          id: true,
          paseadorId: true,
          usuarioId: true,
          distrito: true,
          direccion: true,
          fechaAno: true,
          fechaMes: true,
          fechaDia: true,
          hora: true,
          cantidadHoras: true,
          estado: true,
          paseador: {
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
          paseoMascotas: {
            select: {
              mascota: {
                select: {
                  id: true,
                  nombre: true,
                  raza: true,
                  fotoUrl: true,
                },
              },
            },
          },
        },
        orderBy: [
          { fechaAno: "desc" },
          { fechaMes: "desc" },
          { fechaDia: "desc" },
          { hora: "desc" },
        ],
        skip,
        take: limitNum,
      }),
      prisma.paseo.count({ where }),
    ]);

    const response = {
      paseos: allPaseos,
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
    console.error("Error al obtener paseos:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear nuevo paseo
export const createPaseos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      pasCod,
      usuCod,
      pasDis,
      pasDir,
      pasFecAno,
      pasFecMes,
      pasFecDia,
      pasHor,
      pasCanHor,
      pasEst = "P",
      mascotas,
    }: PaseoCreateRequest = req.body;

    // Validación de datos
    if (
      !pasCod ||
      !usuCod ||
      !pasDis?.trim() ||
      !pasDir?.trim() ||
      !pasFecAno ||
      !pasFecMes ||
      !pasFecDia ||
      !pasHor?.trim() ||
      !pasCanHor ||
      !Array.isArray(mascotas) ||
      mascotas.length === 0
    ) {
      res.status(400).json({ error: "Todos los campos son requeridos" });
      return;
    }

    // Validar fecha
    if (
      pasFecAno < 2024 ||
      pasFecMes < 1 ||
      pasFecMes > 12 ||
      pasFecDia < 1 ||
      pasFecDia > 31
    ) {
      res.status(400).json({ error: "Fecha inválida" });
      return;
    }

    // Validar horas
    if (pasCanHor < 1 || pasCanHor > 8) {
      res
        .status(400)
        .json({ error: "La cantidad de horas debe estar entre 1 y 8" });
      return;
    }

    // Validar estado
    if (!ESTADOS_VALIDOS.includes(pasEst.toUpperCase())) {
      res.status(400).json({ error: "Estado inválido" });
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

    // Verificar que el usuario existe
    const usuarioExiste = await prisma.usuario.findUnique({
      where: { id: usuCod },
    });

    if (!usuarioExiste) {
      res.status(404).json({ error: "Usuario no encontrado" });
      return;
    }

    // Verificar que todas las mascotas existen y pertenecen al usuario
    const mascotasValidas = await prisma.mascota.findMany({
      where: {
        id: { in: mascotas },
        usuarioId: usuCod,
      },
    });

    if (mascotasValidas.length !== mascotas.length) {
      res.status(400).json({
        error: "Una o más mascotas no pertenecen al usuario o no existen",
      });
      return;
    }

    // Crear paseo con transacción
    const nuevoPaseo = await prisma.$transaction(async (tx) => {
      // Crear el paseo
      const paseo = await tx.paseo.create({
        data: {
          paseadorId: pasCod,
          usuarioId: usuCod,
          distrito: pasDis.trim(),
          direccion: pasDir.trim(),
          fechaAno: pasFecAno,
          fechaMes: pasFecMes,
          fechaDia: pasFecDia,
          hora: pasHor.trim(),
          cantidadHoras: pasCanHor,
          estado: pasEst.toUpperCase(),
        },
      });

      // Crear las relaciones con mascotas
      await tx.paseoMascota.createMany({
        data: mascotas.map((mascotaId) => ({
          paseoId: paseo.id,
          mascotaId: mascotaId,
        })),
      });

      return paseo;
    });

    // Obtener el paseo completo con relaciones
    const paseoCompleto = await prisma.paseo.findUnique({
      where: { id: nuevoPaseo.id },
      select: {
        id: true,
        paseadorId: true,
        usuarioId: true,
        distrito: true,
        direccion: true,
        fechaAno: true,
        fechaMes: true,
        fechaDia: true,
        hora: true,
        cantidadHoras: true,
        estado: true,
        paseador: {
          select: {
            id: true,
            nombre: true,
            fotoUrl: true,
          },
        },
        usuario: {
          select: {
            id: true,
            nombre: true,
            fotoUrl: true,
          },
        },
        paseoMascotas: {
          select: {
            mascota: {
              select: {
                id: true,
                nombre: true,
                raza: true,
                fotoUrl: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(paseoCompleto);
  } catch (err) {
    console.error("Error al crear paseo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Editar paseo existente (principalmente estado)
export const editPaseos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { pasNum, pasEst }: PaseoUpdateRequest = req.body;

    // Validación de datos
    if (!pasNum || !pasEst?.trim()) {
      res.status(400).json({ error: "ID del paseo y estado son requeridos" });
      return;
    }

    if (!ESTADOS_VALIDOS.includes(pasEst.toUpperCase())) {
      res.status(400).json({ error: "Estado inválido" });
      return;
    }

    // Verificar que el paseo existe
    const paseoExiste = await prisma.paseo.findUnique({
      where: { id: pasNum },
    });

    if (!paseoExiste) {
      res.status(404).json({ error: "Paseo no encontrado" });
      return;
    }

    const paseoActualizado = await prisma.paseo.update({
      where: { id: pasNum },
      data: {
        estado: pasEst.toUpperCase(),
      },
      select: {
        id: true,
        estado: true,
        fechaAno: true,
        fechaMes: true,
        fechaDia: true,
        hora: true,
      },
    });

    res.status(200).json({
      message: "Paseo editado correctamente",
      paseo: paseoActualizado,
    });
  } catch (err) {
    console.error("Error al editar paseo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar paseo
export const deletePaseos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const pasNum = parseInt(id, 10);

    if (isNaN(pasNum)) {
      res.status(400).json({ error: "ID de paseo inválido" });
      return;
    }

    // Verificar que el paseo existe
    const paseo = await prisma.paseo.findUnique({
      where: { id: pasNum },
      select: {
        id: true,
        estado: true,
        fechaAno: true,
        fechaMes: true,
        fechaDia: true,
      },
    });

    if (!paseo) {
      res.status(404).json({ error: "Paseo no encontrado" });
      return;
    }

    // Solo permitir eliminar paseos pendientes o rechazados
    if (!["P", "R"].includes(paseo.estado)) {
      res.status(409).json({
        error: "Solo se pueden eliminar paseos pendientes o rechazados",
        estado: paseo.estado,
      });
      return;
    }

    await prisma.paseo.delete({
      where: { id: pasNum },
    });

    res.status(200).json({
      message: "Paseo eliminado correctamente",
      paseoId: pasNum,
    });
  } catch (err) {
    console.error("Error al eliminar paseo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener paseos por paseador
export const obtenerPaseosPorPasCod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.query;
    const pasCod = parseInt(id, 10);

    if (isNaN(pasCod)) {
      res.status(400).json({ error: "ID de paseador inválido" });
      return;
    }

    const where: any = { paseadorId: pasCod };

    if (estado && ESTADOS_VALIDOS.includes((estado as string).toUpperCase())) {
      where.estado = (estado as string).toUpperCase();
    }

    const paseos = await prisma.paseo.findMany({
      where,
      select: {
        id: true,
        usuarioId: true,
        distrito: true,
        direccion: true,
        fechaAno: true,
        fechaMes: true,
        fechaDia: true,
        hora: true,
        cantidadHoras: true,
        estado: true,
        usuario: {
          select: {
            id: true,
            nombre: true,
            fotoUrl: true,
          },
        },
        paseoMascotas: {
          select: {
            mascota: {
              select: {
                id: true,
                nombre: true,
                raza: true,
                fotoUrl: true,
              },
            },
          },
        },
      },
      orderBy: [
        { fechaAno: "desc" },
        { fechaMes: "desc" },
        { fechaDia: "desc" },
        { hora: "desc" },
      ],
    });

    res.status(200).json(paseos);
  } catch (err) {
    console.error("Error al obtener paseos por paseador:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener paseos por usuario
export const obtenerPaseosPorUsuCod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.query;
    const usuCod = parseInt(id, 10);

    if (isNaN(usuCod)) {
      res.status(400).json({ error: "ID de usuario inválido" });
      return;
    }

    const where: any = { usuarioId: usuCod };

    if (estado && ESTADOS_VALIDOS.includes((estado as string).toUpperCase())) {
      where.estado = (estado as string).toUpperCase();
    }

    const paseos = await prisma.paseo.findMany({
      where,
      select: {
        id: true,
        paseadorId: true,
        distrito: true,
        direccion: true,
        fechaAno: true,
        fechaMes: true,
        fechaDia: true,
        hora: true,
        cantidadHoras: true,
        estado: true,
        paseador: {
          select: {
            id: true,
            nombre: true,
            fotoUrl: true,
            calificacion: {
              select: {
                meGusta: true,
                noGusta: true,
              },
            },
          },
        },
        paseoMascotas: {
          select: {
            mascota: {
              select: {
                id: true,
                nombre: true,
                raza: true,
                fotoUrl: true,
              },
            },
          },
        },
      },
      orderBy: [
        { fechaAno: "desc" },
        { fechaMes: "desc" },
        { fechaDia: "desc" },
        { hora: "desc" },
      ],
    });

    res.status(200).json(paseos);
  } catch (err) {
    console.error("Error al obtener paseos por usuario:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener paseo por número
export const obtenerPaseoPorPasNum = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const pasNum = parseInt(id, 10);

    if (isNaN(pasNum)) {
      res.status(400).json({ error: "ID de paseo inválido" });
      return;
    }

    const paseo = await prisma.paseo.findUnique({
      where: { id: pasNum },
      select: {
        id: true,
        paseadorId: true,
        usuarioId: true,
        distrito: true,
        direccion: true,
        fechaAno: true,
        fechaMes: true,
        fechaDia: true,
        hora: true,
        cantidadHoras: true,
        estado: true,
        paseador: {
          select: {
            id: true,
            nombre: true,
            fotoUrl: true,
            descripcion: true,
            calificacion: {
              select: {
                meGusta: true,
                noGusta: true,
              },
            },
            distrito: {
              select: {
                id: true,
                nombre: true,
              },
            },
          },
        },
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
        paseoMascotas: {
          select: {
            mascota: {
              select: {
                id: true,
                nombre: true,
                raza: true,
                color: true,
                edad: true,
                fotoUrl: true,
                descripcion: true,
              },
            },
          },
        },
      },
    });

    if (!paseo) {
      res.status(404).json({ error: "Paseo no encontrado" });
      return;
    }

    res.status(200).json(paseo);
  } catch (err) {
    console.error("Error al obtener paseo:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función adicional: Obtener estadísticas de paseos
export const obtenerEstadisticasPaseos = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const estadisticas = await prisma.paseo.groupBy({
      by: ["estado"],
      _count: {
        id: true,
      },
    });

    const stats = {
      total: 0,
      pendientes: 0,
      aceptados: 0,
      completados: 0,
      rechazados: 0,
    };

    estadisticas.forEach((stat) => {
      stats.total += stat._count.id;
      switch (stat.estado) {
        case "P":
          stats.pendientes = stat._count.id;
          break;
        case "A":
          stats.aceptados = stat._count.id;
          break;
        case "C":
          stats.completados = stat._count.id;
          break;
        case "R":
          stats.rechazados = stat._count.id;
          break;
      }
    });

    res.status(200).json(stats);
  } catch (err) {
    console.error("Error al obtener estadísticas:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
