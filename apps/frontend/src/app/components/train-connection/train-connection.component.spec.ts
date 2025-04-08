import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainConnectionComponent } from './train-connection.component';

describe('TrainConnectionComponent', () => {
  let component: TrainConnectionComponent;
  let fixture: ComponentFixture<TrainConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainConnectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainConnectionComponent);
    component = fixture.componentInstance;

    // Mock-Daten für die Verbindung bereitstellen
    component.connection = {
      departure: '2025-04-08T08:00:00',
      arrival: '2025-04-08T09:00:00',
      duration: '1h 0min',
      transfers: 1,
      platforms: ['1', '2'],
      legs: [
        {
          from: 'Station A',
          to: 'Station B',
          departure: '2025-04-08T08:00:00',
          arrival: '2025-04-08T08:30:00',
          platform: '1',
        },
        {
          from: 'Station B',
          to: 'Station C',
          departure: '2025-04-08T08:40:00',
          arrival: '2025-04-08T09:00:00',
          platform: '2',
        },
      ],
    };

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
