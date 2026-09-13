import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Ejecucion, Reportes, ResumenAnual, ServicioResponsables, SubdirecionPertenece } from '../interface/interfaces';
import { estado, mes } from '../interface/enum';
import { ApiService } from '../service/api.service';
import { NavbarComponent } from "../navs/navbar/navbar.component";
import { ComunicacionService } from '../service/comunicacion.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule]
})
export class DashboardComponent implements OnInit {

  readonly anioActual = new Date().getFullYear();
  readonly fechaHoy = new Date();
  meses = mes;
  estados = estado;

  // ===== Generador de reporte (/reporte/vista) =====
  subdirecciones: SubdirecionPertenece[] = [];
  servicios: ServicioResponsables[] = [];
  subdireccionId = 0;
  servicioId = 0;
  anioSeleccion = this.anioActual;
  mesSeleccionado = 0;
  reporteTodos = false;

  reporte: Reportes[] = [];
  generando = false;
  descargando = false;
  reporteGenerado = false;
  mensajeReporte = '';

  // ===== Analítica =====
  anioAnalitica = this.anioActual;
  subAnalitica = 0;
  servicioAnalitica = 0;
  ejecutados: Ejecucion[] = [];
  resumen: ResumenAnual = { anio: 0, programadas: 0, reprogramadas: 0, completadas: 0, anuladas: 0, total: 0 };
  cargandoAnalitica = false;

  get aniosDisponibles(): number[] {
    const a = this.anioActual;
    return [a, a - 1, a - 2, a - 3, a - 4];
  }

  get puedeReporte(): boolean {
    return this.reporteTodos || (this.subdireccionId > 0 && this.servicioId > 0);
  }

  get totalProgramadas(): number {
    return this.ejecutados.reduce((s, e) => s + (e.programada || 0), 0);
  }
  get totalCompletadas(): number {
    return this.ejecutados.reduce((s, e) => s + (e.completa || 0), 0);
  }
  get totalReprogramadas(): number {
    return this.ejecutados.reduce((s, e) => s + (e.reprogramada || 0), 0);
  }
  get totalSuspendidas(): number {
    return this.ejecutados.reduce((s, e) => s + (e.suspendida || 0), 0);
  }
  get totalActividades(): number {
    return this.ejecutados.reduce((s, e) => s + (e.total || 0), 0);
  }

  readonly coloresBarras: string[] = [
    'linear-gradient(90deg,#8b5cf6,#6366f1)',
    'linear-gradient(90deg,#06b6d4,#3b82f6)',
    'linear-gradient(90deg,#10b981,#34d399)',
    'linear-gradient(90deg,#f59e0b,#fbbf24)',
    'linear-gradient(90deg,#ef4444,#f87171)',
    'linear-gradient(90deg,#ec4899,#f472b6)',
    'linear-gradient(90deg,#14b8a6,#2dd4bf)',
    'linear-gradient(90deg,#8b5cf6,#d946ef)',
    'linear-gradient(90deg,#f43f5e,#fb7185)',
    'linear-gradient(90deg,#0ea5e9,#38bdf8)',
    'linear-gradient(90deg,#10b981,#059669)',
    'linear-gradient(90deg,#f59e0b,#ef4444)',
    'linear-gradient(90deg,#6366f1,#8b5cf6)',
    'linear-gradient(90deg,#06b6d4,#0891b2)',
    'linear-gradient(90deg,#f472b6,#ec4899)',
    'linear-gradient(90deg,#84cc16,#a3e635)',
    'linear-gradient(90deg,#22d3ee,#06b6d4)',
    'linear-gradient(90deg,#eab308,#facc15)',
    'linear-gradient(90deg,#a855f7,#d946ef)',
    'linear-gradient(90deg,#f97316,#fb923c)'
  ];

  constructor(
    private api: ApiService,
    private router: Router,
    private comunicacionService: ComunicacionService
  ) {}

  ngOnInit() {
    this.cargarSubdirecciones();
    this.cargarAnalitica();
  }

  // ===================== GENERADOR DE REPORTE =====================

  async cargarSubdirecciones() {
    try {
      this.subdirecciones = await this.api.getSubdirecciones({ activo: true, limit: 30 });
    } catch {
      this.subdirecciones = [];
    }
  }

  async onSubdireccionChange() {
    this.servicios = [];
    this.servicioId = 0;
    this.limpiarResultado();
    if (!this.subdireccionId) return;
    try {
      this.servicios = await this.api.getServiciosResponsables({ sub: this.subdireccionId, activo: true, limit: 100 });
      if (this.servicios.length === 1) {
        this.servicioId = this.servicios[0].id;
      }
    } catch {
      this.servicios = [];
    }
  }

  seleccionarModoReporte(todos: boolean): void {
    if (this.reporteTodos === todos) return;
    this.reporteTodos = todos;
    this.limpiarResultado();
  }

