import { discapacidades, idiomas, pertenencia } from './../interface/enum';
import { Pipe, PipeTransform } from '@angular/core';
import { mes, actividad, modalidad, estado, grupoEdad } from '../interface/enum';

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

@Pipe({
  name: 'grupoEdad',
  standalone: true
})
export class GrupoEdadPipe implements PipeTransform {
  transform(value: any): string {
    const grupoEdadEncontrado = grupoEdad.find(grupoEdad => grupoEdad.value === value);
    if (grupoEdadEncontrado) {
      return grupoEdadEncontrado.label;
    } else {
      return ''
    }
  }
}

@Pipe({
  name: 'pertenencia',
  standalone: true
})
export class PertenenciaPipe implements PipeTransform {
  transform(value: any): string {
    const pertenenciaEncontrado = pertenencia.find(pertenencia => pertenencia.value === value);
    if (pertenenciaEncontrado) {
      return pertenenciaEncontrado.label;
    } else {
      return ''
    }
  }
}

@Pipe({
  name: 'idioma',
  standalone: true
})
export class IdiomaPipe implements PipeTransform {
  transform(value: any): string {
    const idiomaEncontrado = idiomas.find(idiomas => idiomas.value === value);
    if (idiomaEncontrado) {
      return idiomaEncontrado.label;
    } else {
      return ''
    }
  }
}

@Pipe({
  name: 'discapacidad',
  standalone: true
})
export class DiscapacidadPipe implements PipeTransform {
  transform(value: any): string {
    const discapacidadEncontrado = discapacidades.find(discapacidades => discapacidades.value === value);
    if (discapacidadEncontrado) {
      return discapacidadEncontrado.label;
    } else {
      return ''
    }
  }
}


