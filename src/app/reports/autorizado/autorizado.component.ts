import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { ComunicacionService } from '../../service/comunicacion.service';
import { ServicioResponsables } from '../../interface/interfaces';
import { estado, mes } from '../../interface/enum';
import { NavbarComponent } from "../../navs/navbar/navbar.component";
import { skip } from 'rxjs';

const ICON_IMPRIMIR = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>`;
const ICON_VOLVER = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>`;

// Normaliza el estado que devuelve la API (texto o código) a un código de una letra
const CODIGO_ESTADO: Record<string, string> = {
  P: 'P', PROGRAMADA: 'P', PROGRAMADO: 'P', PLANIFICADA: 'P',
  C: 'C', COMPLETADA: 'C', COMPLETADO: 'C',
  S: 'S', SUSPENDIDA: 'S', SUSPENDIDO: 'S',
  R: 'R', REPROGRAMADA: 'R', REPROGRAMADO: 'R',
  A: 'A', ANULADA: 'A', ANULADO: 'A', CANCELADA: 'A', CANCELADO: 'A'
};

@Component({
  selector: 'app-autorizado',
  templateUrl: './autorizado.component.html',
  styleUrls: ['./autorizado.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent]
})
export class AutorizadoComponent implements OnInit {
  readonly fechaGeneracion = new Date();
  anioSeleccion: number = 0;
  mesSeleccion: number = 0;
  subId: number = 0;
  resumen: any[] = [];
  cargando = true;
  printIcon = ICON_IMPRIMIR;
  volverIcon = ICON_VOLVER;
  meses = mes;
  estados = estado;

  // Overrides de encabezado/firmas
  servicioNombreOverride = '';
  atencionUsuario = '';
  subdireccionNombreOverride = '';
  subdireccionTecnica = '';
  encargadoServicioOverride = '';
  puestoFuncionalOverride = '';
  elaboradoPorNombre = '';
  elaboradoPorCargo = '';
  voBoNombreOverride = '';
  voBoCargoOverride = '';

  servicioR: ServicioResponsables = {
    id: 0,
    nombre: '',
    descripcion: '',
    encargado_servicio: '',
    puesto_funcional: '',
    activo: false,
    subdireccion_id: 0
  };

  constructor(
    private api: ApiService,
    private router: Router,
    private comunicacionService: ComunicacionService
  ) { }

  async ngOnInit() {
    const localServid = Number(localStorage.getItem('servicio_id')) || null;
    const config = this.comunicacionService.getReporteConfig();

    const servicioId = config?.todos ? null : config?.servicioId ?? localServid;
    this.subId = config?.subId ?? 0;
    this.mesSeleccion = config?.mes ?? 0;
    this.anioSeleccion = config?.anio ?? this.comunicacionService.getAnioSeleccionado();

    this.servicioNombreOverride = config?.servicioNombre || '';
    this.atencionUsuario = config?.atencionUsuario || '';
    this.subdireccionNombreOverride = config?.subdireccionNombre || '';
    this.subdireccionTecnica = config?.subdireccionTecnica || '';
    this.encargadoServicioOverride = config?.encargadoServicio || '';
    this.puestoFuncionalOverride = config?.puestoFuncional || '';
    this.elaboradoPorNombre = config?.elaboradoPorNombre || this.elaboradoPorNombre;
    this.elaboradoPorCargo = config?.elaboradoPorCargo || this.elaboradoPorCargo;
    this.voBoNombreOverride = config?.voBoNombre || '';
    this.voBoCargoOverride = config?.voBoCargo || '';

    this.comunicacionService.anioSeleccionado$.pipe(skip(1)).subscribe(anio => {
      this.anioSeleccion = anio;
      this.getDatos(servicioId, anio);
    });

    await this.getDatos(servicioId, this.anioSeleccion);

    if (servicioId) {
      try {
        const data = await this.api.getServiciosResponsables({ id: servicioId });
        if (data?.length) this.servicioR = data[0];
      } catch {
        /* sin datos del servicio */
      }
    }
    this.cargando = false;
  }

  async getDatos(servicioId: number | null, anio: number) {
    try {
      const filtros: any = { anio: anio };
      if (servicioId) filtros.servicioId = servicioId;
      if (this.subId) filtros.subId = this.subId;
      if (this.mesSeleccion > 0) filtros.mes = this.mesSeleccion;
      this.resumen = await this.api.getReporteActividades(filtros);
    } catch (error) {
      console.error('Error al cargar informacion', error);
      this.resumen = [];
    }
  }

  get nombreSubdireccion(): string {
    return this.servicioR.subdireccion?.nombre || '';
  }

  get periodo(): string {
    if (this.mesSeleccion > 0) {
      return `${this.mesLabel(this.mesSeleccion)} ${this.anioSeleccion}`;
    }
    return `Año ${this.anioSeleccion}`;
  }

  get totales() {
    const t = { total: this.resumen.length, programadas: 0, completadas: 0, suspendidas: 0, reprogramadas: 0, anuladas: 0 };
    for (const item of this.resumen) {
      const s = this.estadoCodigo(item?.estado);
      if (s === 'P') t.programadas++;
      else if (s === 'C') t.completadas++;
      else if (s === 'S') t.suspendidas++;
      else if (s === 'R') t.reprogramadas++;
      else if (s === 'A') t.anuladas++;
    }
    return t;
  }

  /**
   * La API (/reporte/vista) devuelve el estado como texto ("Programado", "Completada"...),
   * pero algunos orígenes lo envían como código ("P", "C"...). Se normaliza a un código.
   */
  estadoCodigo(value: any): string {
    const v = String(value ?? '').trim().toUpperCase();
    if (!v) return '';
    if (CODIGO_ESTADO[v]) return CODIGO_ESTADO[v];
    if (v.includes('COMPLET')) return 'C';
    if (v.includes('REPROGRA')) return 'R';
    if (v.includes('SUSPEND')) return 'S';
    if (v.includes('ANULAD') || v.includes('CANCEL')) return 'A';
    if (v.includes('PROGRAM')) return 'P';
    return '';
  }

  mesLabel(value: number): string {
    return this.meses.find(m => m.value === value)?.label || '';
  }

  estadoInfo(value: string): { label: string; css: string } {
    const codigo = this.estadoCodigo(value);
    const e = this.estados.find(s => s.value === codigo);
    const cssMap: Record<string, string> = {
      P: 'est-programada',
      C: 'est-completada',
      S: 'est-suspendida',
      R: 'est-reprogramada',
      A: 'est-anulada'
    };
    return { label: e?.label || value || '—', css: cssMap[codigo] || 'est-default' };
  }

  regresar() {
    this.router.navigate(['/reporte']);
  }

  print() {
    window.print();
  }
}
