import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../interface/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';
import { NavbarComponent } from "../../navs/navbar/navbar.component";

@Component({
  selector: 'app-formUser',
  templateUrl: './formUser.component.html',
  styleUrls: ['./formUser.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent]
})
export class FormUserComponent implements OnInit {

  public enEdicion: boolean = false;

  usuario: Usuarios = {
    id: 0,
    nombre: '',
    username: '',
    password: '',
    email: '',
    role: '',
    estado: '',
    servicio_id: 0,
    google_id: ''
  }


  constructor(

    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      const id = Number(idParam);
      if (!isNaN(id)) {
        this.api.getUsers({ id: id })
          .then((data) => {
            this.usuario = data[0];

            this.enEdicion = true;
            // console.log(this.usuario);
          })
          .catch((error) => {
            console.error('❌ Error al cargar usuario para edición:', error);
          });
      } else {
        console.warn('⚠️ ID inválido en la URL:', idParam);
      }
    } else {

    }
  }
  volver(): void {
    this.router.navigate(['tablaUsers']);
  }

  agregar(): void {


    this.api.createUser(this.usuario)
      .then(() => {
        // console.log('✅ Usuario creado correctamente');
        this.router.navigate(['tablaUsers']);
      })
      .catch((error) => {
        console.error('❌ Error al crear usuario:', error, this.usuario);
      });
  }

  async actualizar(): Promise<void> {

    try {
      await this.api.updateUser(this.usuario.id, this.usuario);
      // console.log('✅ Usuario actualizado correctamente');


      this.router.navigate(['tablaUsers']);
    } catch (error) {
      console.error('❌ Error al actualizar usuario:', error);
      console.log('Usuario a actualizar:', this.usuario);

    }
  }

  guardar(): void {

    this.enEdicion ? this.actualizar() : this.agregar();
  }




  // Asegúrese de ejecutar esto después de cargar `usuario.fechas_a_desarrollar`

}
