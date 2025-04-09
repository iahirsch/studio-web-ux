import { TestBed } from '@angular/core/testing';

import { HsluLocationService } from './hslu-location.service';

describe('HsluLocationService', () => {
  let service: HsluLocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HsluLocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
