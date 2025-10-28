import { Usuarios } from './../../interface/interfaces';
import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navs/navbar/navbar.component';

@Component({
  selector: 'app-tablaUsers',
  templateUrl: './tablaUsers.component.html',
  styleUrls: ['./tablaUsers.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class TablaUsersComponent implements OnInit {

  public usuarios: Usuarios[] = [];
  totalActividades: number = 0;
  paginaActual: number = 0;
  actividadesPorPagina: number = 10;
  mensajeEliminado: boolean = false;
  buscarNombre: string = '';
  buscarRol: string = '';
  buscarUsername: string = '';
  buscarEmail: string = '';
  buscarEstado: string = '';

  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.listarUsers();
  }

  async listarUsers() {
    const filtros = {
      id: 0,
      nombre: '',
      username: '',
      email: '',
      rol: '',
      estado: '',
      skip: this.paginaActual,
      limit: 10
    }
    try {
      const usuarios = await this.api.getUsers(filtros);
      this.usuarios = usuarios;

    } catch (error) {
      console.error('Error al obtener usuarios:', error);
    }
  }

  skipPlus() {
    const skip = this.paginaActual + 1;
    this.paginaActual = skip;
    if (this.paginaActual > this.totalActividades) {
      this.paginaActual = this.totalActividades;
    }
    this.listarUsers();
  }

  skipMinus() {
    const skip = this.paginaActual - 1;
    this.paginaActual = skip;
    if (this.paginaActual < 0) {
      this.paginaActual = 0;
    }
    this.listarUsers();
  }

  cambiarPagina(direccion: number) {
    this.paginaActual += direccion;
    this.listarUsers();
  }
  editar(value: number) {
    this.router.navigate(['editarUser', value]);

  }
  eliminarUsuario(id: number) {
    // Lógica para eliminar la docencia
    this.api.deleteUser(id).then(() => {
      this.listarUsers();
      console.log('Usuario eliminado correctamente');
      this.mensajeEliminado = true;
      setTimeout(() => {
        this.mensajeEliminado = false;
      }, 3000);
    });
  }

  agregarUsuario() {
    // Lógica para agregar una nueva docencia
    this.router.navigate(['formularioUsers']);
  }

  volver() {
    // Lógica para volver al menú principal
    this.router.navigate(['eventos']);
  }



  limpiarFiltros() {
    this.buscarNombre = '';
    this.buscarRol = '';
    this.buscarUsername = '';
    this.buscarEmail = '';
    this.buscarEstado = '';

    this.listarUsers();
  }


  visible = signal(false);

  open() {
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
  }





}
