// Interfaces para tipado
export interface TramiteCreateRequest {
  traUsuCodAdo: number;
  traUsuCodDue: number;
  traFecAno: number;
  traFeMes: number;
  traFecDia: number;
  traMasCod: number;
}

export interface TramiteUpdateRequest {
  traCod: number;
  traEst: string;
}

export interface TramiteResponse {
  id: number;
  usuarioAdoptadorId: number;
  usuarioDuenoId: number;
  fechaAno: number;
  fechaMes: number;
  fechaDia: number;
  mascotaId: number;
  estado: string;
  adoptador?: {
    id: number;
    nombre: string;
    correo: string;
    fotoUrl: string;
    distrito: {
      id: number;
      nombre: string;
    };
  };
  dueno?: {
    id: number;
    nombre: string;
    correo: string;
    fotoUrl: string;
    distrito: {
      id: number;
      nombre: string;
    };
  };
  mascota?: {
    id: number;
    nombre: string;
    raza: string;
    color: string;
    edad: number;
    fotoUrl: string;
    descripcion: string;
    paraAdopcion: boolean;
  };
}

export interface TramiteFilterQuery {
  estado?: string;
  fechaInicio?: string;
  fechaFin?: string;
  mascotaId?: string;
  page?: string;
  limit?: string;
}
