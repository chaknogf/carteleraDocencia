import { discapacidades, idiomas, Valores } from './../../interface/enum';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Actividades, ActividadesVista, Asistencia, GruposDeEdad, PertenenciaCultural } from '../../interface/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NavbarClienteComponent } from "../../navs/navbarCliente/navbarCliente.component";
import { error } from 'console';

@Component({
  selector: 'app-formularioAsistencia',
  templateUrl: './formularioAsistencia.component.html',
  styleUrls: ['./formularioAsistencia.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarClienteComponent]
})
export class FormularioAsistenciaComponent implements OnInit {

  public enEdicion: boolean = false;
  mostrarModal = false;
  actividadAsignada: Actividades = {
    id: 0,
    tema: '',
    actividad_id: 0,
    servicio_id: 0,
    subdireccion_id: 0,
    modalidad_id: 0,
    estado_id: 0,
    mes_id: 0,
    persona_responsable: {},
    detalles: {} as any,
    metadatos: {} as any,
    tiempo_aproximado: '',
    fecha_programada: '',
    horario_programado: '',
    lugar_id: 0
  }
  public gruposEdad: GruposDeEdad[] = [

    {
      "id": 1,
      "rango": "18-30"
    },
    {
      "id": 2,
      "rango": "31-49"
    },
    {
      "id": 3,
      "rango": "50-70"
    },
    {
      "id": 4,
      "rango": "71 o más"
    }
  ];

  public pertenenciaCultura: PertenenciaCultural[] = [
    {
      "id": 1,
      "nombre": 'Maya'
    },
    {
      "id": 2,
      "nombre": 'Garifuna'
    },
    {
      "id": 3,
      "nombre": 'Xinca'
    },
    {
      "id": 4,
      "nombre": 'Ladino/Mestizo'
    },
    {
      "id": 5,
      "nombre": 'Otro'
    }

  ];

  i: Valores[] = idiomas;
  d: Valores[] = discapacidades;

  asistencia: Asistencia = {
    id: 0,
    nombre_completo: '',
    sexo_id: 0,
    grupo_edad_id: 0,
    cui: 0,
    puesto_funcional: '',
    pertenencia_cultural_id: 0,
    telefono_email: '',
    datos_extras: {
      comentario: '',
      opinion: '',
      codigo_empleado: 0,
      idioma: 0,
      discapacidad: 0,
      unidad_administrativa: ''
    },
    capacitacion_id: 0,
    fecha_registro: ''
  }


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
            this.actividadAsignada = data;
            this.asistencia.capacitacion_id = this.actividadAsignada.id;

          })
          .catch((error) => {
            console.error('❌ Error al cargar actividad para edición:', error);
          });
      } else {
        console.warn('⚠️ ID inválido en la URL:', idParam);
      }

      //console.log(this.gruposEdad)

    }




  }
  volver(): void {
    this.router.navigate(['eventos']);
  }

  guardar(): void {
    const ahora = new Date();
    this.asistencia.fecha_registro = ahora.toISOString();

    this.api.asistenciaLink(this.asistencia)
      .then(() => {
        this.mostrarModal = true;   // Muestra modal al guardar

        setTimeout(() => {
          this.mostrarModal = false;
          this.volver();            // Vuelve después de 10 segundos
        }, 10000);

      })
      .catch((error) => {
        console.error('❌ Error al crear usuario:', error, this.asistencia);
      });
  }

  public opinion = ['bueno', 'Regular', 'Malo'];





}
