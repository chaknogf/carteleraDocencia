import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Currentuser } from '../../interface/interfaces';
import { ApiService } from '../../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarioActual',
  templateUrl: './usuarioActual.component.html',
  styleUrls: ['./usuarioActual.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsuarioActualComponent implements OnInit {
  username: string = '';
  roleUser: string = '';

  constructor(
    private router: Router,
    private api: ApiService
  ) { }

  ngOnInit() {
    this.username = localStorage.getItem('username') || '';
    this.roleUser = localStorage.getItem('role') || '';


  }
}
