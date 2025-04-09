import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTrainComponent } from '../../components/card-train/card-train.component';
import { CardTrainDetailsComponent } from '../../components/card-train-details/card-train-details.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { CardMembersComponent } from '../../components/card-members/card-members.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';
import { BtnSecondaryComponent } from '../../components/btn-secondary/btn-secondary.component';

@Component({
  selector: 'app-train-event',
  imports: [CommonModule, CardTrainComponent, CardTrainDetailsComponent, ChatComponent, CardMembersComponent, BtnPrimaryComponent, BtnSecondaryComponent],
  templateUrl: './train-event.component.html',
  styleUrl: './train-event.component.css'
})
export class TrainEventComponent {
}
