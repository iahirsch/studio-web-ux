import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardMembersComponent } from './card-members.component';

describe('CardMembersComponent', () => {
  let component: CardMembersComponent;
  let fixture: ComponentFixture<CardMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMembersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CardMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
