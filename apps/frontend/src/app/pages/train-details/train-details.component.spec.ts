import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrainDetailsComponent } from './train-details.component';

describe('TrainDetailsComponent', () => {
  let component: TrainDetailsComponent;
  let fixture: ComponentFixture<TrainDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TrainDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
