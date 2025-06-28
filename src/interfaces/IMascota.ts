// Interfaces para tipado
export interface MascotaCreateRequest {
  masNom: string;
  masCol: string;
  masRaz: string;
  masEda: number;
  masFotURL: string;
  masDes: string;
  masIsToAdo: boolean;
  masUsuCod: number;
}

export interface MascotaUpdateRequest extends MascotaCreateRequest {
  masCod: number;
}

export interface MascotaResponse {
  id: number;
  nombre: string;
  color: string;
  raza: string;
  edad: number;
  fotoUrl: string;
  descripcion: string;
  paraAdopcion: boolean;
  usuarioId: number;
  usuario?: {
    id: number;
    nombre: string;
    correo: string;
    fotoUrl: string;
    distrito: {
      id: number;
      nombre: string;
    };
  };
}

export interface MascotaFilterQuery {
  paraAdopcion?: string;
  distrito?: string;
  raza?: string;
  edadMin?: string;
  edadMax?: string;
  page?: string;
  limit?: string;
}
