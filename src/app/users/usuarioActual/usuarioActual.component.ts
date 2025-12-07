import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Currentuser } from '../../interface/interfaces';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../service/icon.service';
import { logoutIcon } from '../../shared/icons/icons';
import { UserInfo } from 'node:os';
import { get } from 'node:http';

@Component({
  selector: 'app-usuarioActual',
  templateUrl: './usuarioActual.component.html',
  styleUrls: ['./usuarioActual.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsuarioActualComponent implements OnInit {
  userData: Currentuser = {
    id: 0,
    username: '',
    role: '',
    nombre: '',
    email: '',
    servicio_id: 0,
    servicio: { nombre: '' }

  }



  options: { nombre: string; descripcion: string; ruta: string; icon: string }[] = [];

  private sanitizarSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
  // iconos
  icons: { [key: string]: any } = {};

  logoutIcon: SafeHtml = logoutIcon;


  constructor(
    private router: Router,
    private api: ApiService,
    private iconService: IconService,
    private sanitizer: DomSanitizer,
  ) {
    this.icons = {
      logoutIcon: this.sanitizarSvg(logoutIcon)
    }
  }

  ngOnInit() {
    this.usuarioActual();



  }

  logout() {
    ['username', 'role', 'servicio_id', 'subId'].forEach(key => localStorage.removeItem(key));
    this.router.navigate(['eventos']);
  }


  async usuarioActual() {
    try {
      this.userData = await this.api.usuarioActual();
      // console.log('Datos del usuario actual:', this.userData);
    } catch (error) {
      console.error('Error al obtener los datos del usuario actual:', error);
    }

  }


}
