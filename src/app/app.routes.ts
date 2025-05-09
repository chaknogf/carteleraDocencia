import { Routes } from '@angular/router';
import { CartelComponent } from './cartel/cartel.component';

export const routes: Routes = [
  { path: '', redirectTo: 'eventos', pathMatch: 'full' },
  { path: 'eventos', component: CartelComponent }
];
