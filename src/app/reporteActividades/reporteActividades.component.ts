import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MesNombrePipe } from '../pipe/fechas.pipe';
import { Ejecucion, EServicios, Reportes } from '../interface/interfaces';
import { ApiService } from '../service/api.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

import {
  ChartComponent,
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexYAxis,
  ApexFill,
  ApexTooltip,
  ApexMarkers,
  ApexPlotOptions
} from 'ng-apexcharts';
import { NavbarComponent } from "../navbar/navbar.component";

export type ChartOptions = {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  yaxis?: ApexYAxis | ApexYAxis[];
  labels?: string[];
  stroke?: any;
  markers?: ApexMarkers;
  plotOptions?: ApexPlotOptions;
  fill?: ApexFill;
  tooltip?: ApexTooltip;
  colors?: string[];
  dataLabels?: any;
  title?: any;
  responsive?: any;
};

@Component({
  selector: 'app-reporteActividades',
  templateUrl: './reporteActividades.component.html',
  styleUrls: ['./reporteActividades.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule, MesNombrePipe, NgApexchartsModule, ChartComponent,
    NgApexchartsModule,
    NgApexchartsModule, NavbarComponent]
})
export class ReporteActividadesComponent implements OnInit {

  public actividades: Reportes[] = [];
  public actividadesEjecucion: Ejecucion[] = [];
  public servicios: EServicios[] = [];

  public añoActual: number = new Date().getFullYear();
  public mesActual: number = new Date().getMonth() + 1;

  public buscarMes: number = 0;
  public buscarAnio: number = 0;
  public anio: number = new Date().getFullYear();
  public completado: number = 0;
  public programado: number = 0;
  public porcentajeCompletado: number = 0;
  public chartSeries: ApexAxisChartSeries = [];

  public chartOptions: Partial<ChartOptions> = {};



  constructor(
    private api: ApiService,
    private router: Router
  ) {
    this.chartOptions = {
      series: this.chartSeries,
      chart: {
        type: 'line',
        width: '1000',

      },
      stroke: {
        width: [2, 2],
        curve: 'smooth'
      },
      xaxis: {
        categories: []
      },
      yaxis: {
        title: {
          text: 'Porcentaje'
        }
      },
      tooltip: {
        shared: true,
        intersect: false
      },
      plotOptions: {
        bar: {
          horizontal: false,
        }
      },
      fill: {
        opacity: 1
      },
      dataLabels: {
        enabled: true
      }
    };
  }

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

      interface EjecucionItem {
        estado: string;
        porcentaje: number;
      }

      const completado: EjecucionItem | undefined = (data as EjecucionItem[]).find((item: EjecucionItem) => item.estado === 'C');
      this.porcentajeCompletado = completado ? completado.porcentaje : 0;

      console.log('✅ Porcentaje completado:', this.porcentajeCompletado);
    } catch (error) {
      console.error('❌ Error al cargar ejecución:', error);
    }
  }

  async obtenerServicios() {
    try {
      const data = await this.api.getEjecucionServicios(this.anio);
      this.servicios = data;
      console.table(this.servicios);

      const categorias = this.servicios.map(s => s.servicio_encargado);
      const porcentajes = this.servicios.map(s => Number(s.porcentaje));
      const total = this.servicios.map(s => Number(s.total));
      const completados = this.servicios.map(s => Number(s.completado));
      const reprogramados = this.servicios.map(s => Number(s.reprogramado));
      const anulados = this.servicios.map(s => Number(s.anulado));

      // 🔧 Asigna los datos a chartSeries
      this.chartSeries = [

        {
          name: "Completados",
          type: "column",
          data: completados
        },
        {
          name: "Total",
          type: "area",
          data: total
        },
      ];

      // 🔧 Actualiza las categorías del eje X
      this.chartOptions.xaxis = {
        categories: categorias
      };

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
