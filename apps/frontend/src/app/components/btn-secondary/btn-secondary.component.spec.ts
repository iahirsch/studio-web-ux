import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BtnSecondaryComponent } from './btn-secondary.component';

describe('BtnSecondaryComponent', () => {
  let component: BtnSecondaryComponent;
  let fixture: ComponentFixture<BtnSecondaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BtnSecondaryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BtnSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
