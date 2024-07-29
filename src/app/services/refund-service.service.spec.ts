import { TestBed } from '@angular/core/testing';

import { RefundServiceService } from './refund-service.service';

describe('RefundServiceService', () => {
  let service: RefundServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefundServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
