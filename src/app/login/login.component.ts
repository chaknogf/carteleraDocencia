import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

type VistaLogin = 'login' | 'recuperar';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  host: { class: 'app-login' },
})
export class LoginComponent {
  vista: VistaLogin = 'login';
  loginForm: FormGroup;
  recuperacionForm: FormGroup;

  errorMessage = '';
  loading = false;
  mostrarPassword = false;

  recuperando = false;
  enviadoCorreo = false;
  mensajeRecuperacion = '';

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.recuperacionForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get correoInvalido(): boolean {
    const c = this.recuperacionForm.get('email');
    return !!c?.invalid && (c.touched || this.recuperando);
  }

  irRecuperar(): void {
    this.vista = 'recuperar';
    this.errorMessage = '';
    this.enviadoCorreo = false;
    this.mensajeRecuperacion = '';
  }

  volverLogin(): void {
    this.vista = 'login';
    this.mensajeRecuperacion = '';
    this.enviadoCorreo = false;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.errorMessage = 'Ingresa tu usuario y contraseña.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.apiService
      .login(username, password)
      .then(() => this.router.navigate(['/dashboard']))
      .catch((error) => {
        this.errorMessage = this.getErrorMessage(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  enviarRecuperacion(): void {
    if (this.recuperacionForm.invalid) {
      this.recuperacionForm.markAllAsTouched();
      return;
    }

    this.recuperando = true;
    this.mensajeRecuperacion = '';

    this.apiService
      .solicitarRecuperacion(this.recuperacionForm.value.email)
      .then(() => {
        this.enviadoCorreo = true;
      })
      .catch((error) => {
        this.mensajeRecuperacion = error?.response?.status === 429
          ? 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.'
          : 'Hubo un problema al enviar el correo. Inténtalo de nuevo.';
      })
      .finally(() => {
        this.recuperando = false;
      });
  }

  public getErrorMessage(error: any): string {
    if (error?.response?.status === 401) {
      return 'Usuario o contraseña incorrectos.';
    }
    if (error?.response?.status === 400) {
      return 'Solicitud incorrecta. Verifica los datos ingresados.';
    }
    if (error?.response?.status === 500) {
      return 'Error del servidor. Inténtalo más tarde.';
    }
    return 'No se pudo iniciar sesión. Verifica tu conexión e inténtalo de nuevo.';
  }

  registrarse(): void {
    this.router.navigate(['signup']);
  }
}