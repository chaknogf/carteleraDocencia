import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ServicioResponsables, SubdirecionPertenece, Usuarios } from '../app/interface/interfaces';
import { Router } from '@angular/router';
import { ApiService } from '../app/service/api.service';
import { NavbarClienteComponent } from '../app/navs/navbarCliente/navbarCliente.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarClienteComponent],
})
export class SignupComponent implements OnInit {
  public subdirecciones: SubdirecionPertenece[] = [];
  public subdireccion_id = 0;

  private serviciosMap: Record<number, ServicioResponsables[]> = {};

  usuario: Usuarios = {
    id: 0,
    nombre: '',
    username: '',
    password: '',
    email: '',
    role: 'estandar',
    estado: 'A',
    servicio_id: null,
  };

  mostrarPassword = false;
  enviando = false;
  enviado = false;
  errorEnvio = '';

  constructor(private router: Router, private api: ApiService) {}

  ngOnInit(): void {
    this.listarServicios();
    this.listarSubdirecciones();
  }

  volver(): void {
    this.router.navigate(['eventos']);
  }

  // ===================== SERVICIOS POR SUBDIRECCIÓN =====================

  get serviciosDisponibles(): ServicioResponsables[] {
    return this.serviciosMap[this.subdireccion_id] || [];
  }

  onSubdireccionChange(): void {
    this.usuario.servicio_id = null;
  }

  // ===================== VALIDACIÓN DE CONTRASEÑA =====================

  private get pass(): string {
    return this.usuario.password || '';
  }

  get reqSinEspacios(): boolean {
    return !/\s/.test(this.pass);
  }

  get reqLargo(): boolean {
    return this.pass.length >= 8;
  }

  get reqMayuscula(): boolean {
    return /[A-Z]/.test(this.pass);
  }

  get reqNumero(): boolean {
    return /[0-9]/.test(this.pass);
  }

  get reqSimbolo(): boolean {
    return /[^A-Za-z0-9]/.test(this.pass);
  }

  get passwordValida(): boolean {
    return (
      this.reqSinEspacios &&
      this.reqLargo &&
      this.reqMayuscula &&
      this.reqNumero &&
      this.reqSimbolo
    );
  }

  onPasswordCambia(): void {
    this.usuario.password = this.pass.replace(/\s+/g, '');
  }

  bloquearEspacio(event: Event): void {
    const kbEvent = event as KeyboardEvent;
    if (kbEvent.key === ' ' || kbEvent.code === 'Space') {
      kbEvent.preventDefault();
    }
  }

  get etiquetaOjo(): string {
    return this.mostrarPassword ? 'Ocultar contraseña' : 'Mostrar contraseña';
  }

  // ===================== REGISTRO =====================

  guardar(): void {
    if (this.enviando || !this.passwordValida) return;
    this.enviado = true;
    this.enviando = true;
    this.errorEnvio = '';

    this.api
      .signup(this.usuario)
      .then(() => {
        this.router.navigate(['eventos']);
      })
      .catch((error) => {
        console.error('❌ Error al crear usuario:', error);
        this.errorEnvio = this.mensajeError(error);
      })
      .finally(() => {
        this.enviando = false;
      });
  }

  private mensajeError(error: any): string {
    if (error?.response?.status === 409) {
      return 'Ese usuario o correo ya está registrado.';
    }
    if (error?.response?.status === 400) {
      return 'Verifica los datos ingresados.';
    }
    return 'No se pudo completar el registro. Inténtalo de nuevo.';
  }

  // ===================== CATÁLOGOS =====================

  async listarSubdirecciones(): Promise<void> {
    try {
      this.subdirecciones = await this.api.getSubdirecciones({ limit: 30, skip: 0 });
    } catch (error) {
      console.error('Error al listar subdirecciones:', error);
    }
  }

  async listarServicios(): Promise<void> {
    try {
      const [d, e, m, t, g, r] = await Promise.all([
        this.api.getServiciosResponsables({ sub: 1 }),
        this.api.getServiciosResponsables({ sub: 2 }),
        this.api.getServiciosResponsables({ sub: 3 }),
        this.api.getServiciosResponsables({ sub: 4 }),
        this.api.getServiciosResponsables({ sub: 5 }),
        this.api.getServiciosResponsables({ sub: 6 }),
      ]);
      this.serviciosMap = { 1: d, 2: e, 3: m, 4: t, 5: g, 6: r };
    } catch (error) {
      console.error('Error al listar servicios:', error);
    }
  }
}