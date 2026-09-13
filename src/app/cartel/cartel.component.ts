import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { estado, mes } from '../interface/enum';
import { ActividadesVista, PersonaResponsable } from '../interface/interfaces';
import { ApiService } from '../service/api.service';
import { NavbarClienteComponent } from '../navs/navbarCliente/navbarCliente.component';
import { HorarioFormatPipe } from '../pipe/fechas.pipe';
import { FormsModule } from '@angular/forms';

interface DiaAgenda {
  fecha: string;
  dia: number;
  mesCorto: string;
  semana: string;
  relativo: string;
  eventos: ActividadesVista[];
}

@Component({
  selector: 'app-cartel',
  templateUrl: './cartel.component.html',
  styleUrls: ['./cartel.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarClienteComponent, HorarioFormatPipe, FormsModule]
})
export class CartelComponent implements OnInit {
  eventos: ActividadesVista[] = [];
  cargando = false;
  error = '';

  mesSeleccionado = new Date().getMonth() + 1;
  anioSeleccionado = new Date().getFullYear();
  hoy = this.fechaLocal(new Date());

  busqueda = '';
  filtroModalidad = 'Todas';
  filtroEstado = 'Todos';

  readonly mesesDisponibles = mes;
  readonly estadosCatalogo = estado;
  aniosDisponibles: number[] = [];

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  ngOnInit(): void {
    this.aniosDisponibles = Array.from({ length: 8 }, (_, i) => new Date().getFullYear() - i);
    this.cargar();
  }

  async cargar(): Promise<void> {
    this.cargando = true;
    this.error = '';
    try {
      const data: any = await this.api.getActividades({
        mes: this.mesSeleccionado,
        anio: this.anioSeleccionado,
        limit: 100
      });
      this.eventos = data?.actividades ?? [];
    } catch {
      this.error = 'No pudimos cargar el calendario. Verifica tu conexión e inténtalo de nuevo.';
    } finally {
      this.cargando = false;
    }
  }

  // ================= NAVEGACIÓN DE MES =================

  cambiarMes(delta: number): void {
    const fecha = new Date(this.anioSeleccionado, this.mesSeleccionado - 1 + delta, 1);
    this.mesSeleccionado = fecha.getMonth() + 1;
    this.anioSeleccionado = fecha.getFullYear();
    this.cargar();
  }

  irHoy(): void {
    const ahora = new Date();
    this.mesSeleccionado = ahora.getMonth() + 1;
    this.anioSeleccionado = ahora.getFullYear();
    this.cargar();
  }

  esMesActual(): boolean {
    const ahora = new Date();
    return this.mesSeleccionado === ahora.getMonth() + 1 && this.anioSeleccionado === ahora.getFullYear();
  }

  get mesLabel(): string {
    const encontrado = this.mesesDisponibles.find((m) => m.value === this.mesSeleccionado);
    return encontrado ? encontrado.label : String(this.mesSeleccionado);
  }

  get fechaLargaHoy(): string {
    return new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  // ================= FILTROS =================

  get modalidades(): string[] {
    return ['Todas', ...new Set(this.eventos.map((e) => e.modalidad).filter(Boolean))];
  }

  get estadosDisponibles(): string[] {
    const vistos = new Set(this.eventos.map((e) => this.estadoLabel(e.estado)).filter(Boolean));
    return ['Todos', ...[...vistos].sort((a, b) => a.localeCompare(b))];
  }

  get eventosFiltrados(): ActividadesVista[] {
    const q = this.busqueda.trim().toLowerCase();
    return this.eventos.filter((e) => {
      if (this.filtroModalidad !== 'Todas' && e.modalidad !== this.filtroModalidad) return false;
      if (this.filtroEstado !== 'Todos' && this.estadoLabel(e.estado) !== this.filtroEstado) return false;
      if (q) {
        const texto = [e.tema, e.servicio_encargado, e.subdireccion, e.actividad, this.responsablesTexto(e)]
          .join(' ')
          .toLowerCase();
        if (!texto.includes(q)) return false;
      }
      return true;
    });
  }

  get agenda(): DiaAgenda[] {
    const porDia = new Map<string, ActividadesVista[]>();
    const ordenados = [...this.eventosFiltrados].sort((a, b) => {
      const porFecha = a.fecha_programada.slice(0, 10).localeCompare(b.fecha_programada.slice(0, 10));
      return porFecha || a.horario_programado.localeCompare(b.horario_programado);
    });
    for (const e of ordenados) {
      const clave = e.fecha_programada.slice(0, 10);
      const arr = porDia.get(clave) || [];
      arr.push(e);
      porDia.set(clave, arr);
    }
    return [...porDia.entries()].map(([fecha, eventos]) => {
      const d = new Date(`${fecha}T00:00:00`);
      return {
        fecha,
        dia: d.getDate(),
        mesCorto: d.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''),
        semana: d.toLocaleDateString('es-ES', { weekday: 'long' }),
        relativo: this.relativo(fecha),
        eventos
      };
    });
  }

  esHoy(fecha: string): boolean {
    return fecha.slice(0, 10) === this.hoy;
  }

  esPasado(fecha: string): boolean {
    return fecha.slice(0, 10) < this.hoy;
  }

  limpiarFiltros(): void {
    this.busqueda = '';
    this.filtroModalidad = 'Todas';
    this.filtroEstado = 'Todos';
  }

  hayFiltrosActivos(): boolean {
    return !!(this.busqueda.trim() || this.filtroModalidad !== 'Todas' || this.filtroEstado !== 'Todos');
  }

  get conteoTotales(): number {
    return this.eventosFiltrados.length;
  }

  get conteoHoy(): number {
    return this.eventosFiltrados.filter((e) => this.esHoy(e.fecha_programada)).length;
  }

  get conteoProximos(): number {
    return this.eventosFiltrados.filter((e) => e.fecha_programada.slice(0, 10) > this.hoy).length;
  }

  // ================= HELPERS DE PRESENTACIÓN =================

  estadoLabel(codigo: string): string {
    const e = this.estadosCatalogo.find((s) => s.value === codigo);
    return e ? e.label : codigo;
  }

  estadoClase(codigo: string): string {
    const normalizado = codigo.trim().toLowerCase();
    if (['c', 'completado', 'completada'].includes(normalizado)) return 'est-completada';
    if (['s', 'suspendido', 'suspendida'].includes(normalizado)) return 'est-suspendida';
    if (['r', 'reprogramado', 'reprogramada'].includes(normalizado)) return 'est-reprogramada';
    return 'est-programada';
  }

  modalidadIcono(modalidad: string): string {
    switch (modalidad) {
      case 'Virtual': return '💻';
      case 'Presencial': return '🏫';
      case 'Híbrida': return '🔁';
      default: return '📋';
    }
  }

  iniciales(nombre: string): string {
    return nombre
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase();
  }

  isResponsableValido(responsable: any): boolean {
    if (typeof responsable !== 'object' || !responsable) return false;
    return Object.values(responsable).some((r: any) => r?.nombre && typeof r.nombre === 'string' && r.nombre.trim() !== '');
  }

  responsablesTexto(evento: ActividadesVista): string {
    if (!this.isResponsableValido(evento.persona_responsable)) return '';
    return Object.values(evento.persona_responsable)
      .filter((r: PersonaResponsable) => r?.nombre)
      .map((r: PersonaResponsable) => r.nombre)
      .join(' ');
  }

  private readonly aperturaAsistenciaMin = 20;

  puedeAsistir(evento: ActividadesVista): boolean {
    const abierto = ['P', 'R', 'programado', 'programada', 'reprogramado', 'reprogramada'];
    if (!abierto.includes(evento.estado.trim().toLowerCase())) return false;
    if (this.esPasado(evento.fecha_programada)) return false;
    if (!evento.horario_programado) return true;
    const inicio = new Date(`${evento.fecha_programada.slice(0, 10)}T${evento.horario_programado.slice(0, 5)}`);
    return Date.now() >= inicio.getTime() + this.aperturaAsistenciaMin * 60000;
  }

  asistencia(id: number): void {
    this.router.navigate(['asistencia', id]);
  }

  // ================= UTILIDADES =================

  private relativo(fecha: string): string {
    const clave = fecha.slice(0, 10);
    if (clave === this.hoy) return 'Hoy';
    const manana = this.fechaLocal(new Date(Date.now() + 86400000));
    if (clave === manana) return 'Mañana';
    const ayer = this.fechaLocal(new Date(Date.now() - 86400000));
    if (clave === ayer) return 'Ayer';
    return '';
  }

  private fechaLocal(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}