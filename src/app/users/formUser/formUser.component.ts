import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Usuarios } from '../../interface/interfaces';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-formUser',
  templateUrl: './formUser.component.html',
  styleUrls: ['./formUser.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
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
    estado: ''
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
        this.api.getUser(id)
          .then((data) => {
            this.usuario = data;

            this.enEdicion = true;
            console.log('✅ Usuario cargado para edición');
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
    this.router.navigate(['tabla']);
  }

  agregar(): void {


    this.api.createUser(this.usuario)
      .then(() => {
        console.log('✅ Usuario creado correctamente');
        this.router.navigate(['tablaUsers']);
      })
      .catch((error) => {
        console.error('❌ Error al crear usuario:', error, this.usuario);
      });
  }

  async actualizar(): Promise<void> {

    try {
      await this.api.updateUser(this.usuario.id, this.usuario);
      console.log('✅ Usuario actualizado correctamente');


      this.router.navigate(['tabla']);
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
