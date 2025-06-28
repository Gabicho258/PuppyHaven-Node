// Interfaces para tipado
export interface UsuarioCreateRequest {
  usuNom: string;
  usuCor: string;
  usuCon: string;
  disCod: number;
  usuFotURL: string;
  usuFecNacAno: number;
  usuFecNacMes: number;
  usuFecNacDia: number;
}

export interface UsuarioUpdateRequest {
  usuCod: number;
  usuNom: string;
  disCod: number;
  usuFotURL: string;
}

export interface LoginRequest {
  usuCor: string;
  usuCon: string;
}

export interface UsuarioResponse {
  id: number;
  nombre: string;
  correo: string;
  fotoUrl: string;
  fechaNacAno: number;
  fechaNacMes: number;
  fechaNacDia: number;
  distrito: {
    id: number;
    nombre: string;
  };
  _count?: {
    mascotas: number;
    paseos: number;
    comentarios: number;
    tramitesComoAdoptador: number;
    tramitesComoDueno: number;
  };
}

export interface UserFilterQuery {
  distrito?: string;
  edad?: string;
  nombre?: string;
  page?: string;
  limit?: string;
  includeStats?: string;
}
