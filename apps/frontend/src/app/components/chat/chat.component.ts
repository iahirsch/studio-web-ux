import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatBubblesComponent } from '../chat-bubbles/chat-bubbles.component';
import { InputTextareaComponent } from '../input-textarea/input-textarea.component';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, ChatBubblesComponent, InputTextareaComponent],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  connectionId = input<string | null>(null);
}
