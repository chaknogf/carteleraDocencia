import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Currentuser } from '../../interface/interfaces';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../service/icon.service';
import { logoutIcon } from '../../shared/icons/icons';

@Component({
  selector: 'app-usuarioActual',
  templateUrl: './usuarioActual.component.html',
  styleUrls: ['./usuarioActual.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsuarioActualComponent implements OnInit {
  username: string = '';
  roleUser: string = '';
  subId: any = '';
  servicioId: any = 0;
  servicio: string = '';

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
    this.username = localStorage.getItem('username') || '';
    this.roleUser = localStorage.getItem('role') || '';
    this.subId = Number(localStorage.getItem('subId') || '');
    this.servicioId = Number(localStorage.getItem('servicio_id'));
    this.getServicio();
    console.log(this.servicioId, this.subId)

  }

  logout() {
    ['username', 'role', 'servicio_id', 'subId'].forEach(key => localStorage.removeItem(key));
    this.router.navigate(['eventos']);
  }

  async getServicio() {
    try {
      const data = await this.api.getServiciosResponsables({ id: this.servicioId });
      if (data && data.length > 0) {
        this.servicio = data[0].nombre;
      } else {
        this.servicio = 'Sin servicio';
      }
    } catch (error) {
      console.error('❌ Error al obtener el servicio:', error);
      this.servicio = 'Error al cargar';
    }
  }


}
