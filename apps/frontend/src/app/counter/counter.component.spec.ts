import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CounterComponentComponent } from './counter.component';

describe('CounterComponentComponent', () => {
  let component: CounterComponentComponent;
  let fixture: ComponentFixture<CounterComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterComponentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
