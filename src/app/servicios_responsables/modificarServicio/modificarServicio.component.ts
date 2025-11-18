import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ServicioResponsables, SubdirecionPertenece, Usuarios } from '../../interface/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NavbarComponent } from "../../navs/navbar/navbar.component";
import { Console } from 'node:console';


@Component({
  selector: 'app-modificarServicio',
  templateUrl: './modificarServicio.component.html',
  styleUrls: ['./modificarServicio.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class ModificarServicioComponent implements OnInit {

  public enEdicion: boolean = false;
  public subdirecciones: SubdirecionPertenece[] = [];
  public serviciosResponsables: ServicioResponsables[] = [];
  public subdireccion_id: number = 0;

  Servicio: ServicioResponsables = {
    id: 0,
    nombre: '',
    descripcion: '',
    encargado_servicio: '',
    activo: true,
    subdireccion_id: 0,
    puesto_funcional: ''
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
          const data = await this.api.getServiciosResponsables({ id });
          this.Servicio = data[0];
          this.enEdicion = true;
          // console.log(this.Servicio)

          // 1️⃣ Obtén el subdireccion_id basado en el servicio_id actual
          await this.getSub(this.Servicio.id);

          // 2️⃣ Luego carga los servicios de esa subdirección
          await this.listarServicios(this.subdireccion_id);

          // 3️⃣ Y solo después asegúrate de mantener el valor actual
          setTimeout(() => {
            this.Servicio.id = this.Servicio.id;
          }, 0);

        } catch (error) {
          console.error('❌ Error al cargar para edición:', error);
        }
      } else {
        console.warn('⚠️ ID inválido en la URL:', idParam);
      }
    }
  }
  volver(): void {
    this.router.navigate(['servicioRes']);
  }

  agregar(): void {


    this.api.createServicioResponsable(this.Servicio)
      .then(() => {
        // console.log('✅ creado correctamente');
        this.router.navigate(['servicioRes']);
      })
      .catch((error) => {
        console.error('❌ Error al crear:', error, this.Servicio);
      });
  }

  async actualizar(): Promise<void> {
    try {
      await this.api.updateServicioResponsable(this.Servicio.id, this.Servicio);
      this.router.navigate(['servicioRes']);
    } catch (error) {
      console.error('❌ Error al actualizar:', error);
      // console.log('actualizar:', this.Servicio);

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
    this.Servicio.id = 0; // reinicia selección de servicio
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
