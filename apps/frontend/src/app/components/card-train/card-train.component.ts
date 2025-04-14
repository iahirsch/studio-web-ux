import { Component, Input, OnInit } from '@angular/core';

interface Connection {
  trainNumber: string;
  trainEndLocation: string;
  departure: string;
  arrival: string;
  duration: string;
  // Weitere benötigte Eigenschaften
}

@Component({
  selector: 'app-card-train',
  templateUrl: './card-train.component.html',
  styleUrls: ['./card-train.component.css']
})
export class CardTrainComponent implements OnInit {
  @Input() connection: Connection | null = null;


  ngOnInit(): void {
    // Überprüfen Sie, ob connection existiert
    if (!this.connection) {
      console.error('Keine Connection-Daten vorhanden');
    }
  }
}
