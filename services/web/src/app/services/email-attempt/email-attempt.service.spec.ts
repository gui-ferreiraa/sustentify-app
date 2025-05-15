import { TestBed } from '@angular/core/testing';

import { EmailAttemptService } from './email-attempt.service';

describe('EmailAttemptService', () => {
  let service: EmailAttemptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmailAttemptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
