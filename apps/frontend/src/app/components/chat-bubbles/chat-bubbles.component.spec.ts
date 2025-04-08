import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChatBubblesComponent } from './chat-bubbles.component';

describe('ChatBubblesComponent', () => {
  let component: ChatBubblesComponent;
  let fixture: ComponentFixture<ChatBubblesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatBubblesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatBubblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
