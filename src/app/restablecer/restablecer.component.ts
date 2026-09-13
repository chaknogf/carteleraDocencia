import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-restablecer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './restablecer.component.html',
  styleUrls: ['./restablecer.component.css'],
})
export class RestablecerComponent implements OnInit {
  token: string | null = null;
  form: FormGroup;

  mostrarPassword = false;
  enviando = false;
  error = '';
  exito = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) {
    this.form = this.fb.group({
      password: ['', Validators.required],
      confirm: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
  }

  get pass(): string {
    return this.form.get('password')?.value ?? '';
  }

  get confirm(): string {
    return this.form.get('confirm')?.value ?? '';
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

  get confirmOk(): boolean {
    return this.pass.length > 0 && this.pass === this.confirm;
  }

  onPasswordCambia(): void {
    this.form.get('password')?.setValue(this.pass.replace(/\s+/g, ''), { emitEvent: false });
  }

  bloquearEspacio(event: Event): void {
    const kbEvent = event as KeyboardEvent;
    if (kbEvent.key === ' ' || kbEvent.code === 'Space') {
      kbEvent.preventDefault();
    }
  }

  restablecer(): void {
    if (!this.token) return;
    if (!this.passwordValida || !this.confirmOk) {
      this.error = 'Verifica que la contraseña cumpla los requisitos y coincida en ambos campos.';
      return;
    }

    this.enviando = true;
    this.error = '';

    this.api
      .restablecerContrasena(this.token, this.pass, this.confirm)
      .then(() => {
        this.exito = true;
      })
      .catch((error) => {
        this.error = error?.response?.status === 400
          ? 'El enlace no es válido o ya expiró. Solicita uno nuevo.'
          : 'No se pudo restablecer la contraseña. Inténtalo de nuevo.';
        console.error('❌ Error al restablecer contraseña:', error);
      })
      .finally(() => {
        this.enviando = false;
      });
  }

  irLogin(): void {
    this.router.navigate(['eventos']);
  }
}