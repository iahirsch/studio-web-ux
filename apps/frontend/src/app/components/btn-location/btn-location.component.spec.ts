import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BtnLocationComponent } from './btn-location.component';

describe('LocationButtonComponent', () => {
  let component: BtnLocationComponent;
  let fixture: ComponentFixture<BtnLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnLocationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BtnLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
