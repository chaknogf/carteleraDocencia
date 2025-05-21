import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',


})
export class AppComponent implements OnInit {
  title = 'cartelera';

  mostrarUsuario: boolean = false;

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    this.mostrarUsuario = !!token; // true si hay token, false si no

  }

  //recargarPagina() {
  //  window.location.reload();




}
