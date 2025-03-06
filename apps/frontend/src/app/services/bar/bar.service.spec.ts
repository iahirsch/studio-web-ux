import { TestBed } from '@angular/core/testing';
import { BarService } from './bar.service';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('BarService', () => {
  let service: BarService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(BarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
