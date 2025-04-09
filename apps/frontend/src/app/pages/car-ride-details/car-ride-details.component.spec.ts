import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarRideDetailsComponent } from './car-ride-details.component';

describe('CarDetailsComponent', () => {
  let component: CarRideDetailsComponent;
  let fixture: ComponentFixture<CarRideDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarRideDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CarRideDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
