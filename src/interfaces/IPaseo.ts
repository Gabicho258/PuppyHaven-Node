// Interfaces para tipado
export interface PaseoCreateRequest {
  pasCod: number;
  usuCod: number;
  pasDis: string;
  pasDir: string;
  pasFecAno: number;
  pasFecMes: number;
  pasFecDia: number;
  pasHor: string;
  pasCanHor: number;
  pasEst?: string;
  mascotas: number[];
}

export interface PaseoUpdateRequest {
  pasNum: number;
  pasDir?: string;
  masCod?: number;
  pasEst: string;
}

export interface PaseoResponse {
  id: number;
  paseadorId: number;
  usuarioId: number;
  distrito: string;
  direccion: string;
  fechaAno: number;
  fechaMes: number;
  fechaDia: number;
  hora: string;
  cantidadHoras: number;
  estado: string;
  paseador?: {
    id: number;
    nombre: string;
    fotoUrl: string;
    distrito: {
      id: number;
      nombre: string;
    };
  };
  usuario?: {
    id: number;
    nombre: string;
    fotoUrl: string;
    distrito: {
      id: number;
      nombre: string;
    };
  };
  paseoMascotas?: {
    mascota: {
      id: number;
      nombre: string;
      raza: string;
      fotoUrl: string;
    };
  }[];
}

export interface PaseoFilterQuery {
  estado?: string;
  distrito?: string;
  fechaInicio?: string;
  fechaFin?: string;
  paseadorId?: string;
  usuarioId?: string;
  page?: string;
  limit?: string;
}
