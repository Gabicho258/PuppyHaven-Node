// Interfaces para tipado
export interface PaseadorCreateRequest {
  pasNom: string;
  pasCor: string;
  pasCon: string;
  disCod: number;
  pasFotURL: string;
  pasFecNacAno: number;
  pasFecNacMes: number;
  pasFecNacDia: number;
  pasDes: string;
  pasDis: string; // JSON string con horarios de disponibilidad
}

export interface PaseadorUpdateRequest {
  pasCod: number;
  disCod: number;
  pasFotURL: string;
  pasDes: string;
  pasDis: string;
}

export interface PaseadorLoginRequest {
  pasCor: string;
  pasCon: string;
}

export interface PaseadorResponse {
  id: number;
  nombre: string;
  correo: string;
  fotoUrl: string;
  fechaNacAno: number;
  fechaNacMes: number;
  fechaNacDia: number;
  descripcion: string;
  disponibilidad: string;
  distrito: {
    id: number;
    nombre: string;
  };
  calificacion: {
    id: number;
    meGusta: number;
    noGusta: number;
  };
  _count?: {
    paseos: number;
    comentarios: number;
  };
}

export interface PaseadorFilterQuery {
  distrito?: string;
  disponible?: string;
  calificacionMin?: string;
  nombre?: string;
  page?: string;
  limit?: string;
  includeStats?: string;
}
