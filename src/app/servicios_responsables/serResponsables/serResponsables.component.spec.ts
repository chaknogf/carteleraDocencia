/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SerResponsablesComponent } from './serResponsables.component';

describe('SerResponsablesComponent', () => {
  let component: SerResponsablesComponent;
  let fixture: ComponentFixture<SerResponsablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SerResponsablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SerResponsablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
