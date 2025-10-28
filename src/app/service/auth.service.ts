import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'access_token';

  constructor(private api: ApiService) { }

  // 🔹 Iniciar sesión con Google
  async loginWithGoogle(id_token: string): Promise<void> {
    const response = await this.api.authGoogle(id_token);
    localStorage.setItem(this.TOKEN_KEY, response.access_token);
  }

  // 🔹 Obtener token actual
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // 🔹 Verificar si hay sesión activa
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  // 🔹 Cerrar sesión
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
