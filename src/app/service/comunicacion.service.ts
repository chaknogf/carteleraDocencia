import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ReporteConfig {
  servicioId: number | null;
  subId: number | null;
  anio: number;
  mes: number | null;
  todos?: boolean;
  servicioNombre?: string;
  atencionUsuario?: string;
  subdireccionNombre?: string;
  subdireccionTecnica?: string;
  encargadoServicio?: string;
  puestoFuncional?: string;
  elaboradoPorNombre?: string;
  elaboradoPorCargo?: string;
  voBoNombre?: string;
  voBoCargo?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {
  private anioSeleccionadoSource = new BehaviorSubject<number>(new Date().getFullYear());
  anioSeleccionado$ = this.anioSeleccionadoSource.asObservable();

  private reporteConfigSource = new BehaviorSubject<ReporteConfig | null>(null);
  reporteConfig$ = this.reporteConfigSource.asObservable();

  setAnioSeleccionado(anio: number) {
    this.anioSeleccionadoSource.next(anio);
  }

  getAnioSeleccionado(): number {
    return this.anioSeleccionadoSource.value;
  }

  setReporteConfig(config: ReporteConfig) {
    this.reporteConfigSource.next(config);
  }

  clearReporteConfig() {
    this.reporteConfigSource.next(null);
  }

  getReporteConfig(): ReporteConfig | null {
    return this.reporteConfigSource.value;
  }
}
