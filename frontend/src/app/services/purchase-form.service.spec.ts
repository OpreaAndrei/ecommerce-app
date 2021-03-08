import { TestBed } from '@angular/core/testing';

import { PurchaseFormService } from './purchase-form.service';

describe('PurchaseFormService', () => {
  let service: PurchaseFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
