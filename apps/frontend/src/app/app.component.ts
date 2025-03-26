import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OjpService } from './services/ojp/ojp.service';

@Component({
  imports: [RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'frontend';
  connections: any[] = [];

  constructor(private ojpService: OjpService) { }

  onSearch(data: { from: string; to: string }) {
    this.ojpService.searchConnections(data.from, data.to).subscribe((result) => {
      this.connections = result.connections; // kommt aus parsed XML
    });
  }
}
