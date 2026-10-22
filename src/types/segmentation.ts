export interface ClusterGroupSummary {
  id: number;
  segmento: number;
  cantidad: number;
  gastoPromedio: number;
  visitasPromedio: number;
  antiguedadPromedio: number;
}

export interface SegmentationSummary {
  k: number;
  fechaEjecucion: string;
  cantidadProcesada: number;
  grupos: ClusterGroupSummary[];
}

export interface SegmentationRequest {
  k: number;
  customers: {
    id: string;
    gastoAcumulado: number;
    visitas6Meses: number;
    antiguedadMeses: number;
  }[];
}

export interface SegmentationResponse {
  k: number;
  labels: {
    id: string;
    segmento: number;
  }[];
  groups: ClusterGroupSummary[];
}
