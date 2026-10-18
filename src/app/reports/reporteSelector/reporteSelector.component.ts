import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavbarComponent } from '../../navs/navbar/navbar.component';
import { ApiService } from '../../service/api.service';
import { ComunicacionService } from '../../service/comunicacion.service';
import { Reportes, ServicioResponsables, SubdirecionPertenece } from '../../interface/interfaces';
import { mes } from '../../interface/enum';

@Component({
  selector: 'app-reporte-selector',
  templateUrl: './reporteSelector.component.html',
  styleUrls: ['./reporteSelector.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class ReporteSelectorComponent implements OnInit {
  readonly anioActual = new Date().getFullYear();

  subdirecciones: SubdirecionPertenece[] = [];
  servicios: ServicioResponsables[] = [];
  meses = mes;

  subdireccionId = 0;
  servicioId = 0;
  anioSeleccion = this.anioActual;
  mesSeleccionado = 0;

  reporte: Reportes[] = [];
  buscando = false;
  mensaje = '';
  hayReporte = false;

  modalCronograma = false;
  cronogramaForm = {
    subdireccion: '',
    servicio: '',
    encargadoServicio: '',
    elaboradoPorNombre: 'Mgtr. Ana Cecilia Colón Gaspar',
    elaboradoPorCargo: 'Subdirección Técnica',
    voBoNombre: '',
    voBoCargo: ''
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private comunicacionService: ComunicacionService
  ) {}

  get aniosDisponibles(): number[] {
    const a = this.anioActual;
    return [a + 1, a, a - 1, a - 2, a - 3, a - 4];
  }

  get puedeGenerar(): boolean {
    return this.subdireccionId > 0 && this.servicioId > 0 && this.anioSeleccion > 0;
  }

  ngOnInit() {
    this.cargarSubdirecciones();
  }

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
    this.reporte = [];
    this.mensaje = '';
    this.hayReporte = false;
    if (!this.subdireccionId) return;
    try {
      this.servicios = await this.api.getServiciosResponsables({ sub: this.subdireccionId, activo: true, limit: 100 });
    } catch {
      this.servicios = [];
    }
  }

  nombreServicio(id: number): string {
    return this.servicios.find(s => s.id === id)?.nombre || '';
  }

  private buildFiltros(): any {
    const filtros: any = { anio: this.anioSeleccion, subId: this.subdireccionId, servicioId: this.servicioId };
    if (this.mesSeleccionado > 0) filtros.mes = this.mesSeleccionado;
    return filtros;
  }

  async generar() {
    if (!this.puedeGenerar || this.buscando) return;
    this.buscando = true;
    this.hayReporte = false;
    this.mensaje = '';
    try {
      const data = await this.api.getReporteActividades(this.buildFiltros());
      this.reporte = Array.isArray(data) ? (data as Reportes[]) : [];
      this.hayReporte = true;
      if (this.reporte.length === 0) {
        this.mensaje = 'No se encontraron actividades para los filtros seleccionados.';
      }
    } catch (error: any) {
      this.reporte = [];
      this.hayReporte = true;
      this.mensaje = error?.response?.status === 404
        ? 'No se encontraron actividades para los filtros seleccionados.'
        : 'Ocurrió un error al generar el reporte.';
    } finally {
      this.buscando = false;
    }
  }

  irCronograma() {
    if (!this.puedeGenerar) return;
    const servicio = this.servicios.find(s => s.id === this.servicioId);
    const sub = this.subdirecciones.find(s => s.id === this.subdireccionId);
    this.cronogramaForm = {
      subdireccion: sub?.nombre || '',
      servicio: servicio?.nombre || '',
      encargadoServicio: servicio?.encargado_servicio || '',
      elaboradoPorNombre: 'Mgtr. Ana Cecilia Colón Gaspar',
      elaboradoPorCargo: 'Subdirección Técnica',
      voBoNombre: servicio?.subdireccion?.persona_encargada || sub?.persona_encargada || '',
      voBoCargo: servicio?.subdireccion?.nombre || sub?.nombre || ''
    };
    this.modalCronograma = true;
  }

  cerrarModalCronograma() {
    this.modalCronograma = false;
  }

  confirmarCronograma() {
    this.comunicacionService.setReporteConfig({
      servicioId: this.servicioId,
      subId: this.subdireccionId,
      anio: this.anioSeleccion,
      mes: this.mesSeleccionado > 0 ? this.mesSeleccionado : null,
      subdireccionNombre: this.cronogramaForm.subdireccion,
      servicioNombre: this.cronogramaForm.servicio,
      encargadoServicio: this.cronogramaForm.encargadoServicio,
      elaboradoPorNombre: this.cronogramaForm.elaboradoPorNombre,
      elaboradoPorCargo: this.cronogramaForm.elaboradoPorCargo,
      voBoNombre: this.cronogramaForm.voBoNombre,
      voBoCargo: this.cronogramaForm.voBoCargo
    });
    this.modalCronograma = false;
    this.router.navigate(['/autorizado']);
  }
}