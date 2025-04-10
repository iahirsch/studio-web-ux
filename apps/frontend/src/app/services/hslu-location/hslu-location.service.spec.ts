import { TestBed } from '@angular/core/testing';

import { HsluLocationDataService } from './hslu-location.service';

describe('HsluLocationDataService', () => {
  let service: HsluLocationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HsluLocationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
