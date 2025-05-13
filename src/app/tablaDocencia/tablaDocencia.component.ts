import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-tablaDocencia',
  templateUrl: './tablaDocencia.component.html',
  styleUrls: ['./tablaDocencia.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class TablaDocenciaComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  editarDocencia(docencia: any) {
    this.router.navigate(['formulario']);
    // Lógica para editar la docencia
  }

  eliminarDocencia(docencia: any) {
    // Lógica para eliminar la docencia
  }

  agregarDocencia() {
    // Lógica para agregar una nueva docencia
    this.router.navigate(['formulario']);
  }

  volver() {
    // Lógica para volver al menú principal
    this.router.navigate(['eventos']);
  }

  data = [
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
    }
  ]


}
