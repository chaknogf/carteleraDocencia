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
