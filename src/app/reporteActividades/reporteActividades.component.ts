
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MesNombrePipe } from '../pipe/fechas.pipe';
import { Ejecucion, Reportes, ResumenAnual } from '../interface/interfaces';
import { ApiService } from '../service/api.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NavbarComponent } from "../navbar/navbar.component";



@Component({
  selector: 'app-reporteActividades',
  templateUrl: './reporteActividades.component.html',
  styleUrls: ['./reporteActividades.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule]
})
export class ReporteActividadesComponent implements OnInit {



  public añoActual: number = new Date().getFullYear();
  public mesActual: number = new Date().getMonth() + 1;

  public buscarMes: number = 0;
  public buscarAnio: number = 0;
  public anio: number = new Date().getFullYear();
  public completado: number = 0;
  public programado: number = 0;
  public porcentajeCompletado: number = 0;
  public actividades: Reportes[] = [];
  public actividadesEjecucion: Ejecucion[] = [];
  public direccion: Ejecucion[] = [];
  public subEnfermeria: Ejecucion[] = [];
  public subMedica: Ejecucion[] = [];
  public subTecnica: Ejecucion[] = [];
  public subGerencia: Ejecucion[] = [];
  public subRH: Ejecucion[] = [];
  public resumen: ResumenAnual = {
    anio: 0,
    programadas: 0,
    reprogramadas: 0,
    completadas: 0,
    anuladas: 0,
    total: 0
  }


  constructor(
    private api: ApiService,
    private router: Router
  ) {

  }

  ngOnInit() {
    this.buscarMes = this.mesActual;
    this.buscarAnio = this.añoActual;
    // this.generarReporte();
    this.obtenerEjecucion();
    this.resumenAnual();

  }

  // async generarReporte() {
  //   if (this.buscarMes === 0 || this.buscarAnio === 0) {
  //     alert('Por favor, seleccione un mes y un año válidos.');
  //     return;
  //   }

  //   try {
  //     const response = await this.api.getReporteActividades(this.buscarMes, this.buscarAnio);
  //     this.actividades = response;
  //     console.log('Actividades obtenidas:', this.actividades);
  //   } catch (error) {
  //     console.error('Error al obtener las actividades:', error);
  //     alert('Error al generar el reporte. Por favor, inténtelo de nuevo más tarde.');
  //   }
  // }

  async obtenerEjecucion() {
    try {
      this.direccion = await this.api.getEjecucion(1);
      this.subEnfermeria = await this.api.getEjecucion(2);
      this.subMedica = await this.api.getEjecucion(3);
      this.subTecnica = await this.api.getEjecucion(4);
      this.subGerencia = await this.api.getEjecucion(5);
      this.subRH = await this.api.getEjecucion(6);
      // console.log(this.actividadesEjecucion)
    } catch (error) {
      console.error('❌ Error al cargar ejecución:', error);
    }
  }

  async resumenAnual() {
    try {
      const data = await this.api.getResumenAnual(this.anio);
      this.resumen = data[0];
      // console.log(this.resumen)
    }
    catch (error) {
      console.error('❌ Error al cargar ejecución:', error);
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

  exportarActividadesExcel(): void {
    if (!this.actividades || this.actividades.length === 0) {
      alert('No hay datos para exportar.');
      return;
    }

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.actividades);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Actividades': worksheet },
      SheetNames: ['Actividades']
    };

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    FileSaver.saveAs(blob, `reporte_actividades_${this.buscarMes}_${this.buscarAnio}.xlsx`);
  }
}
