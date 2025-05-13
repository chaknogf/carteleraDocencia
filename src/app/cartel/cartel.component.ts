import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

export interface Evento {
  TEMA: string;
  ACTIVIDAD: number;
  DEPARTAMENTO_SERVICIO_ENCARGADO: string;
  PERSONA_RESPONSABLE: string | null;
  TIEMPO_APROXIMADO: string;
  FECHAS_A_DESARROLLAR: string;
  MODALIDAD: string;
  ESTADO: string | null;
  OBSERVACIONES: string | null;
}
@Component({
  selector: 'app-cartel',
  templateUrl: './cartel.component.html',
  styleUrls: ['./cartel.component.css'],
  standalone: true,
  imports: [CommonModule,]
})



export class CartelComponent {

  constructor(private router: Router) { }

  acceso() {
    this.router.navigate(['tabla']);
  }



  eventosDelMes: Evento[] = [
    {
      "TEMA": "Beneficios de la Lactancia Materna",
      "ACTIVIDAD": 1,
      "DEPARTAMENTO_SERVICIO_ENCARGADO": "NUTRICIÓN",
      "PERSONA_RESPONSABLE": "LCDA. ANA COLÓN",
      "TIEMPO_APROXIMADO": "2 horas",
      "FECHAS_A_DESARROLLAR": "Mayo",
      "MODALIDAD": "Presencial",
      "ESTADO": null,
      "OBSERVACIONES": null
    },
    {
      "TEMA": "Manejo Medicamentoso para el Aborto Incompleto: Misoprostol y Mifepristona",
      "ACTIVIDAD": 2,
      "DEPARTAMENTO_SERVICIO_ENCARGADO": "GINECOLOGÍA Y OBSTETRICIA",
      "PERSONA_RESPONSABLE": "Dra. Karen Junay y Médico EPS de especialidad",
      "TIEMPO_APROXIMADO": "50 minutos",
      "FECHAS_A_DESARROLLAR": "15/05/25",
      "MODALIDAD": "Virtual",
      "ESTADO": null,
      "OBSERVACIONES": null
    },
    {
      "TEMA": "Obligaciones y derechos de los trabajadores",
      "ACTIVIDAD": 2,
      "DEPARTAMENTO_SERVICIO_ENCARGADO": "ASESORÍA JURÍDICA",
      "PERSONA_RESPONSABLE": "Asesor Jurídico",
      "TIEMPO_APROXIMADO": "1 hora",
      "FECHAS_A_DESARROLLAR": "Mayo",
      "MODALIDAD": "Presencial",
      "ESTADO": null,
      "OBSERVACIONES": null
    },
    {
      "TEMA": "Manejo de Desechos Sólidos Hospitalarios según Acuerdo Gubernativo 509-2001",
      "ACTIVIDAD": 2,
      "DEPARTAMENTO_SERVICIO_ENCARGADO": "GESTIÓN AMBIENTAL",
      "PERSONA_RESPONSABLE": "Ing. Agr. Víctor Aldana",
      "TIEMPO_APROXIMADO": "1.5 horas",
      "FECHAS_A_DESARROLLAR": "Mayo",
      "MODALIDAD": "Presencial",
      "ESTADO": null,
      "OBSERVACIONES": "Todo el Personal (Personal operativo, asistencial, administrativo y médico)"
    },
    {
      "TEMA": "1. Código rojo y simulacros\n2. Atención de paciente con hipoglicemia e hiperglicemia\n3. Atención de paciente con hipotensión e hipertensión",
      "ACTIVIDAD": 1,
      "DEPARTAMENTO_SERVICIO_ENCARGADO": "ENFERMERÍA",
      "PERSONA_RESPONSABLE": null,
      "TIEMPO_APROXIMADO": "6 horas",
      "FECHAS_A_DESARROLLAR": "27 de mayo del 2025",
      "MODALIDAD": "Presencial",
      "ESTADO": null,
      "OBSERVACIONES": null
    },
    {
      "TEMA": "1. Rol de enfermero circulante e instrumentista\n2. Manejo del estrés en quirófano\n3. Importancia de la documentación quirúrgica\n4. Código rojo y simulacros\n5. Signos de alarma post anestesia",
      "ACTIVIDAD": 1,
      "DEPARTAMENTO_SERVICIO_ENCARGADO": "ENFERMERÍA",
      "PERSONA_RESPONSABLE": null,
      "TIEMPO_APROXIMADO": "6 horas",
      "FECHAS_A_DESARROLLAR": "28 de mayo del 2025",
      "MODALIDAD": "Presencial",
      "ESTADO": null,
      "OBSERVACIONES": null
    },
    {
      "TEMA": "1. Monitorización de signos vitales\n2. Cuidados de vía periférica, prevención de flebitis y sondas\n3. Infecciones asociadas a la salud\n4. Código rojo y simulacros",
      "ACTIVIDAD": 1,
      "DEPARTAMENTO_SERVICIO_ENCARGADO": "ENFERMERÍA",
      "PERSONA_RESPONSABLE": null,
      "TIEMPO_APROXIMADO": "6 horas",
      "FECHAS_A_DESARROLLAR": "29 de mayo del 2025",
      "MODALIDAD": "Presencial",
      "ESTADO": null,
      "OBSERVACIONES": null
    },
    {
      "TEMA": "1. Cuidados de vía periférica, prevención de flebitis y sondas\n2. Manejo de pacientes ventilados\n3. Infecciones asociadas a servicios de salud\n4. Monitorización de signos vitales",
      "ACTIVIDAD": 1,
      "DEPARTAMENTO_SERVICIO_ENCARGADO": "ENFERMERÍA",
      "PERSONA_RESPONSABLE": null,
      "TIEMPO_APROXIMADO": "6 horas",
      "FECHAS_A_DESARROLLAR": "30 de mayo del 2025",
      "MODALIDAD": "Presencial",
      "ESTADO": null,
      "OBSERVACIONES": null
    },
    {
      "TEMA": "Oxigenoterapia",
      "ACTIVIDAD": 2,
      "DEPARTAMENTO_SERVICIO_ENCARGADO": "TERAPIA RESPIRATORIA",
      "PERSONA_RESPONSABLE": "TR. ISABEL JEREZ",
      "TIEMPO_APROXIMADO": "45 MIN",
      "FECHAS_A_DESARROLLAR": "20 DE MAYO",
      "MODALIDAD": "Presencial",
      "ESTADO": null,
      "OBSERVACIONES": "PERSONAL DE ENFERMERÍA"
    }
  ];

}
