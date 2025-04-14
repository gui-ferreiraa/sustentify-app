import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestedFormComponent } from './interested-form.component';

describe('InterestedFormComponent', () => {
  let component: InterestedFormComponent;
  let fixture: ComponentFixture<InterestedFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InterestedFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InterestedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
