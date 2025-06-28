export interface DistritoCreateRequest {
  disNom: string;
}

export interface DistritoUpdateRequest {
  disCod: number;
  disNom: string;
}

export interface DistritoResponse {
  id: number;
  nombre: string;
  _count?: {
    usuarios: number;
    paseadores: number;
  };
}
