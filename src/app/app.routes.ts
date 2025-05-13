import { TablaDocenciaComponent } from './tablaDocencia/tablaDocencia.component';
import { Routes } from '@angular/router';
import { CartelComponent } from './cartel/cartel.component';
import { FormularioComponent } from './formulario/formulario.component';

export const routes: Routes = [
  { path: '', redirectTo: 'eventos', pathMatch: 'full' },
  { path: 'eventos', component: CartelComponent },
  { path: 'tabla', component: TablaDocenciaComponent },
  { path: 'formulario', component: FormularioComponent }
];
