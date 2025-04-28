import { TestBed } from '@angular/core/testing';

import { IAChatService } from './iachat.service';

describe('IAChatService', () => {
  let service: IAChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IAChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
