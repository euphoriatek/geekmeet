/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EventaddComponent } from './eventadd.component';

describe('EventaddComponent', () => {
  let component: EventaddComponent;
  let fixture: ComponentFixture<EventaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
