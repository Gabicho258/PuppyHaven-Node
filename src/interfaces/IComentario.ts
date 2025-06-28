// Interfaces para tipado
export interface ComentarioCreateRequest {
  usuCod: number;
  pasCod: number;
  comIsLike: boolean;
  comTex: string;
}

export interface ComentarioResponse {
  id: number;
  usuarioId: number;
  paseadorId: number;
  esLike: boolean;
  texto: string;
  usuario?: {
    id: number;
    nombre: string;
    fotoUrl: string;
  };
  paseador?: {
    id: number;
    nombre: string;
    fotoUrl: string;
  };
}

export interface CreateComentarioResponse {
  cod: number;
}
