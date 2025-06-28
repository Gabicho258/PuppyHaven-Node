export interface CalificacionCreateRequest {
  calMeGus: number;
  calNoGus: number;
}

export interface CalificacionUpdateRequest {
  calCod: number;
  calMeGus: number;
  calNoGus: number;
}

export interface CalificacionResponse {
  id: number;
  meGusta: number;
  noGusta: number;
}
