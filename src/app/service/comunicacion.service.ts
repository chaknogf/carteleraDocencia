import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionService {
  private anioSeleccionadoSource = new BehaviorSubject<number>(new Date().getFullYear());
  anioSeleccionado$ = this.anioSeleccionadoSource.asObservable();

  setAnioSeleccionado(anio: number) {
    this.anioSeleccionadoSource.next(anio);
  }
}
