import { estado, actividad } from './enum';
export interface Usuarios {
  id: number;
  nombre: string;
  username: string;
  password: string;
  email: string;
  role: string;
  estado: string;
}

export interface Currentuser {
  id: number;
  username: string;
  role: string;
  nombre?: string;
  email?: string;
}

export interface PersonaResponsable {
  nombre: string;
  puesto: string;
}

export interface Detalles {
  link: string | null;
  duracion: string | null;
  grupo_dirigido: string | null;
  lugar: string | null;
  contenido: string | null;
  asistencia: number | null;
  inasistencia: number | null;
  excelente: number | null;
  bueno: number | null;
  regular: number | null;
  deficiente: number | null;
  fecha_entrega_informe: string | null;
  mes: number;
  nota: any | null;
}

export interface Metadatos {
  user: string;
  registro: string;
}

export interface Actividad {
  id: number;
  tema: string;
  actividad: number;
  servicio_encargado: string;
  persona_responsable: { [key: string]: PersonaResponsable };
  tiempo_aproximado: string;
  fechas_a_desarrollar: string;
  modalidad: string;
  estado: string;
  detalles: Detalles;
  metadatos: Metadatos;
}

export interface Reportes {
  id: number;
  fechas_a_desarrollar: string;
  estado: string;
  anio: number;
  tema: string;
  actividad: number;
  servicio_encargado: string;
  modalidad: string;
  mes: number;
  fecha_entrega_informe: string;
  nota: string;

}

export interface Ejecucion {
  estado: string;
  total_estado: number;
  anio: number;
  porcentaje: number;
}

export interface EServicios {
  nota: string;
  anio: number;
  total: number;
  completado: number;
  reprogramado: number;
  anulado: number;
  porcentaje: number;
  servicio_encargado: string;

}
