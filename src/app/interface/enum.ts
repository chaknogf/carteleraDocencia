
export interface Meses {
  value: number;
  label: string;
}

export const mes: Meses[] = [
  { value: 1, label: 'Enero' },
  { value: 2, label: 'Febrero' },
  { value: 3, label: 'Marzo' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Mayo' },
  { value: 6, label: 'Junio' },
  { value: 7, label: 'Julio' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Septiembre' },
  { value: 10, label: 'Octubre' },
  { value: 11, label: 'Noviembre' },
  { value: 12, label: 'Diciembre' },
]

export interface Modalidad {
  value: string;
  label: string;
}
export const modalidad: Modalidad[] = [
  { value: 'P', label: 'Presencial' },
  { value: 'V', label: 'Virtual' },
]
export interface Estado {
  value: string;
  label: string;
}
export const estado: Estado[] = [
  { value: 'P', label: 'Programada' },
  { value: 'C', label: 'Completada' },
  { value: 'S', label: 'Suspendida' },
  { value: 'R', label: 'Reprogramada' },
]

export interface ActividadTipo {
  value: number;
  label: string;
}
export const actividad: ActividadTipo[] = [
  { value: 1, label: 'Capacitación' },
  { value: 2, label: 'Charla' },
]

