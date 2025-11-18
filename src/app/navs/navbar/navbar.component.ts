import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UsuarioActualComponent } from "../../users/usuarioActual/usuarioActual.component";
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  standalone: true,
  imports: [CommonModule, UsuarioActualComponent]
})
export class NavbarComponent implements OnInit {
  acceso: boolean = false;


  constructor(
    private router: Router,
    private api: ApiService

  ) { }

  ngOnInit() {
    if (localStorage.getItem('role') === 'admin') {
      this.acceso = true
    }
  }

  mostrarMenu = false;
  menuActivo = false;


  toggleMenu() {
    this.mostrarMenu = !this.mostrarMenu;
    this.menuActivo = !this.menuActivo;
  }
  usuarios() {
    this.router.navigate(['tablaUsers']);
  }

  reporte() {
    this.router.navigate(['dashboard']);
  }

  servicios() {
    this.router.navigate(['servicioRes'])
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

  logout() {
    ['username', 'role', 'servicio_id', 'subId'].forEach(key => localStorage.removeItem(key));
    this.router.navigate(['eventos']);
  }

}
