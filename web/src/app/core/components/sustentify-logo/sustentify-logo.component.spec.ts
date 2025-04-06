import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SustentifyLogoComponent } from './sustentify-logo.component';

describe('SustentifyLogoComponent', () => {
  let component: SustentifyLogoComponent;
  let fixture: ComponentFixture<SustentifyLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SustentifyLogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SustentifyLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
