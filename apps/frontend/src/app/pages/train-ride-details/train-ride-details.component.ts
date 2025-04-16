import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTrainComponent } from '../../components/card-train/card-train.component';
import { CardMembersComponent } from '../../components/card-members/card-members.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';
import { TrainConnection, TrainConnectionService } from '../../services/train-connection/train-conntection.service';
import { CardTrainDetailsComponent } from '../../components/card-train-details/card-train-details.component';
import { TripTimedLeg } from 'ojp-sdk';
import { Router } from '@angular/router';

@Component({
  selector: 'app-train-ride-details',
  imports: [CommonModule, CardTrainComponent, CardTrainDetailsComponent, CardMembersComponent, BtnPrimaryComponent],
  templateUrl: './train-ride-details.component.html',
  styleUrl: './train-ride-details.component.css'
})
export class TrainRideDetailsComponent implements OnInit {
  public router = inject(Router);
  private trainConnectionService = inject(TrainConnectionService);

  selectedConnection = signal<TrainConnection | null>(null);
  trainLegs = signal<TripTimedLeg[]>([]);

  ngOnInit() {
    // Verbindung aus dem Service holen
    const connection = this.trainConnectionService.getSelectedConnection();
    this.selectedConnection.set(connection);
    this.trainLegs.set(connection?.legs ?? []);
  }

}
