import { estado, actividad, modalidad, mes } from './enum';
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

export interface SubdirecionPertenece {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface ServicioResponsables {
  id: number;
  nombre: string;
  descripcion: string;
  encargado_servicio: string;
  jefe_inmediato: string;
  activo: boolean;
  subdireccion_id: number;
  subdireccion: { id: number; nombre: string };
}

export interface TipoActividad {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface Modalidades {
  id: number;
  nombre: string;
  descripcion: string;
  activo: boolean;
}

export interface Estados {
  id: number;
  codigo: string;
  nombre: string;

}

export interface meses {
  id: number;
  nombre: string;

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

export interface Actividades {
  id: number;
  tema: string;
  actividad_id: number;
  servicio_id: number;
  subdireccion_id: number;
  modalidad_id: number;
  estado_id: number;
  mes_id: number;
  persona_responsable: { [key: string]: PersonaResponsable };
  detalles: Detalles;
  metadatos: Metadatos;
  tiempo_aproximado: string;
  fecha_programada: string;
}



export interface ActividadesVista {
  id: number;
  tema: string;
  actividad: string;
  actividad_id: number;
  descripcion_actividad: string;
  subdireccion: string;
  subdireccion_id: number;
  servicio_encargado: string;
  servicio_id: number;
  persona_responsable: { [key: string]: PersonaResponsable };
  tiempo_aproximado: string;
  fecha_programada: string;
  mes: string;
  mes_id: number;
  anio: number;
  modalidad: string;
  modalidad_id: number;
  estado: string;
  estado_id: number;
  detalles: Detalles;
  metadatos: Metadatos;

}



export interface Reportes {
  id: number;
  tema: string;
  actividad: string;
  servicio_encargado: string;
  subdireccion: string;
  fecha_programada: string;
  mes: string;
  mes_id: number;
  anio: number;
  modalidad: string;
  estado: string;
  nota: string;
  jefe_inmediato: string;
  encargado_servicio: string;
}



export interface Ejecucion {
  subdireccion_id: number;
  subdireccion: string
  servicio_id: number;
  servicio_encargado: string;
  anio: number;
  completa: number;
  programada: number;
  reprogramada: number;
  anulada: number;
  total: number;
}

export interface ResumenAnual {
  anio: number;
  programadas: number;
  reprogramadas: number;
  completadas: number;
  anuladas: number;
  total: number;
}
