/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CartelComponent } from './cartel.component';

describe('CartelComponent', () => {
  let component: CartelComponent;
  let fixture: ComponentFixture<CartelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CartelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
