import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Display1Component } from './display1.component';

describe('Display1Component', () => {
  let component: Display1Component;
  let fixture: ComponentFixture<Display1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Display1Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Display1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
