import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TravelSearchComponent } from './travel-search.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TravelSearchComponent', () => {
  let component: TravelSearchComponent;
  let fixture: ComponentFixture<TravelSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravelSearchComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(TravelSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
