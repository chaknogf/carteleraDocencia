import { estado } from './../../interface/enum';
import { Component, input, OnInit, Input } from '@angular/core';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';
import { ActividadesVista, Reportes } from '../../interface/interfaces';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../../navs/navbar/navbar.component";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../service/icon.service';
import { printicon } from '../../shared/icons/icons';
import { ComunicacionService } from '../../service/comunicacion.service';

@Component({
  selector: 'app-autorizado',
  templateUrl: './autorizado.component.html',
  styleUrls: ['./autorizado.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent]
})
export class AutorizadoComponent implements OnInit {
  anioSeleccion: number = 0;
  public resumen: Reportes[] = [];
  options: { nombre: string; descripcion: string; ruta: string; icon: string }[] = [];
  private sanitizarSvg(svg: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }
  // iconos
  icons: { [key: string]: any } = {};

  printicon: SafeHtml = printicon

  constructor(
    private api: ApiService,
    private router: Router,
    private iconService: IconService,
    private sanitizer: DomSanitizer,
    private comunicacionService: ComunicacionService
  ) {

    this.icons = {
      print: this.sanitizarSvg(printicon)

    }
  }

  ngOnInit() {
    this.comunicacionService.anioSeleccionado$.subscribe(anio => {
      this.anioSeleccion = anio;
      // console.log('📅 Año recibido:', anio);
    });
    const localServid = Number(localStorage.getItem('servicio_id'))
    // console.log(localServid, this.anioSeleccion)
    this.getDatos(localServid, this.anioSeleccion);

  }

  async getDatos(value: number, anio: number) {
    try {
      this.resumen = await this.api.getReporteActividades({ servicioId: value, anio: anio })
    } catch (error) {
      console.error('Error al cargar informacion', error)
    }
  }

  print() {
    window.print();
  }

}
