import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainEventComponent } from './train-event.component';

describe('TrainEventComponent', () => {
  let component: TrainEventComponent;
  let fixture: ComponentFixture<TrainEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainEventComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
