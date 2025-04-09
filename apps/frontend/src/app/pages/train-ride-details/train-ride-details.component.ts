import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTrainComponent } from '../../components/card-train/card-train.component';
import { CardTrainDetailsComponent } from '../../components/card-train-details/card-train-details.component';
import { CardMembersComponent } from '../../components/card-members/card-members.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';

@Component({
  selector: 'app-train-ride-details',
  imports: [CommonModule, CardTrainComponent, CardTrainDetailsComponent, CardMembersComponent, BtnPrimaryComponent],
  templateUrl: './train-ride-details.component.html',
  styleUrl: './train-ride-details.component.css'
})
export class TrainRideDetailsComponent {
}
