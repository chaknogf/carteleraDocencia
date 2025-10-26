import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../service/api.service'; // ajuste según su estructura
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor complete todos los campos.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { username, password } = this.loginForm.value;

    this.apiService.login(username, password)
      .then(() => {
        this.loading = false;
        // Redirigir tras autenticación exitosa (ajuste la ruta según corresponda)
        this.router.navigate(['/reporteActividades']);
      })
      .catch((error) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(error);
      });
  }

  public getErrorMessage(error: any): string {
    if (!error || !error.response) {
      return 'Error desconocido. Inténtalo nuevamente.';
    }

    switch (error.response.status) {
      case 400:
        return 'Solicitud incorrecta. Verifica los datos ingresados.';
      case 401:
        return 'Credenciales incorrectas.';
      case 422:
        return 'Formato de datos incorrecto.';
      case 500:
        return 'Error del servidor. Inténtalo más tarde.';
      default:
        return 'Ocurrió un error inesperado.';
    }
  }
}
