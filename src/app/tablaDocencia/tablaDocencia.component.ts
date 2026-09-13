import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadesVista } from '../interface/interfaces';
import { ApiService } from '../service/api.service';
import { ActividadesService } from '../service/actividades.service';
import { FormsModule } from '@angular/forms';
import { mes, Meses } from '../interface/enum';
import { NavbarPlusComponent } from '../navs/navbarPlus/navbarPlus.component';
import { HorarioFormatPipe } from '../pipe/fechas.pipe';

@Component({
  selector: 'app-tablaDocencia',
  templateUrl: './tablaDocencia.component.html',
  styleUrls: ['./tablaDocencia.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarPlusComponent, HorarioFormatPipe],
})
export class TablaDocenciaComponent implements OnInit {
  public actividades: ActividadesVista[] = [];
  mensajeEliminado = false;

  roleUser = '';
  servicioId = 0;

  // Catálogos de filtros (valores reales de la vista)
  meses: Meses[] = mes;
  modalidadesFiltro = ['Presencial', 'Virtual', 'Híbrida'];
  estadosFiltro = ['Programado', 'Reprogramada', 'Completada'];
  actividadesFiltro = ['Capacitación', 'Charla', 'webinar'];

  // Filtros
  buscarTema = '';
  buscarPersona = '';
  buscarActividad = '';
  buscarModalidad = '';
  buscarEstado = '';
  buscarMes = 0;
  buscarFechaDesde = '';
  buscarFechaHasta = '';

  // Paginación
  totalActividades = 0;
  paginaActual = 0;
  actividadesPorPagina = 10;
  opcionesPorPagina = [10, 25, 50];

  // UI
  cargando = false;
  errorAlCargar = false;
  confirmarVisible = false;
  errorConfirmacion = false;
  textoConfirmacion = '';
  actividadAEliminarId: number | null = null;
  filtrosAbiertos = false;

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private api: ApiService,
    private actividadesService: ActividadesService,
  ) {}

  ngOnInit() {
    this.roleUser = localStorage.getItem('role') || '';
    this.servicioId = Number(localStorage.getItem('servicio_id') || 0);
    this.filtrosAbiertos = !window.matchMedia('(max-width: 768px)').matches;
    this.listarActividades();
  }

  // ================= CARGA DE DATOS =================

  async listarActividades() {
    this.cargando = true;
    this.errorAlCargar = false;

    const filtros: any = {
      tema: this.buscarTema,
      persona: this.buscarPersona,
      actividad: this.buscarActividad,
      modalidad: this.buscarModalidad,
      estado: this.buscarEstado,
      mes: this.buscarMes,
      fecha_desde: this.buscarFechaDesde,
      fecha_hasta: this.buscarFechaHasta,
      skip: this.paginaActual * this.actividadesPorPagina,
      limit: this.actividadesPorPagina,
    };

    if (this.roleUser !== 'admin' && this.servicioId) {
      filtros.servicio_encargado = this.servicioId;
    }

    try {
      const data = await this.actividadesService.listar(filtros);
      if (Array.isArray(data)) {
        this.totalActividades = data.length;
        this.actividades = data.slice(
          this.paginaActual * this.actividadesPorPagina,
          (this.paginaActual + 1) * this.actividadesPorPagina,
        );
      } else {
        this.actividades = data.actividades ?? [];
        this.totalActividades = data.total ?? 0;
        const max = this.maxPagina;
        if (this.paginaActual > max) this.paginaActual = max > 0 ? max : 0;
      }
    } catch (error) {
      console.error('Error al obtener actividades:', error);
      this.errorAlCargar = true;
    } finally {
      this.cargando = false;
    }
  }

  // ================= FILTROS =================

  onBuscar() {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.paginaActual = 0;
      this.listarActividades();
    }, 350);
  }

  cambiarFiltro() {
    this.paginaActual = 0;
    this.listarActividades();
  }

  get hayFiltros(): boolean {
    return !!(
      this.buscarTema.trim() ||
      this.buscarPersona.trim() ||
      this.buscarActividad ||
      this.buscarModalidad ||
      this.buscarEstado ||
      this.buscarMes ||
      this.buscarFechaDesde ||
      this.buscarFechaHasta
    );
  }

  get numeroFiltrosActivos(): number {
    return [
      this.buscarTema.trim(),
      this.buscarPersona.trim(),
      this.buscarActividad,
      this.buscarModalidad,
      this.buscarEstado,
      this.buscarMes,
      this.buscarFechaDesde,
      this.buscarFechaHasta,
    ].filter((v) => !!v).length;
  }

  toggleFiltros() {
    this.filtrosAbiertos = !this.filtrosAbiertos;
  }

  limpiarFiltros() {
    this.buscarTema = '';
    this.buscarPersona = '';
    this.buscarActividad = '';
    this.buscarModalidad = '';
    this.buscarEstado = '';
    this.buscarMes = 0;
    this.buscarFechaDesde = '';
    this.buscarFechaHasta = '';
    this.paginaActual = 0;
    this.listarActividades();
  }

  // ================= PAGINACIÓN =================

  get maxPagina(): number {
    return Math.max(0, Math.ceil(this.totalActividades / this.actividadesPorPagina) - 1);
  }

  get desdeRegistro(): number {
    return this.totalActividades === 0 ? 0 : this.paginaActual * this.actividadesPorPagina + 1;
  }

  get hastaRegistro(): number {
    return Math.min((this.paginaActual + 1) * this.actividadesPorPagina, this.totalActividades);
  }

  get paginasVisibles(): (number | string)[] {
    const total = this.maxPagina;
    const actual = this.paginaActual;
    const paginas = new Set<number>([0, total]);

    for (let p = actual - 1; p <= actual + 1; p++) {
      if (p >= 0 && p <= total) paginas.add(p);
    }

    const lista: (number | string)[] = [];
    let previo: number | null = null;
    for (const p of [...paginas].sort((a, b) => a - b)) {
      if (previo !== null && p - previo > 1) lista.push('…');
      lista.push(p);
      previo = p;
    }
    return lista;
  }

  irPagina(pagina: number) {
    if (pagina < 0 || pagina > this.maxPagina || pagina === this.paginaActual) return;
    this.paginaActual = pagina;
    this.listarActividades();
  }

  skipPlus() {
    this.irPagina(this.paginaActual + 1);
  }

  skipMinus() {
    this.irPagina(this.paginaActual - 1);
  }

  cambiarPorPagina() {
    this.paginaActual = 0;
    this.listarActividades();
  }

  // ================= ACCIONES POR FILA =================

  puedeGestionar(docencia: ActividadesVista): boolean {
    return this.roleUser === 'admin' || docencia.servicio_id === this.servicioId;
  }

  editarDocencia(docencia: ActividadesVista) {
    this.router.navigate(['editarActividad', docencia.id]);
  }

  asistencias(id: number) {
    this.router.navigate(['asistencias', id]);
  }

  informe(id: number) {
    this.router.navigate(['informeActividad', id]);
  }

  registrarAsistencia(id: number) {
    this.router.navigate(['asistencia', id]);
  }

  solicitarEliminar(docencia: ActividadesVista) {
    this.actividadAEliminarId = docencia.id;
    this.textoConfirmacion = '';
    this.errorConfirmacion = false;
    this.confirmarVisible = true;
  }

  cerrarConfirmar() {
    this.confirmarVisible = false;
    this.errorConfirmacion = false;
  }

  async confirmarEliminar() {
    if (this.textoConfirmacion.trim().toLowerCase() !== 'eliminar' || !this.actividadAEliminarId) {
      this.errorConfirmacion = true;
      return;
    }
    try {
      await this.api.deleteActividad(this.actividadAEliminarId);
      this.confirmarVisible = false;
      this.actividadAEliminarId = null;
      this.mensajeEliminado = true;
      setTimeout(() => (this.mensajeEliminado = false), 3000);
      if (this.actividades.length === 1 && this.paginaActual > 0) this.paginaActual--;
      this.listarActividades();
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
    }
  }

  // ================= NAVEGACIÓN =================

  agregarDocencia() {
    this.router.navigate(['formulario']);
  }

  volver() {
    this.router.navigate(['eventos']);
  }

  // ================= HELPERS DE VISTA =================

  isResponsableValido(responsable: any): boolean {
    if (typeof responsable !== 'object' || !responsable) return false;
    return Object.values(responsable).some(
      (r: any) => r?.nombre && typeof r.nombre === 'string' && r.nombre.trim() !== '',
    );
  }

  responsablesLista(docencia: ActividadesVista): string[] {
    if (!this.isResponsableValido(docencia.persona_responsable)) return [];
    return Object.values(docencia.persona_responsable)
      .map((r) => r.nombre)
      .filter(Boolean);
  }

  iniciales(nombre: string): string {
    const partes = nombre.trim().split(/\s+/);
    return ((partes[0]?.charAt(0) || '') + (partes[1]?.charAt(0) || '')).toUpperCase();
  }

  relativoFecha(fecha: string): string {
    const clave = fecha.slice(0, 10);
    const hoy = new Date();
    const hoyStr = this.ymd(hoy);
    if (clave === hoyStr) return 'Hoy';
    if (clave === this.ymd(new Date(hoy.getTime() + 86400000))) return 'Mañana';
    if (clave === this.ymd(new Date(hoy.getTime() - 86400000))) return 'Ayer';
    return '';
  }

  mesCorto(fecha: string): string {
    const m = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    return m[Number(fecha.slice(5, 7)) - 1];
  }

  diaNum(fecha: string): string {
    return String(Number(fecha.slice(8, 10)));
  }

  anioNum(fecha: string): string {
    return fecha.slice(0, 4);
  }

  claseEstado(estado: string): string {
    const e = (estado || '').toLowerCase();
    if (e.includes('completa')) return 'est-completada';
    if (e.includes('suspende')) return 'est-suspendida';
    if (e.includes('reprogra')) return 'est-reprogramada';
    return 'est-programado';
  }

  claseModalidad(modalidad: string): string {
    const m = (modalidad || '').toLowerCase();
    if (m.includes('virtual')) return 'mod-virtual';
    if (m.includes('híbrida') || m.includes('hibrida')) return 'mod-hibrida';
    return 'mod-presencial';
  }

  private ymd(d: Date): string {
    return (
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-` +
      `${String(d.getDate()).padStart(2, '0')}`
    );
  }
}