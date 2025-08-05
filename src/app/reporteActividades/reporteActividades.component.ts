import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Ejecucion, EServicios, Reportes } from '../interface/interfaces';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MesNombrePipe } from '../pipe/fechas.pipe';




@Component({
  selector: 'app-reporteActividades',
  templateUrl: './reporteActividades.component.html',
  styleUrls: ['./reporteActividades.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, MesNombrePipe]
})
export class ReporteActividadesComponent implements OnInit {

  public actividades: Reportes[] = [];
  public actividadesEjecucion: Ejecucion[] = [];
  public servicios: EServicios[] = [];
  public añoActual: number = new Date().getFullYear();
  public mesActual: number = new Date().getMonth() + 1; // Los meses
  public buscarMes: number = 0;
  public buscarAnio: number = 0;
  public anio: number = new Date().getFullYear();
  public completado: number = 0;
  public programado: number = 0;
  public porcentajeCompletado: number = 0;




  constructor(
    private api: ApiService,
    private router: Router

  ) { }

  ngOnInit() {
    this.buscarMes = this.mesActual;
    this.buscarAnio = this.añoActual;
    this.generarReporte();
    this.obtenerEjecucion();
    this.obtenerServicios();
  }

  async generarReporte() {
    if (this.buscarMes === 0 || this.buscarAnio === 0) {
      alert('Por favor, seleccione un mes y un año válidos.');
      return;
    }

    try {
      const response = await this.api.getReporteActividades(this.buscarMes, this.buscarAnio);
      this.actividades = response;
      console.log('Actividades obtenidas:', this.actividades);
    } catch (error) {
      console.error('Error al obtener las actividades:', error);
      alert('Error al generar el reporte. Por favor, inténtelo de nuevo más tarde.');
    }
  }

  async obtenerEjecucion() {
    try {
      const data = await this.api.getEjecucion(this.anio);
      console.log('📊 Ejecución:', data);
      this.actividadesEjecucion = data;

      // Obtener el porcentaje de actividades completadas (estado 'C')
      interface EjecucionItem {
        estado: string;
        porcentaje: number;
        // Agrega otras propiedades si existen en los objetos de data
      }

      const completado: EjecucionItem | undefined = (data as EjecucionItem[]).find((item: EjecucionItem) => item.estado === 'C');
      this.porcentajeCompletado = completado ? completado.porcentaje : 0;

      console.log('✅ Porcentaje completado:', this.porcentajeCompletado);
    } catch (error) {
      console.error('❌ Error al cargar ejecución:', error);
    }
  }

  // Método para obtener graficos de servicios|
  async obtenerServicios() {
    try {
      const data = await this.api.getEjecucionServicios(this.anio);
      console.log('📊 Servicios:', data);
      this.servicios = data;
    } catch (error) {
      console.error('❌ Error al cargar servicios:', error);
    }
  }



  volver() {

    this.router.navigate(['/tabla']);
  }

  noImprimir() {
    const noImprimirElements = document.querySelectorAll('.no-imprimir');
    noImprimirElements.forEach(element => {
      element.classList.add('d-none');
    });
  }

}
