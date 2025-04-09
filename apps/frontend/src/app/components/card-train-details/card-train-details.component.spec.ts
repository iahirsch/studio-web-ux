import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardTrainDetailsComponent } from './card-train-details.component';

describe('CardTrainDetailsComponent', () => {
  let component: CardTrainDetailsComponent;
  let fixture: ComponentFixture<CardTrainDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardTrainDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardTrainDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
