import { Reportes } from './../interface/interfaces';
import { estado } from './../interface/enum';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Actividad, Currentuser } from '../interface/interfaces';
import { ApiService } from '../service/api.service';
import { EnumActividadPipe, EnumEstadoPipe, EnumMesPipe, EnumModalidadPipe } from "../pipe/tuberias.pipe";
import { FechaLargaPipe } from '../pipe/fechas.pipe';
import { FormsModule } from '@angular/forms';
import { Meses, Modalidad, ActividadTipo, Estado, actividad, modalidad, mes } from '../interface/enum';
import { UsuarioActualComponent } from "../users/usuarioActual/usuarioActual.component";


@Component({
  selector: 'app-tablaDocencia',
  templateUrl: './tablaDocencia.component.html',
  styleUrls: ['./tablaDocencia.component.css'],
  standalone: true,
  imports: [CommonModule, EnumMesPipe, EnumModalidadPipe, EnumEstadoPipe, EnumActividadPipe, FechaLargaPipe, FormsModule, UsuarioActualComponent]
})
export class TablaDocenciaComponent implements OnInit {

  public actividades: Actividad[] = [];
  mensajeEliminado: boolean = false;
  role: string = '';

  meses: Meses[] = []
  modalidades: Modalidad[] = []
  estados: Estado[] = []
  actividadesTipo: ActividadTipo[] = []
  // En la clase `TablaDocenciaComponent`
  totalActividades: number = 0;
  paginaActual: number = 0;
  actividadesPorPagina: number = 10;

  buscarTema: string = '';
  buscarActividad: string = '';
  buscarModalidad: string = '';
  buscarEstado: string = '';
  buscarPersona: string = '';
  buscarMes: string = '';
  buscarFecha: string = '';



  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {

    this.role = localStorage.getItem('role') || '';
    console.log('Rol del usuario:', this.role);
    this.listarActividades();
    this.meses = mes;
    this.modalidades = modalidad
    this.actividadesTipo = actividad
    this.estados = estado


  }



  async listarActividades() {
    const filtros = {
      id: 0,
      tema: this.buscarTema,
      actividad: this.buscarActividad,
      service_encargado: "",
      persona: this.buscarPersona,
      fecha: this.buscarFecha,
      mes: this.buscarMes,
      modalidad: this.buscarModalidad,
      estado: this.buscarEstado,
      engtrega: "",
      skip: this.paginaActual,
      limit: 10

    }

    try {
      const actividades = await this.api.getActividades(filtros);
      this.actividades = actividades;
      this.totalActividades = actividades.length;
    } catch (error) {
      console.error('Error al obtener actividades:', error);
    }
    this.close();
  }

  skipPlus() {
    const skip = this.paginaActual + 1;
    this.paginaActual = skip;
    if (this.paginaActual > this.totalActividades) {
      this.paginaActual = this.totalActividades;
    }
    this.listarActividades();
  }

  skipMinus() {
    const skip = this.paginaActual - 1;
    this.paginaActual = skip;
    if (this.paginaActual < 0) {
      this.paginaActual = 0;
    }
    this.listarActividades();
  }
  cambiarPagina(direccion: number) {
    this.paginaActual += direccion;
    this.listarActividades();
  }
  editarDocencia(docencia: any) {
    this.router.navigate(['editarActividad', docencia.id]);
  }

  eliminarDocencia(id: number) {
    // Lógica para eliminar la docencia
    this.api.deleteActividad(id).then(() => {
      this.listarActividades();
      console.log('Actividad eliminada correctamente');
      this.mensajeEliminado = true;
      setTimeout(() => {
        this.mensajeEliminado = false;
      }, 3000);
    });
  }

  agregarDocencia() {
    // Lógica para agregar una nueva docencia
    this.router.navigate(['formulario']);
  }

  volver() {
    // this.api.logOut();
    this.router.navigate(['eventos']);
  }

  isResponsableValido(responsable: any): boolean {
    if (typeof responsable !== 'object' || !responsable) return false;

    return Object.values(responsable).some((r: any) =>
      r?.nombre && typeof r.nombre === 'string' && r.nombre.trim() !== ''
    );
  }

  limpiarFiltros() {
    this.buscarTema = '';
    this.buscarActividad = '';
    this.buscarModalidad = '';
    this.buscarEstado = '';
    this.buscarPersona = '';
    this.buscarMes = '';
    this.buscarFecha = '';
    this.listarActividades();
  }

  visible = signal(false);

  open() {
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
  }

  filtrar() {
    console.log('Filtrando actividades...');

  }

  usuarios() {
    this.router.navigate(['tablaUsers']);
  }

  reporte() {
    this.router.navigate(['reporteActividades']);
  }

}
