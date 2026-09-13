import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NavbarComponent } from '../../navs/navbar/navbar.component';
import { SubdirecionPertenece } from '../../interface/interfaces';

@Component({
  selector: 'app-serSubdirecciones',
  templateUrl: './serSubdirecciones.component.html',
  styleUrls: ['./serSubdirecciones.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class SerSubdireccionesComponent implements OnInit {
  subdirecciones: SubdirecionPertenece[] = [];
  cargando = true;
  buscarNombre = '';
  mensaje = '';

  constructor(
    private router: Router,
    private api: ApiService
  ) {}

  async ngOnInit() {
    if (localStorage.getItem('role') !== 'admin') {
      this.router.navigate(['/eventos']);
      return;
    }
    await this.listar();
  }

  async listar() {
    this.cargando = true;
    try {
      const filtros: any = { limit: 50 };
      if (this.buscarNombre.trim()) filtros.nombre = this.buscarNombre.trim();
      const data = await this.api.getSubdirecciones(filtros);
      this.subdirecciones = Array.isArray(data) ? data : [];
    } catch {
      this.subdirecciones = [];
    } finally {
      this.cargando = false;
    }
  }

  editar(id: number) {
    this.router.navigate(['modificarSub/', id]);
  }

  agregar() {
    this.router.navigate(['addSubdireccion']);
  }

  eliminar(sub: SubdirecionPertenece) {
    if (!confirm(`¿Eliminar la subdirección "${sub.nombre}"? Esta acción es permanente.`)) return;
    this.api.deleteSubdireccion(sub.id)
      .then(() => this.listar())
      .catch(() => {
        this.mensaje = 'No se pudo eliminar. Puede que tenga servicios asociados.';
      });
  }

  limpiarFiltros() {
    this.buscarNombre = '';
    this.listar();
  }

  volver() {
    this.router.navigate(['dashboard']);
  }
}