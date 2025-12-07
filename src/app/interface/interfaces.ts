import { estado, actividad, modalidad, mes } from './enum';
export interface Usuarios {
  id: number;
  nombre: string;
  username: string;
  password: string;
  email: string;
  role: string;
  estado: string;
  servicio_id?: number | null;
  google_id?: string;

}

export interface Currentuser {
  id: number;
  username: string;
  role: string;
  nombre?: string;
  email?: string;
  servicio_id?: number;
  servicio?: {
    nombre: string;
  }

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
  puesto_funcional: string;
  // jefe_inmediato: string;
  activo: boolean;
  subdireccion_id: number;
  subdireccion?: { id: number; nombre: string; persona_encargada: string };
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
  horario_programado: string;
  lugar_id: number;
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
  horario_programado: string;
  lugar_id: number;
  lugar: string;
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
  servicio_id: number;
  subdireccion: string;
  subdireccion_id: number;
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
  suspendida: number;
  total: number;
  ejecutado: number;
}

export interface ResumenAnual {
  anio: number;
  programadas: number;
  reprogramadas: number;
  completadas: number;
  anuladas: number;
  total: number;
}

export interface Lugares {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface GruposDeEdad {
  id: number;
  rango: string;
}

export interface PertenenciaCultural {
  id: number;
  nombre: string;
}
export interface ExtrasAsistencia {
  comentario: string;
  opinion: string;
  codigo_empleado: number;
  idioma: number;
  discapacidad: number;
  unidad_administrativa: string;
}
export interface Asistencia {
  id: number;
  nombre_completo: string;
  sexo_id: number;
  grupo_edad_id: number;
  cui: number;
  puesto_funcional: string;
  pertenencia_cultural_id: number;
  telefono_email: string;
  datos_extras: ExtrasAsistencia;
  capacitacion_id: number;
  fecha_registro: string;
}

// interface para validador
export interface VerificadorResponse {
  valido: boolean;
  mensaje: string;
  coincidencias: ActividadCoincidencia[];
}

export interface ActividadCoincidencia {
  id: number;
  tema: string;
  hora: string;       // formato HH:mm:ss
  lugar: string;
  servicio: string;
}


