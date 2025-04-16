import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardTrainComponent } from './card-train.component';

describe('TrainConnectionComponent', () => {
  let component: CardTrainComponent;
  let fixture: ComponentFixture<CardTrainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTrainComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CardTrainComponent);
    component = fixture.componentInstance;


    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
