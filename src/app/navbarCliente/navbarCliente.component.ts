import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbarCliente',
  templateUrl: './navbarCliente.component.html',
  styleUrls: ['./navbarCliente.component.css'],
  standalone: true,
  imports: [CommonModule, LoginComponent]
})
export class NavbarClienteComponent implements OnInit {

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

  acceso() {
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


  visible = signal(false);
  open() {
    this.visible.set(true);
  }

  close() {
    this.visible.set(false);
  }

}
