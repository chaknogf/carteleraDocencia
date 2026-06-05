import { ActividadesVista, Asistencia, Currentuser, ServicioResponsables } from './../../interface/interfaces';
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
    if (!idParam) return;

    const id = Number(idParam);
    if (isNaN(id)) {
      console.warn('⚠️ ID inválido en la URL:', idParam);
      return;
    }

    this.cargarDatos(id);
    this.usuarioActual();
  }

  private async cargarDatos(id: number): Promise<void> {
    try {
      const asistencias = await this.api.listaAsistencia({ capacitacion: id, limit: 500 });
      this.asistencias = asistencias;

      if (this.asistencias.length === 0) {
        console.warn('⚠️ No hay asistencias para esta capacitación');
        return;
      }

      const actividades = await this.api.getActividades({ id: this.asistencias[0].capacitacion_id });
      if (actividades.length > 0) {
        this.actividad = actividades[0];
      }

    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
    }
  }

  async usuarioActual() {
    try {
      this.userData = await this.api.usuarioActual();
      // console.log('Datos del usuario actual:', this.userData);
    } catch (error) {
      console.error('Error al obtener los datos del usuario actual:', error);
    }

  }

  print() {
    window.print();
  }
}
