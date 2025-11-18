import { ActividadesVista, Asistencia } from './../../interface/interfaces';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NavbarComponent } from "../../navs/navbar/navbar.component";
import { SafeHtml } from '@angular/platform-browser';
import { IconService } from '../../service/icon.service';
import { printicon } from '../../shared/icons/icons';
import { DiscapacidadPipe, GrupoEdadPipe, IdiomaPipe, PertenenciaPipe } from '../../pipe/tuberias.pipe';


@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.component.html',
  styleUrls: ['./asistencia.component.css'],
  standalone: true,
  imports: [CommonModule, NavbarComponent, GrupoEdadPipe, PertenenciaPipe, IdiomaPipe, DiscapacidadPipe]
})
export class AsistenciaComponent implements OnInit {

  public asistencias: Asistencia[] = [];
  actividad: ActividadesVista = {
    id: 0,
    tema: '',
    actividad: '',
    actividad_id: 0,
    descripcion_actividad: '',
    subdireccion: '',
    subdireccion_id: 0,
    servicio_encargado: '',
    servicio_id: 0,
    persona_responsable: {},
    tiempo_aproximado: '',
    fecha_programada: '',
    horario_programado: '',
    lugar_id: 0,
    lugar: '',
    mes: '',
    mes_id: 0,
    anio: 0,
    modalidad: '',
    modalidad_id: 0,
    estado: '',
    estado_id: 0,
    detalles: {} as any,
    metadatos: {} as any
  };

  options: { nombre: string; descripcion: string; ruta: string; icon: string }[] = [];

  // iconos
  icons: { [key: string]: any } = {};

  printicon: SafeHtml = printicon

  constructor(

    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private iconService: IconService,
  ) {
    this.icons = {
      print: this.iconService.getIcon('printicon')

    }
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {

        this.api.listaAsistencia({ capacitacion: id })
          .then((data) => {
            this.asistencias = data
            this.api.getActividades({ id: this.asistencias[0].capacitacion_id })
              .then((data) => {
                this.actividad = data[0]
              })
          })





          .catch((error) => {
            console.error('❌ Error al cargar actividad para edición:', error);
          });
      } else {
        console.warn('⚠️ ID inválido en la URL:', idParam);
      }



    }



  }

  print() {
    window.print();
  }
}
