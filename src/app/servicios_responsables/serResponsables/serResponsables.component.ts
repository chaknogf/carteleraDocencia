import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navs/navbar/navbar.component';
import { ServicioResponsables, SubdirecionPertenece } from '../../interface/interfaces';

@Component({
  selector: 'app-serResponsables',
  templateUrl: './serResponsables.component.html',
  styleUrls: ['./serResponsables.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class SerResponsablesComponent implements OnInit {
  public serviciosResponsables: ServicioResponsables[] = [];
  public subListado: SubdirecionPertenece[] = [];
  totalActividades: number = 0;
  paginaActual: number = 0;
  actividadesPorPagina: number = 50;
  mensajeEliminado: boolean = false;
  buscarNombre: string = '';
  buscarSub: number | string = ''
  buscarRol: string = '';
  buscarUsername: string = '';
  buscarEstado: string = '';

  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.obtenerSubdirecciones();
    this.listarServicios();
  }

  async obtenerSubdirecciones() {
    const filtroSub = {
      id: 0,
      nombre: '',
      activo: true,
      skip: 1,
      limit: 10

    }
    try {
      const data = await this.api.getSubdirecciones(filtroSub);
      this.subListado = data;
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }

  async listarServicios() {
    const filtros = {
      id: 0,
      nombre: '',
      sub: this.buscarSub,
      activo: true


    }
    try {
      const data = await this.api.getServiciosResponsables(filtros);
      this.serviciosResponsables = data;

    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }

  // skipPlus() {
  //   const skip = this.paginaActual + 1;
  //   this.paginaActual = skip;
  //   if (this.paginaActual > this.totalActividades) {
  //     this.paginaActual = this.totalActividades;
  //   }
  //   this.listarServicios();
  // }

  // skipMinus() {
  //   const skip = this.paginaActual - 1;
  //   this.paginaActual = skip;
  //   if (this.paginaActual < 0) {
  //     this.paginaActual = 0;
  //   }
  //   this.listarServicios();
  // }

  // cambiarPagina(direccion: number) {
  //   this.paginaActual += direccion;
  //   this.listarServicios();
  // }
  editar(value: number) {
    this.router.navigate(['modificarSer/', value]);

  }
  // eliminarUsuario(id: number) {
  //   // Lógica para eliminar la docencia
  //   this.api.deleteUser(id).then(() => {
  //     this.listarServicios();
  //     console.log(' eliminado correctamente');
  //     this.mensajeEliminado = true;
  //     setTimeout(() => {
  //       this.mensajeEliminado = false;
  //     }, 3000);
  //   });
  // }

  agregarServicio() {
    // Lógica para agregar una nueva docencia
    this.router.navigate(['addServicio']);
  }

  volver() {
    // Lógica para volver al menú principal
    this.router.navigate(['eventos']);
  }



  limpiarFiltros() {
    this.buscarNombre = '';
    this.buscarRol = '';
    this.buscarSub = '';

    this.listarServicios();
  }


  visible = signal(false);

  open() {
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
  }





}
