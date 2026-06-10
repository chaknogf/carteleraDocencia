import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Ejecucion, ResumenAnual, SubdirecionPertenece } from '../interface/interfaces';
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

  readonly añoActual = new Date().getFullYear();
  readonly mesActual = new Date().getMonth() + 1;

  anioSeleccion = this.añoActual;
  buscarAnio = this.añoActual;
  buscarMes = 0;
  buscarSubdireccion = 0;

  buscando = false;
  descargando = false;

  ejecutados: Ejecucion[] = [];
  resumen: ResumenAnual = { anio: 0, programadas: 0, reprogramadas: 0, completadas: 0, anuladas: 0, total: 0 };
  subdirecciones: SubdirecionPertenece[] = [];

  get aniosDisponibles(): number[] {
    const a = this.añoActual;
    return [a, a - 1, a - 2, a - 3, a - 4];
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
    'linear-gradient(180deg,#ff8a65,#ff3d00)',
    'linear-gradient(180deg,#ffd166,#ff9f0d)',
    'linear-gradient(180deg,#6be5b1,#07c19a)',
    'linear-gradient(180deg,#7cc0ff,#0088ff)',
    'linear-gradient(180deg,#b39cff,#7a5cff)',
    'linear-gradient(180deg,#ff5fa3,#ff1f7a)',
    'linear-gradient(180deg,#9be7ff,#34c1ff)',
    'linear-gradient(180deg,#84fab0,#8fd3f4)',
    'linear-gradient(180deg,#f6d365,#fda085)',
    'linear-gradient(180deg,#a1c4fd,#c2e9fb)',
    'linear-gradient(180deg,#fccb90,#d57eeb)',
    'linear-gradient(180deg,#f093fb,#f5576c)',
    'linear-gradient(180deg,#43e97b,#38f9d7)',
    'linear-gradient(180deg,#fa709a,#fee140)',
    'linear-gradient(180deg,#30cfd0,#330867)',
    'linear-gradient(180deg,#5ee7df,#b490ca)',
    'linear-gradient(180deg,#a8edea,#fed6e3)',
    'linear-gradient(180deg,#fbc2eb,#a6c1ee)',
    'linear-gradient(180deg,#ffecd2,#fcb69f)',
    'linear-gradient(180deg,#c2e59c,#64b3f4)',
    'linear-gradient(180deg,#ff9a9e,#fad0c4)',
    'linear-gradient(180deg,#a18cd1,#fbc2eb)',
    'linear-gradient(180deg,#fbc2eb,#a6c1ee)',
    'linear-gradient(180deg,#f6d365,#fda085)',
    'linear-gradient(180deg,#84fab0,#8fd3f4)',
    'linear-gradient(180deg,#cfd9df,#e2ebf0)',
    'linear-gradient(180deg,#43e97b,#38f9d7)',
    'linear-gradient(180deg,#fa709a,#fee140)',
    'linear-gradient(180deg,#30cfd0,#330867)',
    'linear-gradient(180deg,#5ee7df,#b490ca)'
  ];

  constructor(
    private api: ApiService,
    private router: Router,
    private comunicacionService: ComunicacionService
  ) {}

  ngOnInit() {
    this.cargarSubdirecciones();
    this.generarReportes();
  }

  async cargarSubdirecciones() {
    try {
      this.subdirecciones = await this.api.getSubdirecciones({ activo: true, limit: 30 });
    } catch {
      this.subdirecciones = [];
    }
  }

  async generarReportes() {
    this.buscando = true;
    await Promise.all([
      this.cargarEjecucion(),
      this.cargarResumen()
    ]);
    this.buscando = false;
  }

  async cargarEjecucion() {
    try {
      const filtros: any = { anio: this.buscarAnio };
      if (this.buscarSubdireccion) filtros.sub = this.buscarSubdireccion;
      const data = await this.api.getEjecucion(filtros);
      this.ejecutados = Array.isArray(data) ? data : [];
    } catch {
      this.ejecutados = [];
    }
  }

  async cargarResumen() {
    try {
      const data = await this.api.getResumenAnual({ anio: this.buscarAnio });
      this.resumen = data?.[0] || this.resumen;
    } catch {
      this.resumen = { anio: 0, programadas: 0, reprogramadas: 0, completadas: 0, anuladas: 0, total: 0 };
    }
  }

  async descargarExcel() {
    if (this.descargando) return;
    this.descargando = true;
    try {
      const filtros: any = { anio: this.buscarAnio };
      if (this.buscarMes > 0) filtros.mes = this.buscarMes;
      if (this.buscarSubdireccion) filtros.subdireccion_id = this.buscarSubdireccion;
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

  cronograma() {
    this.comunicacionService.setAnioSeleccionado(this.anioSeleccion);
    this.router.navigate(['/autorizado']);
  }
}
