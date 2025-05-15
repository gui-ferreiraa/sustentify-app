import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsWrapperComponent } from './details-wrapper.component';

describe('DetailsWrapperComponent', () => {
  let component: DetailsWrapperComponent;
  let fixture: ComponentFixture<DetailsWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
