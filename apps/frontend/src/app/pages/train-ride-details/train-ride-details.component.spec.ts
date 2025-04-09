import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainRideDetailsComponent } from './train-ride-details.component';

describe('TrainDetailsComponent', () => {
  let component: TrainRideDetailsComponent;
  let fixture: ComponentFixture<TrainRideDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainRideDetailsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TrainRideDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
