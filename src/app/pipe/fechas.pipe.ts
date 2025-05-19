import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaLarga',
  standalone: true
})
export class FechaLargaPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (!value) return null;

    // Si el valor es un string tipo 'YYYY-MM-DD'
    if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
      const date = new Date(year, month - 1, day);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
    }

    // Si es otro tipo de fecha
    const date = new Date(value);
    if (isNaN(date.getTime())) return value;
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  }

}
