import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsTrendingsComponent } from './products-trendings.component';

describe('ProductsTrendingsComponent', () => {
  let component: ProductsTrendingsComponent;
  let fixture: ComponentFixture<ProductsTrendingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsTrendingsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsTrendingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
