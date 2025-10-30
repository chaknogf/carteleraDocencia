import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ServicioResponsables, SubdirecionPertenece, Usuarios } from '../../interface/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NavbarComponent } from "../../navs/navbar/navbar.component";
import { promises } from 'dns';

@Component({
  selector: 'app-formUser',
  templateUrl: './formUser.component.html',
  styleUrls: ['./formUser.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class FormUserComponent implements OnInit {

  public enEdicion: boolean = false;
  public subdirecciones: SubdirecionPertenece[] = [];
  public serviciosResponsables: ServicioResponsables[] = [];
  public subdireccion_id: number = 0;

  usuario: Usuarios = {
    id: 0,
    nombre: '',
    username: '',
    password: '',
    email: '',
    role: '',
    estado: '',
    servicio_id: null,
    google_id: ''
  }


  constructor(

    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) { }

  async ngOnInit(): Promise<void> {
    const idParam = this.route.snapshot.paramMap.get('id');

    this.listarSubdirecciones(); // carga las subdirecciones de inmediato

    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        try {
          const data = await this.api.getUsers({ id });
          this.usuario = data[0];
          this.enEdicion = true;

          // 1️⃣ Obtén el subdireccion_id basado en el servicio_id actual
          await this.getSub(this.usuario.servicio_id);

          // 2️⃣ Luego carga los servicios de esa subdirección
          await this.listarServicios(this.subdireccion_id);

          // 3️⃣ Y solo después asegúrate de mantener el valor actual
          setTimeout(() => {
            this.usuario.servicio_id = this.usuario.servicio_id;
          }, 0);

        } catch (error) {
          console.error('❌ Error al cargar usuario para edición:', error);
        }
      } else {
        console.warn('⚠️ ID inválido en la URL:', idParam);
      }
    }
  }
  volver(): void {
    this.router.navigate(['tablaUsers']);
  }

  agregar(): void {


    this.api.createUser(this.usuario)
      .then(() => {
        // console.log('✅ Usuario creado correctamente');
        this.router.navigate(['tablaUsers']);
      })
      .catch((error) => {
        console.error('❌ Error al crear usuario:', error, this.usuario);
      });
  }

  async actualizar(): Promise<void> {
    try {
      await this.api.updateUser(this.usuario.id, this.usuario);
      // console.log('✅ Usuario actualizado correctamente');
      this.router.navigate(['tablaUsers']);
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      console.log('Usuario a actualizar:', this.usuario);

    }
  }

  guardar(): void {
    this.enEdicion ? this.actualizar() : this.agregar();
  }

  async listarSubdirecciones(): Promise<void> {
    const filt = { limit: 30, skip: 0 };
    try {
      this.subdirecciones = await this.api.getSubdirecciones(filt);
      // console.log('Subdirecciones cargadas:', this.subdirecciones);
    } catch (error) {
      console.error('Error al listar subdirecciones:', error);
    }
  }

  // Función que se llama al cambiar la subdirección

  async listarServicios(value: number): Promise<void> {
    try {
      this.serviciosResponsables = await this.api.getServiciosResponsables({ sub: value });
    } catch (error) {
      console.error('Error al listar servicios:', error);
    }
  }

  onSubdireccionChange(subId: number): void {
    this.usuario.servicio_id = 0; // reinicia selección de servicio
  }


  async getSub(servicio_id: any): Promise<void> {
    try {
      const data = await this.api.getServiciosResponsables({ id: servicio_id });
      if (data && Array.isArray(data) && data.length > 0) {
        this.subdireccion_id = data[0].subdireccion_id;
      }
    }
    catch (error) {
      console.error(' erro al obtener datos', error)
    }
  }

}
