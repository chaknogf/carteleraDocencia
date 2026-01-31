
import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MesNombrePipe } from '../pipe/fechas.pipe';
import { Ejecucion, Reportes, ResumenAnual } from '../interface/interfaces';
import { ApiService } from '../service/api.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
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



  public añoActual: number = new Date().getFullYear();
  public mesActual: number = new Date().getMonth() + 1;
  public anioSeleccion: number = this.añoActual;

  // 👇 Evento de salida para emitir el valor
  @Output() anioSeleccionChange = new EventEmitter<number>();
  public buscarMes: number = 0;
  public buscarAnio: number = 0;
  public anio: number = new Date().getFullYear();
  public completado: number = 0;
  public programado: number = 0;
  public porcentajeCompletado: number = 0;
  public actividades: Reportes[] = [];
  public ejecutados: Ejecucion[] = [];
  public direccion: Ejecucion[] = [];
  public subEnfermeria: Ejecucion[] = [];
  public subMedica: Ejecucion[] = [];
  public subTecnica: Ejecucion[] = [];
  public subGerencia: Ejecucion[] = [];
  public subRH: Ejecucion[] = [];
  public descargandoReporte = false;
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
    private router: Router,
    private comunicacionService: ComunicacionService
  ) {

  }

  ngOnInit() {

    this.buscarMes = this.mesActual;
    this.buscarAnio = this.añoActual;
    // this.generarReporte();
    this.obtenerEjecucion();
    this.resumenAnual();



  }


  async obtenerEjecucion() {
    try {
      this.ejecutados = await this.api.getEjecucion({ ejecutado: 0.01 });
      this.direccion = await this.api.getEjecucion({ sub: 1 });
      this.subEnfermeria = await this.api.getEjecucion({ sub: 2 });
      this.subMedica = await this.api.getEjecucion({ sub: 3 });
      this.subTecnica = await this.api.getEjecucion({ sub: 4 });
      this.subGerencia = await this.api.getEjecucion({ sub: 5 });
      this.subRH = await this.api.getEjecucion({ sub: 6 });
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

  cronograma() {
    this.comunicacionService.setAnioSeleccionado(this.anioSeleccion);
    // console.log(this.anioSeleccion)
    this.router.navigate(['/autorizado'])
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

  // descargarReporteTodos() {
  //   const filtros = {
  //     anio: this.buscarAnio,
  //   };
  //   this.api.getExcel(filtros);
  // }

  // Con las mejoras:
  async descargarReporteTodos() {
    if (this.descargandoReporte) return;

    if (!this.buscarAnio) {
      alert('Seleccione un año');
      return;
    }

    this.descargandoReporte = true;

    try {
      const filtros: any = { anio: this.buscarAnio };
      if (this.buscarMes > 0) filtros.mes = this.buscarMes;

      await this.api.getExcel(filtros);
      console.log('✅ Reporte descargado');

    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      this.descargandoReporte = false;
    }
  }

  // array de colores
  coloresBarras: string[] = [
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
}
