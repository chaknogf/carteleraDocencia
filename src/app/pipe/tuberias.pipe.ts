import { Pipe, PipeTransform } from '@angular/core';
import { mes, actividad, modalidad, estado } from '../interface/enum';

@Pipe({
  name: 'mes',
  standalone: true
})
export class EnumMesPipe implements PipeTransform {

  transform(value: any): string {
    const mesEncontrado = mes.find(mes => mes.value === value);
    if (mesEncontrado) {
      return mesEncontrado.label;
    } else {
      return ''
    }
  }

}


@Pipe({
  name: 'actividad',
  standalone: true
})
export class EnumActividadPipe implements PipeTransform {

  transform(value: number): string {
    const actividadEncontrada = actividad.find(actividad => actividad.value === value);
    if (actividadEncontrada) {
      return actividadEncontrada.label;
    } else {
      return ''
    }
  }

}

@Pipe({
  name: 'modalidad',
  standalone: true
})
export class EnumModalidadPipe implements PipeTransform {
  transform(value: any): string {
    const modalidadEncontrada = modalidad.find(modalidad => modalidad.value === value);
    if (modalidadEncontrada) {
      return modalidadEncontrada.label;
    } else {
      return ''
    }
  }
}

@Pipe({
  name: 'estado',
  standalone: true
})
export class EnumEstadoPipe implements PipeTransform {
  transform(value: any): string {
    const estadoEncontrado = estado.find(estado => estado.value === value);
    if (estadoEncontrado) {
      return estadoEncontrado.label;
    } else {
      return ''
    }
  }
}
