import { Component } from '@angular/core';

@Component({
  selector: 'app-ojp-request',
  templateUrl: './ojp-request.component.html',
  styleUrls: ['./ojp-request.component.css']
})
export class OjpRequestComponent {
  from: string = '';
  to: string = '';
  transport: string = 'car'; // Standardwert: Auto
  date: string = '';
  time: string = '';

  onFromChange(event: any) {
    this.from = event.target.value;
  }

  onToChange(event: any) {
    this.to = event.target.value;
  }

  onTransportChange(event: any) {
    this.transport = event.target.value;
  }

  onDateChange(event: any) {
    this.date = event.target.value;
  }

  onTimeChange(event: any) {
    this.time = event.target.value;
  }

  submit() {
    console.log('Abfahrtsort:', this.from);
    console.log('Zielort:', this.to);
    console.log('Verkehrsmittel:', this.transport);
    console.log('Datum:', this.date);
    console.log('Zeit:', this.time);
  }
}
