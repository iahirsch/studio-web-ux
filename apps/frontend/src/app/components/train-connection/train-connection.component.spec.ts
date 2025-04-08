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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
