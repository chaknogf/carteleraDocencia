import { TablaDocenciaComponent } from './tablaDocencia/tablaDocencia.component';
import { Routes } from '@angular/router';
import { CartelComponent } from './cartel/cartel.component';
import { FormularioComponent } from './formulario/formulario.component';
import { TablaUsersComponent } from './users/tablaUsers/tablaUsers.component';
import { FormUserComponent } from './users/formUser/formUser.component';
import { ReporteActividadesComponent } from './reporteActividades/reporteActividades.component';
import { SignupComponent } from '../signup/signup.component';

export const routes: Routes = [
  { path: '', redirectTo: 'eventos', pathMatch: 'full' },
  { path: 'eventos', component: CartelComponent },
  { path: 'tabla', component: TablaDocenciaComponent },
  { path: 'formulario', component: FormularioComponent },
  { path: 'editarActividad/:id', component: FormularioComponent },
  { path: 'tablaUsers', component: TablaUsersComponent },
  { path: 'formularioUsers', component: FormUserComponent },
  { path: 'editarUser/:id', component: FormUserComponent },
  { path: 'reporteActividades', component: ReporteActividadesComponent },
  { path: 'signup', component: SignupComponent }

];
