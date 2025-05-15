import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonGreenComponent } from './button-green.component';

describe('ButtonPrimaryComponent', () => {
  let component: ButtonGreenComponent;
  let fixture: ComponentFixture<ButtonGreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonGreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonGreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
