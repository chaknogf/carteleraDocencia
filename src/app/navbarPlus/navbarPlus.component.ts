import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsuarioActualComponent } from "../users/usuarioActual/usuarioActual.component";
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-navbarPlus',
  templateUrl: './navbarPlus.component.html',
  styleUrls: ['./navbarPlus.component.css'],
  standalone: true,
  imports: [CommonModule, UsuarioActualComponent]
})
export class NavbarPlusComponent implements OnInit {

  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {
  }

  mostrarMenu = false;

  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
  }

  usuarios() {
    this.router.navigate(['tablaUsers']);
  }

  reporte() {
    this.router.navigate(['reporteActividades']);
  }

  agregarDocencia() {
    // Lógica para agregar una nueva docencia
    this.router.navigate(['formulario']);
  }
  irCartelera() {
    this.router.navigate(['eventos']);
  }

  irActividades() {
    this.router.navigate(['tabla']);
  }

}
