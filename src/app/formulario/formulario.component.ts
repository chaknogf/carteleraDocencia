import { mes } from './../interface/enum';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';
import { Actividad, Detalles, Metadatos, PersonaResponsable } from './../interface/interfaces';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class FormularioComponent implements OnInit {

  public enEdicion: boolean = false;
  public mesActividad: number = 0;

  detalle: Detalles = {
    link: '',
    duracion: '',
    grupo_dirigido: '',
    lugar: '',
    contenido: '',
    asistencia: 0,
    inasistencia: 0,
    excelente: 0,
    bueno: 0,
    regular: 0,
    deficiente: 0,
    fecha_entrega_informe: '',
    mes: 0
  };

  metadato: Metadatos = {
    user: '',
    registro: ''
  };

  persona_responsable: PersonaResponsable = {
    nombre: '',
    puesto: ''
  };

  actividad: Actividad = {
    id: 0,
    tema: '',
    actividad: 0,
    servicio_encargado: '',
    persona_responsable: {
      r0: this.persona_responsable
    },
    tiempo_aproximado: '',
    fechas_a_desarrollar: '',
    modalidad: '',
    estado: '',
    detalles: this.detalle,
    metadatos: this.metadato
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.api.getActividad(id)
          .then((data) => {
            this.actividad = data;
            this.detalle = this.actividad.detalles;
            this.metadato = this.actividad.metadatos;

            this.enEdicion = true;
            console.log('✅ Actividad cargada para edición');
          })
          .catch((error) => {
            console.error('❌ Error al cargar actividad para edición:', error);
          });
      } else {
        console.warn('⚠️ ID inválido en la URL:', idParam);
      }
    } else {
      // Para nuevo registro, inicializamos detalle y metadato
      this.actividad.detalles = this.detalle;
      this.actividad.metadatos = this.metadato;
    }
  }

  volver(): void {
    this.router.navigate(['tabla']);
  }

  agregar(): void {
    this.actividad.detalles = this.detalle;
    this.actividad.metadatos = this.metadato;

    this.api.createActividad(this.actividad)
      .then(() => {
        console.log('✅ Actividad creada correctamente');
        this.router.navigate(['tabla']);
      })
      .catch((error) => {
        console.error('❌ Error al crear actividad:', error, this.actividad);
      });
  }

  async actualizar(): Promise<void> {
    this.actividad.detalles = this.detalle;
    this.actividad.metadatos = this.metadato;



    try {
      await this.api.updateActividad(this.actividad.id, this.actividad);
      console.log('✅ Actividad actualizada correctamente');
      console.table(this.actividad.detalles);

      this.router.navigate(['tabla']);
    } catch (error) {
      console.error('❌ Error al actualizar actividad:', error);
      console.log('Actividad a actualizar:', this.actividad);

    }
  }

  guardar(): void {
    if (this.actividad.fechas_a_desarrollar) {
      const fecha = new Date(this.actividad.fechas_a_desarrollar);
      this.detalle.mes = fecha.getMonth() + 1;
    }
    this.enEdicion ? this.actualizar() : this.agregar();
  }

  agregarResponsable(): void {
    const keys = Object.keys(this.actividad.persona_responsable || {});
    // Inicializa si aún no existe
    if (!this.actividad.persona_responsable) {
      this.actividad.persona_responsable = {};
    }
    const nuevoKey = 'r' + keys.length;
    // Solo agrega la nueva clave sin sobrescribir las existentes
    this.actividad.persona_responsable[nuevoKey] = { nombre: '', puesto: '' };
  }

  removerResponsable(key: string): void {
    const total = Object.keys(this.actividad.persona_responsable).length;
    if (total > 1) {
      // Copia los responsables existentes antes de eliminar para evitar mutaciones inesperadas
      // this.actividad.persona_responsable = { ...this.actividad.persona_responsable };
      delete this.actividad.persona_responsable[key];
    }
  }


  // Asegúrese de ejecutar esto después de cargar `actividad.fechas_a_desarrollar`
  actualizarMes(fechaStr: string) {
    const fecha = new Date(fechaStr);
    this.detalle.mes = fecha.getMonth() + 1;
  }
}
