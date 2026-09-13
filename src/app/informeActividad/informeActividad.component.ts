import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { NavbarComponent } from '../navs/navbar/navbar.component';
import { ActividadesVista, Asistencia, ServicioResponsables } from '../interface/interfaces';
import { IconService } from '../service/icon.service';
import { SafeHtml } from '@angular/platform-browser';

interface Firmante {
  nombre: string;
  puesto: string;
}

@Component({
  selector: 'app-informeActividad',
  templateUrl: './informeActividad.component.html',
  styleUrls: ['./informeActividad.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent],
})
export class InformeActividadComponent implements OnInit {
  actividad: ActividadesVista = {
    id: 0,
    tema: '',
    actividad: '',
    actividad_id: 0,
    descripcion_actividad: '',
    subdireccion: '',
    subdireccion_id: 0,
    servicio_encargado: '',
    servicio_id: 0,
    persona_responsable: {},
    tiempo_aproximado: '',
    fecha_programada: '',
    horario_programado: '',
    lugar_id: 0,
    lugar: '',
    mes: '',
    mes_id: 0,
    anio: 0,
    modalidad: '',
    modalidad_id: 0,
    estado: '',
    estado_id: 0,
    detalles: {} as any,
    metadatos: {} as any,
  };

  firmanteServicio: Firmante = { nombre: '', puesto: '' };
  firmanteJefatura: Firmante = { nombre: '', puesto: '' };
  servicioNombre = '';
  subdireccionNombre = '';
  totalAsistentes = 0;

  cargando = true;
  errorCarga = false;
  fechaEmision = '';
  private idActividad = 0;

  icons: { [key: string]: any } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private iconService: IconService,
  ) {
    this.icons = { print: this.iconService.getIcon('printicon') };
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      this.errorCarga = true;
      this.cargando = false;
      return;
    }
    const id = Number(idParam);
    if (isNaN(id) || id <= 0) {
      this.errorCarga = true;
      this.cargando = false;
      return;
    }

    this.idActividad = id;
    this.setFechaEmision();
    this.cargarDatos(id);
  }

  reintentar(): void {
    this.errorCarga = false;
    this.cargando = true;
    this.setFechaEmision();
    this.cargarDatos(this.idActividad);
  }

  private setFechaEmision(): void {
    this.fechaEmision = new Date().toISOString();
  }

  private async cargarDatos(id: number): Promise<void> {
    try {
      const data = await this.api.getActividades({ id });
      const actividades = Array.isArray(data) ? data : (data as any).actividades;
      if (!actividades || actividades.length === 0) {
        throw new Error('No se encontró la actividad');
      }
      this.actividad = actividades[0];
      this.actividad.detalles = this.actividad.detalles || {};
      this.actividad.metadatos = this.actividad.metadatos || {};
      this.servicioNombre = this.actividad.servicio_encargado || '';
      this.subdireccionNombre = this.actividad.subdireccion || '';

      if (this.actividad.metadatos?.registro) {
        this.fechaEmision = this.actividad.metadatos.registro;
      }

      await this.cargarFirmantes();
      await this.cargarAsistentes(id);
      this.cargando = false;
    } catch (error) {
      console.error('❌ Error al cargar informe:', error);
      this.errorCarga = true;
      this.cargando = false;
    }
  }

  private async cargarFirmantes(): Promise<void> {
    if (!this.actividad.servicio_id) return;
    try {
      const data = (await this.api.getServiciosResponsables({
        id: this.actividad.servicio_id,
      })) as ServicioResponsables[];
      const servicio = Array.isArray(data) ? data[0] : undefined;
      if (servicio) {
        this.firmanteServicio.nombre = servicio.encargado_servicio || '';
        this.firmanteServicio.puesto = servicio.puesto_funcional || defaultPuesto();
        this.firmanteJefatura.nombre = servicio.subdireccion?.persona_encargada || '';
        this.firmanteJefatura.puesto = servicio.subdireccion?.nombre
          ? `Jefe de ${servicio.subdireccion.nombre}`
          : 'Jefe de Subdirección';
      }
    } catch (error) {
      console.error('❌ Error al cargar firmantes:', error);
    }
  }

  get det(): any {
    return this.actividad.detalles || {};
  }

  get meta(): any {
    return this.actividad.metadatos || {};
  }

  private async cargarAsistentes(id: number, limit: number = 800): Promise<void> {
    try {
      const data = (await this.api.listaAsistencia({
        capacitacion: id,
        limit,
      })) as Asistencia[];
      this.totalAsistentes = Array.isArray(data) ? data.length : 0;
    } catch (error) {
      console.error('❌ Error al cargar asistencias:', error);
      this.totalAsistentes = 0;
    }
  }

  get asistentesConteo(): number {
    return this.totalAsistentes > 0 ? this.totalAsistentes : this.det.asistencia || 0;
  }

  responsables(): { nombre: string; puesto: string }[] {
    const map = this.actividad.persona_responsable || {};
    return Object.values(map)
      .map((r) => ({
        nombre: r?.nombre?.trim() || '',
        puesto: r?.puesto?.trim() || '',
      }))
      .filter((r) => r.nombre);
  }

  hayEvaluacion(): boolean {
    const d = this.actividad.detalles || {};
    return !!(d.excelente || d.bueno || d.regular || d.deficiente);
  }

  totalParticipantes(): number {
    const d = this.actividad.detalles || {};
    return this.asistentesConteo + (d.inasistencia || 0);
  }

  print(): void {
    window.print();
  }

  volver(): void {
    this.router.navigate(['tabla']);
  }
}

function defaultPuesto(): string {
  return 'Responsable del Servicio';
}
