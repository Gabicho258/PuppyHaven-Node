import { Request, Response } from "express";
import {
  TramiteCreateRequest,
  TramiteFilterQuery,
  TramiteUpdateRequest,
} from "../interfaces";
import prisma from "../lib/prisma";

// Estados válidos para trámites
const ESTADOS_VALIDOS = ["P", "A", "R", "C"]; // Pendiente, Aprobado, Rechazado, Completado

// Obtener todos los trámites
export const getAllTramite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      estado,
      fechaInicio,
      fechaFin,
      mascotaId,
      page = "1",
      limit = "10",
    }: TramiteFilterQuery = req.query;

    // Paginación
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Construir filtros
    const where: any = {};

    if (estado && ESTADOS_VALIDOS.includes(estado.toUpperCase())) {
      where.estado = estado.toUpperCase();
    }

    if (mascotaId) {
      where.mascotaId = parseInt(mascotaId, 10);
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

    const [allTramites, total] = await Promise.all([
      prisma.tramite.findMany({
        where,
        select: {
          id: true,
          usuarioAdoptadorId: true,
          usuarioDuenoId: true,
          fechaAno: true,
          fechaMes: true,
          fechaDia: true,
          mascotaId: true,
          estado: true,
          adoptador: {
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
          dueno: {
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
          mascota: {
            select: {
              id: true,
              nombre: true,
              raza: true,
              color: true,
              edad: true,
              fotoUrl: true,
              descripcion: true,
              paraAdopcion: true,
            },
          },
        },
        orderBy: [
          { fechaAno: "desc" },
          { fechaMes: "desc" },
          { fechaDia: "desc" },
          { id: "desc" },
        ],
        skip,
        take: limitNum,
      }),
      prisma.tramite.count({ where }),
    ]);

    const response = {
      tramites: allTramites,
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
    console.error("Error al obtener trámites:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear nuevo trámite
export const createTramite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      traUsuCodAdo,
      traUsuCodDue,
      traFecAno,
      traFeMes,
      traFecDia,
      traMasCod,
    }: TramiteCreateRequest = req.body;

    // Validación de datos
    if (
      !traUsuCodAdo ||
      !traUsuCodDue ||
      !traFecAno ||
      !traFeMes ||
      !traFecDia ||
      !traMasCod
    ) {
      res.status(400).json({ error: "Todos los campos son requeridos" });
      return;
    }

    // Validar que el adoptador y dueño no sean la misma persona
    if (traUsuCodAdo === traUsuCodDue) {
      res.status(400).json({
        error: "El adoptador y el dueño no pueden ser la misma persona",
      });
      return;
    }

    // Validar fecha
    if (
      traFecAno < 2024 ||
      traFeMes < 1 ||
      traFeMes > 12 ||
      traFecDia < 1 ||
      traFecDia > 31
    ) {
      res.status(400).json({ error: "Fecha inválida" });
      return;
    }

    // Verificar que el usuario adoptador existe
    const adoptadorExiste = await prisma.usuario.findUnique({
      where: { id: traUsuCodAdo },
    });

    if (!adoptadorExiste) {
      res.status(404).json({ error: "Usuario adoptador no encontrado" });
      return;
    }

    // Verificar que el usuario dueño existe
    const duenoExiste = await prisma.usuario.findUnique({
      where: { id: traUsuCodDue },
    });

    if (!duenoExiste) {
      res.status(404).json({ error: "Usuario dueño no encontrado" });
      return;
    }

    // Verificar que la mascota existe, está disponible para adopción y pertenece al dueño
    const mascota = await prisma.mascota.findUnique({
      where: { id: traMasCod },
      select: {
        id: true,
        nombre: true,
        paraAdopcion: true,
        usuarioId: true,
      },
    });

    if (!mascota) {
      res.status(404).json({ error: "Mascota no encontrada" });
      return;
    }

    if (!mascota.paraAdopcion) {
      res
        .status(400)
        .json({ error: "La mascota no está disponible para adopción" });
      return;
    }

    if (mascota.usuarioId !== traUsuCodDue) {
      res.status(400).json({
        error: "La mascota no pertenece al usuario dueño especificado",
      });
      return;
    }

    // Verificar que no existe ya un trámite pendiente o aprobado para esta mascota
    const tramiteExistente = await prisma.tramite.findFirst({
      where: {
        mascotaId: traMasCod,
        estado: { in: ["P", "A"] },
      },
    });

    if (tramiteExistente) {
      res.status(409).json({
        error: "Ya existe un trámite activo para esta mascota",
        tramiteId: tramiteExistente.id,
      });
      return;
    }

    const nuevoTramite = await prisma.tramite.create({
      data: {
        usuarioAdoptadorId: traUsuCodAdo,
        usuarioDuenoId: traUsuCodDue,
        fechaAno: traFecAno,
        fechaMes: traFeMes,
        fechaDia: traFecDia,
        mascotaId: traMasCod,
        estado: "P", // Pendiente por defecto
      },
      select: {
        id: true,
        usuarioAdoptadorId: true,
        usuarioDuenoId: true,
        fechaAno: true,
        fechaMes: true,
        fechaDia: true,
        mascotaId: true,
        estado: true,
        adoptador: {
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
        dueno: {
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
        mascota: {
          select: {
            id: true,
            nombre: true,
            raza: true,
            color: true,
            edad: true,
            fotoUrl: true,
            descripcion: true,
            paraAdopcion: true,
          },
        },
      },
    });

    res.status(201).json(nuevoTramite);
  } catch (err) {
    console.error("Error al crear trámite:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener trámites por adoptador
export const obtenerTramitePorAdopter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.query;
    const traUsuCodAdo = parseInt(id, 10);

    if (isNaN(traUsuCodAdo)) {
      res.status(400).json({ error: "ID de usuario adoptador inválido" });
      return;
    }

    const where: any = { usuarioAdoptadorId: traUsuCodAdo };

    if (estado && ESTADOS_VALIDOS.includes((estado as string).toUpperCase())) {
      where.estado = (estado as string).toUpperCase();
    }

    const tramites = await prisma.tramite.findMany({
      where,
      select: {
        id: true,
        usuarioDuenoId: true,
        fechaAno: true,
        fechaMes: true,
        fechaDia: true,
        mascotaId: true,
        estado: true,
        dueno: {
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
        mascota: {
          select: {
            id: true,
            nombre: true,
            raza: true,
            color: true,
            edad: true,
            fotoUrl: true,
            descripcion: true,
            paraAdopcion: true,
          },
        },
      },
      orderBy: [
        { fechaAno: "desc" },
        { fechaMes: "desc" },
        { fechaDia: "desc" },
        { id: "desc" },
      ],
    });

    res.status(200).json(tramites);
  } catch (err) {
    console.error("Error al obtener trámites por adoptador:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener trámites por dueño
export const obtenerTramitePorDueno = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { estado } = req.query;
    const traUsuCodDue = parseInt(id, 10);

    if (isNaN(traUsuCodDue)) {
      res.status(400).json({ error: "ID de usuario dueño inválido" });
      return;
    }

    const where: any = { usuarioDuenoId: traUsuCodDue };

    if (estado && ESTADOS_VALIDOS.includes((estado as string).toUpperCase())) {
      where.estado = (estado as string).toUpperCase();
    }

    const tramites = await prisma.tramite.findMany({
      where,
      select: {
        id: true,
        usuarioAdoptadorId: true,
        fechaAno: true,
        fechaMes: true,
        fechaDia: true,
        mascotaId: true,
        estado: true,
        adoptador: {
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
        mascota: {
          select: {
            id: true,
            nombre: true,
            raza: true,
            color: true,
            edad: true,
            fotoUrl: true,
            descripcion: true,
            paraAdopcion: true,
          },
        },
      },
      orderBy: [
        { fechaAno: "desc" },
        { fechaMes: "desc" },
        { fechaDia: "desc" },
        { id: "desc" },
      ],
    });

    res.status(200).json(tramites);
  } catch (err) {
    console.error("Error al obtener trámites por dueño:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualizar estado del trámite
export const updateTramitePorCod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { traCod, traEst }: TramiteUpdateRequest = req.body;

    // Validación de datos
    if (!traCod || !traEst?.trim()) {
      res.status(400).json({ error: "ID del trámite y estado son requeridos" });
      return;
    }

    if (!ESTADOS_VALIDOS.includes(traEst.toUpperCase())) {
      res.status(400).json({ error: "Estado inválido" });
      return;
    }

    // Verificar que el trámite existe
    const tramiteExiste = await prisma.tramite.findUnique({
      where: { id: traCod },
      select: {
        id: true,
        estado: true,
        mascotaId: true,
        mascota: {
          select: {
            paraAdopcion: true,
          },
        },
      },
    });

    if (!tramiteExiste) {
      res.status(404).json({ error: "Trámite no encontrado" });
      return;
    }

    const estadoAnterior = tramiteExiste.estado;
    const nuevoEstado = traEst.toUpperCase();

    // Validar transiciones de estado válidas
    const transicionesValidas: { [key: string]: string[] } = {
      P: ["A", "R"], // Pendiente puede ir a Aprobado o Rechazado
      A: ["C", "R"], // Aprobado puede ir a Completado o Rechazado
      R: ["P"], // Rechazado puede volver a Pendiente
      C: [], // Completado es estado final
    };

    if (!transicionesValidas[estadoAnterior]?.includes(nuevoEstado)) {
      res.status(400).json({
        error: `Transición de estado inválida: ${estadoAnterior} → ${nuevoEstado}`,
        estadoActual: estadoAnterior,
        transicionesValidas: transicionesValidas[estadoAnterior],
      });
      return;
    }

    // Usar transacción para actualizar trámite y mascota si es necesario
    const tramiteActualizado = await prisma.$transaction(async (tx) => {
      // Actualizar el trámite
      const tramite = await tx.tramite.update({
        where: { id: traCod },
        data: { estado: nuevoEstado },
        select: {
          id: true,
          estado: true,
          fechaAno: true,
          fechaMes: true,
          fechaDia: true,
          mascotaId: true,
        },
      });

      // Si el trámite se completa, marcar la mascota como no disponible para adopción
      if (nuevoEstado === "C") {
        await tx.mascota.update({
          where: { id: tramiteExiste.mascotaId },
          data: { paraAdopcion: false },
        });
      }

      // Si el trámite se rechaza y la mascota no está disponible, hacerla disponible
      if (nuevoEstado === "R" && !tramiteExiste.mascota.paraAdopcion) {
        await tx.mascota.update({
          where: { id: tramiteExiste.mascotaId },
          data: { paraAdopcion: true },
        });
      }

      return tramite;
    });

    res.status(200).json({
      message: "Trámite editado correctamente",
      tramite: tramiteActualizado,
      transicion: `${estadoAnterior} → ${nuevoEstado}`,
    });
  } catch (err) {
    console.error("Error al actualizar trámite:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener trámite por ID
export const obtenerTramitePorCod = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const traCod = parseInt(id, 10);

    if (isNaN(traCod)) {
      res.status(400).json({ error: "ID de trámite inválido" });
      return;
    }

    const tramite = await prisma.tramite.findUnique({
      where: { id: traCod },
      select: {
        id: true,
        usuarioAdoptadorId: true,
        usuarioDuenoId: true,
        fechaAno: true,
        fechaMes: true,
        fechaDia: true,
        mascotaId: true,
        estado: true,
        adoptador: {
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
        },
        dueno: {
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
        mascota: {
          select: {
            id: true,
            nombre: true,
            raza: true,
            color: true,
            edad: true,
            fotoUrl: true,
            descripcion: true,
            paraAdopcion: true,
          },
        },
      },
    });

    if (!tramite) {
      res.status(404).json({ error: "Trámite no encontrado" });
      return;
    }

    res.status(200).json(tramite);
  } catch (err) {
    console.error("Error al obtener trámite:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función adicional: Obtener estadísticas de trámites
export const obtenerEstadisticasTramites = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const estadisticas = await prisma.tramite.groupBy({
      by: ["estado"],
      _count: {
        id: true,
      },
    });

    const stats = {
      total: 0,
      pendientes: 0,
      aprobados: 0,
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
          stats.aprobados = stat._count.id;
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

// Función adicional: Cancelar trámite (solo si está pendiente)
export const cancelarTramite = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const traCod = parseInt(id, 10);

    if (isNaN(traCod)) {
      res.status(400).json({ error: "ID de trámite inválido" });
      return;
    }

    const tramite = await prisma.tramite.findUnique({
      where: { id: traCod },
      select: {
        id: true,
        estado: true,
        mascotaId: true,
      },
    });

    if (!tramite) {
      res.status(404).json({ error: "Trámite no encontrado" });
      return;
    }

    if (tramite.estado !== "P") {
      res.status(400).json({
        error: "Solo se pueden cancelar trámites pendientes",
        estadoActual: tramite.estado,
      });
      return;
    }

    await prisma.tramite.delete({
      where: { id: traCod },
    });

    res.status(200).json({
      message: "Trámite cancelado exitosamente",
      tramiteId: traCod,
    });
  } catch (err) {
    console.error("Error al cancelar trámite:", err);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
