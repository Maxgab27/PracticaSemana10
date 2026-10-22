export interface Customer {
  id: string;
  nombre: string;
  gastoAcumulado: number;
  visitas6Meses: number;
  antiguedadMeses: number;
  segmento?: number;
}

export type CustomerFormData = Omit<Customer, 'segmento'>;

export interface CustomerFilterOptions {
  searchTerm?: string;
  segmento?: number | 'todos';
  sortBy?: 'nombre' | 'gastoAcumulado' | 'visitas6Meses' | 'antiguedadMeses';
  sortOrder?: 'asc' | 'desc';
}
