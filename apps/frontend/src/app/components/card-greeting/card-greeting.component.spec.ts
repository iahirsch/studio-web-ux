import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardGreetingComponent } from './card-greeting.component';

describe('CardGreetingComponent', () => {
  let component: CardGreetingComponent;
  let fixture: ComponentFixture<CardGreetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardGreetingComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardGreetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
