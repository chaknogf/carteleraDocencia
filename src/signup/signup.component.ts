import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ServicioResponsables, SubdirecionPertenece, Usuarios } from '../app/interface/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../app/service/api.service';
import { NavbarClienteComponent } from "../app/navs/navbarCliente/navbarCliente.component";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarClienteComponent]
})
export class SignupComponent implements OnInit {

  public enEdicion: boolean = false;
  public subdirecciones: SubdirecionPertenece[] = [];
  public serviciosResponsables: ServicioResponsables[] = [];
  public subRH: ServicioResponsables[] = [];
  public subGerencia: ServicioResponsables[] = [];
  public subMedica: ServicioResponsables[] = [];
  public subTecnica: ServicioResponsables[] = [];
  public subEnfermeria: ServicioResponsables[] = [];
  public direccion: ServicioResponsables[] = [];
  public subdireccion_id: number = 0;

  usuario: Usuarios = {
    id: 0,
    nombre: '',
    username: '',
    password: '',
    email: '',
    role: 'estandar',
    estado: 'A',
    servicio_id: null,

  }


  constructor(

    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.listarServicios();
    this.listarSubdirecciones();

  }
  volver(): void {
    this.router.navigate(['eventos']);
  }

  guardar(): void {


    this.api.signup(this.usuario)
      .then(() => {
        // console.log('✅ Usuario creado correctamente');
        this.router.navigate(['eventos']);
      })
      .catch((error) => {
        console.error('❌ Error al crear usuario:', error, this.usuario);
      });
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

  async listarServicios(): Promise<void> {
    try {
      this.serviciosResponsables = await this.api.getServiciosResponsables({});
      this.subRH = await this.api.getServiciosResponsables({ sub: 6 });
      this.subGerencia = await this.api.getServiciosResponsables({ sub: 5 });
      this.subTecnica = await this.api.getServiciosResponsables({ sub: 4 });
      this.subMedica = await this.api.getServiciosResponsables({ sub: 3 });
      this.subEnfermeria = await this.api.getServiciosResponsables({ sub: 2 });
      this.direccion = await this.api.getServiciosResponsables({ sub: 1 });


    } catch (error) {
      console.error('Error al listar servicios:', error);
    }
  }

  onSubdireccionChange(subId: number): void {
    this.usuario.servicio_id = 0; // reinicia selección de servicio
  }




}
