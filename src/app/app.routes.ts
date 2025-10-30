import { AutorizadoComponent } from './reports/autorizado/autorizado.component';
import { TablaDocenciaComponent } from './tablaDocencia/tablaDocencia.component';
import { Routes } from '@angular/router';
import { CartelComponent } from './cartel/cartel.component';
import { FormularioComponent } from './formulario/formulario.component';
import { TablaUsersComponent } from './users/tablaUsers/tablaUsers.component';
import { FormUserComponent } from './users/formUser/formUser.component';
import { DashboardComponent } from './dashboar/dashboard.component';
import { SignupComponent } from '../signup/signup.component';

export const routes: Routes = [
  { path: '', component: CartelComponent, pathMatch: 'full' },
  { path: 'eventos', component: CartelComponent },
  { path: 'tabla', component: TablaDocenciaComponent },
  { path: 'formulario', component: FormularioComponent },
  { path: 'editarActividad/:id', component: FormularioComponent },
  { path: 'tablaUsers', component: TablaUsersComponent },
  { path: 'formularioUsers', component: FormUserComponent },
  { path: 'editarUser/:id', component: FormUserComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'autorizado', component: AutorizadoComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' }

];
