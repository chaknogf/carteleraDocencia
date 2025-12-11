import { mes } from './../interface/enum';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { ActividadesVista } from '../interface/interfaces';
import { ApiService } from '../service/api.service';
import { FechaLargaPipe, HorarioFormatPipe } from '../pipe/fechas.pipe';
import { EnumActividadPipe, EnumEstadoPipe, EnumMesPipe, EnumModalidadPipe } from '../pipe/tuberias.pipe';
import { HydrationFeatureKind } from '@angular/platform-browser';
import { NavbarClienteComponent } from "../navs/navbarCliente/navbarCliente.component";


@Component({
  selector: 'app-cartel',
  templateUrl: './cartel.component.html',
  styleUrls: ['./cartel.component.css'],
  standalone: true,
  imports: [CommonModule, EnumMesPipe, NavbarClienteComponent, HorarioFormatPipe]
})



export class CartelComponent {

  public eventos: ActividadesVista[] = [];
  public mes: number = 0;
  public anio: number = 0;
  public hoy: string = '';
  public inicioEvento: boolean = false;
  public mesActual = new Date().getMonth() + 1

  constructor(
    private router: Router,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.fechaActual();
    this.hoy = new Date().toISOString().split('T')[0];
    this.datosCartel();

    // console.log(this.eventos);
  }


  async datosCartel() {
    try {
      this.eventos = await this.api.getActividades({ mes: this.mesActual });
      // console.log(this.eventos)
    } catch (error) {
      console.error('❌ Error al obtener actividades:', error);
      throw error;
    }
  }

  isResponsableValido(responsable: any): boolean {
    if (typeof responsable !== 'object' || !responsable) return false;

    return Object.values(responsable).some((r: any) =>
      r?.nombre && typeof r.nombre === 'string' && r.nombre.trim() !== ''
    );
  }

  fechaActual() {
    const fecha = new Date();
    const dia = fecha.getDate();
    const mesActual = fecha.getMonth() + 1; // Los meses son 0-indexed
    const anio = fecha.getFullYear();

    this.mes = mesActual;
    this.anio = anio;

    return `${dia} de ${mes[mesActual]} de ${anio}`;

  }

  asistencia(id: number) {
    this.router.navigate(['asistencia', id]);
  }

  verificarInicioEvento(fecha_programada: string, horario_programado: string): void {
    // Unir fecha y hora en un solo objeto Date
    const inicioEvento = new Date(`${fecha_programada}T${horario_programado}`);

    if (isNaN(inicioEvento.getTime())) {
      console.warn("Fecha u hora inválida:", fecha_programada, horario_programado);
      this.inicioEvento = false;
      return;
    }

    // Duración del evento: 2 horas
    const finEvento = new Date(inicioEvento.getTime() + 2 * 60 * 60 * 1000);

    const ahora = new Date();

    // Activar botón solo si estamos dentro de la ventana del evento
    this.inicioEvento = ahora >= inicioEvento && ahora <= finEvento;
  }



}
