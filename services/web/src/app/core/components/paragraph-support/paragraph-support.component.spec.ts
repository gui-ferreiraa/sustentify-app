import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParagraphSupportComponent } from './paragraph-support.component';

describe('ParagraphSupportComponent', () => {
  let component: ParagraphSupportComponent;
  let fixture: ComponentFixture<ParagraphSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParagraphSupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParagraphSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
