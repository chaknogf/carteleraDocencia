import { Reportes } from './../interface/interfaces';
import { estado } from './../interface/enum';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ActividadesVista, Currentuser } from '../interface/interfaces';
import { ApiService } from '../service/api.service';
import { FormsModule } from '@angular/forms';
import { Meses, Modalidad, ActividadTipo, Estado, actividad, modalidad, mes } from '../interface/enum';
import { IconService } from '../service/icon.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { filter } from '../shared/icons/icons';
import { NavbarPlusComponent } from '../navs/navbarPlus/navbarPlus.component';
import { HorarioFormatPipe } from '../pipe/fechas.pipe';


@Component({
  selector: 'app-tablaDocencia',
  templateUrl: './tablaDocencia.component.html',
  styleUrls: ['./tablaDocencia.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarPlusComponent, HorarioFormatPipe]
})
export class TablaDocenciaComponent implements OnInit {

  public actividades: ActividadesVista[] = [];
  mensajeEliminado: boolean = false;
  username: string = '';
  roleUser: string = '';
  subId: any = '';
  servicioId: any = 0;
  servicio: string = '';

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

  options: { nombre: string; descripcion: string; ruta: string; icon: string }[] = [];

  private sanitizarSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
  // iconos
  icons: { [key: string]: any } = {};

  filter: SafeHtml = filter;

  constructor(
    private router: Router,
    private api: ApiService,
    private iconService: IconService,
    private sanitizer: DomSanitizer,
  ) {
    this.icons = {
      filter: this.sanitizarSvg(filter),
    }

  }

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    this.roleUser = localStorage.getItem('role') || '';
    this.subId = Number(localStorage.getItem('subId') || '');
    this.servicioId = Number(localStorage.getItem('servicio_id'));
    // console.log('Rol del usuario:', this.roleUser);
    // console.log('ID del servicio del usuario:', this.servicioId);
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
      entrega: "",
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

  asistencias(id: number) {
    this.router.navigate(['asistencias', id])
  }

  registrarAsistencia(id: number) {
    this.router.navigate(['asistencia', id]);
  }

}
