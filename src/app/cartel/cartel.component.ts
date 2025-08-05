import { mes } from './../interface/enum';
import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { Actividad } from '../interface/interfaces';
import { ApiService } from '../service/api.service';
import { FechaLargaPipe } from '../pipe/fechas.pipe';
import { EnumActividadPipe, EnumEstadoPipe, EnumMesPipe, EnumModalidadPipe } from '../pipe/tuberias.pipe';
import { HydrationFeatureKind } from '@angular/platform-browser';


@Component({
  selector: 'app-cartel',
  templateUrl: './cartel.component.html',
  styleUrls: ['./cartel.component.css'],
  standalone: true,
  imports: [CommonModule, LoginComponent, FechaLargaPipe, EnumActividadPipe, EnumMesPipe, EnumModalidadPipe, EnumEstadoPipe]
})



export class CartelComponent {

  public eventos: Actividad[] = [];
  public mes: number = 0;
  public anio: number = 0;
  public hoy: string = '';

  constructor(
    private router: Router,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.fechaActual();

    this.hoy = new Date().toISOString().split('T')[0];


    this.api.carteleraDelMes()
      .then((data) => {
        this.eventos = data;


        console.log('✅ Actividades cargadas');
        //console.table(this.eventos);
      })
      .catch((error) => {
        console.error('❌ Error al cargar actividades:', error);
      });
  }

  acceso() {
    this.router.navigate(['tabla']);

  }

  visible = signal(false);

  open() {
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
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





}
