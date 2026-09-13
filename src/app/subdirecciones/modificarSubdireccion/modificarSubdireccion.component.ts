import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NavbarComponent } from '../../navs/navbar/navbar.component';
import { SubdirecionPertenece } from '../../interface/interfaces';

@Component({
  selector: 'app-modificarSubdireccion',
  templateUrl: './modificarSubdireccion.component.html',
  styleUrls: ['./modificarSubdireccion.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class ModificarSubdireccionComponent implements OnInit {
  enEdicion = false;
  guardando = false;

  subdireccion: SubdirecionPertenece = {
    id: 0,
    nombre: '',
    descripcion: '',
    persona_encargada: '',
    activo: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {}

  async ngOnInit() {
    if (localStorage.getItem('role') !== 'admin') {
      this.router.navigate(['/eventos']);
      return;
    }
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.enEdicion = true;
        try {
          const data = await this.api.getSubdirecciones({ id });
          if (data?.length) this.subdireccion = data[0];
        } catch (error) {
          console.error('Error al cargar subdirección:', error);
        }
      }
    }
  }

  volver() {
    this.router.navigate(['subdirecciones']);
  }

  async guardar() {
    if (this.guardando || !this.subdireccion.nombre.trim()) {
      alert('El nombre de la subdirección es obligatorio');
      return;
    }
    this.guardando = true;
    try {
      if (this.enEdicion) {
        await this.api.updateSubdireccion(this.subdireccion.id, this.subdireccion);
      } else {
        await this.api.createSubdireccion(this.subdireccion);
      }
      this.router.navigate(['subdirecciones']);
    } catch (error) {
      console.error('Error al guardar subdirección:', error);
      this.guardando = false;
    }
  }
}