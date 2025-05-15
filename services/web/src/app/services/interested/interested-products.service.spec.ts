import { TestBed } from '@angular/core/testing';

import { InterestedProductsService } from './interested-products.service';

describe('InterestedProductsService', () => {
  let service: InterestedProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterestedProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
