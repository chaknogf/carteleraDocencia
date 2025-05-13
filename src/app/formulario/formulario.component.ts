import { CommonModule } from '@angular/common';
import { NgForm, ReactiveFormsModule } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true
})
export class FormularioComponent implements OnInit {

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  volver() {
    // Lógica para volver al menú principal
    this.router.navigate(['tabla']);
  }

}
