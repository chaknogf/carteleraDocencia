import { GruposDeEdad } from './interfaces';

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

export interface Valores {
  value: number;
  label: string;
}

export const grupoEdad: Valores[] = [
  { value: 1, label: '18-30' },
  { value: 2, label: '31-49' },
  { value: 3, label: '50-70' },
  { value: 4, label: '71 o más' }

]

export const pertenencia: Valores[] = [
  { value: 1, label: 'Maya' },
  { value: 2, label: 'Garifuna' },
  { value: 3, label: 'Xinca' },
  { value: 4, label: 'Ladino' },
  { value: 5, label: 'Otro' }
]

export const idiomas: Valores[] = [
  { value: 1, label: 'Achi' },
  { value: 2, label: 'Akateka' },
  { value: 3, label: 'Awakateka' },
  { value: 4, label: 'Chórtí' },
  { value: 5, label: 'Chalchiteka' },
  { value: 6, label: 'Chuj' },
  { value: 7, label: 'Itza' },
  { value: 8, label: 'Ixil' },
  { value: 9, label: 'Jakalteka' },
  { value: 10, label: 'Kíché' },
  { value: 11, label: 'Kaqchikel' },
  { value: 12, label: 'Mam' },
  { value: 13, label: 'Mopan' },
  { value: 14, label: 'Poqomam' },
  { value: 15, label: 'Poqomchí' },
  { value: 16, label: 'Qánjobál' },
  { value: 17, label: 'Qéqchí' },
  { value: 18, label: 'Sakapulteka' },
  { value: 19, label: 'Sipakapense' },
  { value: 20, label: 'Tektiteka' },
  { value: 21, label: 'Tzútujil' },
  { value: 22, label: 'Uspanteka' },
  { value: 23, label: 'Xinka' },
  { value: 24, label: 'Garífuna' },
  { value: 25, label: 'Español' },
  { value: 26, label: 'Idioma Extranjero' },
  { value: 27, label: 'No Indica' }
];

export const discapacidades: Valores[] = [
  { value: 1, label: 'Visual' },
  { value: 2, label: 'Auditiva' },
  { value: 3, label: 'Motriz (Física)' },
  { value: 4, label: 'De lenguaje' },
  { value: 5, label: 'Sensorial' },
  { value: 6, label: 'Ninguna' }
];