  private limpiarResultado(): void {
    this.reporte = [];
    this.reporteGenerado = false;
    this.mensajeReporte = '';
  }

  private buildFiltrosReporte(): any {
    const filtros: any = { anio: this.anioSeleccion };
    if (this.mesSeleccionado > 0) filtros.mes = this.mesSeleccionado;
    if (!this.reporteTodos) {
      filtros.subId = this.subdireccionId;
      filtros.servicioId = this.servicioId;
    }
    return filtros;
  }

  async generarReporte() {
    if (!this.puedeReporte || this.generando) return;
    this.generando = true;
    this.reporteGenerado = false;
    this.mensajeReporte = '';
    try {
      const data = await this.api.getReporteActividades(this.buildFiltrosReporte());
      this.reporte = Array.isArray(data) ? (data as Reportes[]) : [];
      this.reporteGenerado = true;
      if (this.reporte.length === 0) {
        this.mensajeReporte = 'No se encontraron actividades para los filtros seleccionados.';
      }
    } catch (error: any) {
      this.reporte = [];
      this.reporteGenerado = true;
      this.mensajeReporte = error?.response?.status === 404
        ? 'No se encontraron actividades para los filtros seleccionados.'
        : 'Ocurrió un error al generar el reporte.';
    } finally {
      this.generando = false;
    }
  }

  irCronograma() {
    if (this.reporteTodos) {
      this.comunicacionService.setReporteConfig({
        servicioId: null,
        subId: null,
        anio: this.anioSeleccion,
        mes: this.mesSeleccionado > 0 ? this.mesSeleccionado : null,
        todos: true
      });
    } else if (this.puedeReporte) {
      this.comunicacionService.setReporteConfig({
        servicioId: this.servicioId,
        subId: this.subdireccionId,
        anio: this.anioSeleccion,
        mes: this.mesSeleccionado > 0 ? this.mesSeleccionado : null
      });
    } else {
      this.comunicacionService.clearReporteConfig();
      this.comunicacionService.setAnioSeleccionado(this.anioSeleccion);
    }
    this.router.navigate(['/autorizado']);
  }

  async descargarExcel() {
    if (this.descargando || !this.puedeReporte) return;
    this.descargando = true;
    try {
      const filtros: any = { anio: this.anioSeleccion };
      if (this.mesSeleccionado > 0) filtros.mes = this.mesSeleccionado;
      if (!this.reporteTodos) {
        filtros.subdireccion_id = this.subdireccionId;
        filtros.servicio_id = this.servicioId;
      }
      await this.api.getExcel(filtros);
    } catch (error: any) {
      if (error?.response?.status === 404) {
        alert('No hay datos para generar el reporte');
      } else {
        alert('Error al descargar el reporte');
      }
    } finally {
      this.descargando = false;
    }
  }

  // ===================== ANALÍTICA =====================

  async cargarAnalitica() {
    this.cargandoAnalitica = true;
    await Promise.all([
      this.cargarEjecucion(),
      this.cargarResumen()
    ]);
    this.cargandoAnalitica = false;
  }

  async cargarEjecucion() {
    try {
      const filtros: any = { anio: this.anioAnalitica };
      if (this.subAnalitica > 0) filtros.sub = this.subAnalitica;
      if (this.servicioAnalitica > 0) filtros.servicio_id = this.servicioAnalitica;
      const data = await this.api.getEjecucion(filtros);
      this.ejecutados = Array.isArray(data) ? data : [];
    } catch {
      this.ejecutados = [];
    }
  }

  async cargarResumen() {
    try {
      const data = await this.api.getResumenAnual({ anio: this.anioAnalitica });
      this.resumen = data?.[0] || this.resumen;
    } catch {
      this.resumen = { anio: 0, programadas: 0, reprogramadas: 0, completadas: 0, anuladas: 0, total: 0 };
    }
  }

  // ===================== HELPERS =====================

  nombreSubdireccion(id: number): string {
    return this.subdirecciones.find(s => s.id === id)?.nombre || '';
  }

  nombreServicio(id: number): string {
    return this.servicios.find(s => s.id === id)?.nombre || '';
  }

  mesLabel(value: number): string {
    return this.meses.find(m => m.value === value)?.label || '';
  }

  estadoInfo(value: string): { label: string; css: string } {
    const e = this.estados.find(s => s.value === value);
    const label = e?.label || value || '—';
    const cssMap: Record<string, string> = {
      P: 'badge-programada',
      C: 'badge-completada',
      S: 'badge-suspendida',
      R: 'badge-reprogramada'
    };
    return { label, css: cssMap[value] || 'badge-default' };
  }

  ejecucionPorcentaje(data: Ejecucion): number {
    const pct = (data.ejecutado ?? 0) * 100;
    return Math.min(pct, 100);
  }
}